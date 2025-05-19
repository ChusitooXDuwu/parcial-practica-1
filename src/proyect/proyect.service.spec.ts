import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProyectService } from './proyect.service';
import { Proyect } from './entities/proyect.entity';
import { Student } from '../student/entities/student.entity';
import { Professor } from '../professor/entities/professor.entity';
import { CreateProyectDto } from './dto/create-proyect.dto';
import { ProyectController } from './proyect.controller';

describe('ProyectService', () => {
  let service: ProyectService;
  let proyectRepository: jest.Mocked<Repository<Proyect>>;
  let studentRepository: jest.Mocked<Repository<Student>>;
  let professorRepository: jest.Mocked<Repository<Professor>>;

  const mockProyectRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    merge: jest.fn(),
  });

  const mockStudentRepository = () => ({
    findOneBy: jest.fn(),
  });

  const mockProfessorRepository = () => ({
    findOneBy: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectService,
        {
          provide: getRepositoryToken(Proyect),
          useFactory: mockProyectRepository,
        },
        {
          provide: getRepositoryToken(Student),
          useFactory: mockStudentRepository,
        },
        {
          provide: getRepositoryToken(Professor),
          useFactory: mockProfessorRepository,
        },
      ],
    }).compile();

    service = module.get<ProyectService>(ProyectService);
    proyectRepository = module.get(getRepositoryToken(Proyect)) as jest.Mocked<Repository<Proyect>>;
    studentRepository = module.get(getRepositoryToken(Student)) as jest.Mocked<Repository<Student>>;
    professorRepository = module.get(getRepositoryToken(Professor)) as jest.Mocked<Repository<Professor>>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crearProyecto', () => {
    it('should create a project when title length > 15 and presupuesto > 0', async () => {
      // Arrange
      const createProyectDto: CreateProyectDto = {
        titulo: 'This is a valid project title',
        area: 'Computer Science',
        presupuesto: 1000,
        notaFinal: 0,
        estado: 0,
        fechaInicio: '2025-01-01',
        fechaFin: '2025-12-31',
        liderId: 1,
        mentorId: 2,
      };
      
      const lider = { id: 1, nombre: 'Student Leader' } as Student;
      const mentor = { id: 2, nombre: 'Professor Mentor' } as Professor;
      
      const newProyect = { 
        ...createProyectDto, 
        id: 1,
        lider,
        mentor,
        evaluaciones: [],
      };
      
      studentRepository.findOneBy.mockResolvedValue(lider);
      professorRepository.findOneBy.mockResolvedValue(mentor);
      proyectRepository.create.mockReturnValue(newProyect as Proyect);
      proyectRepository.save.mockResolvedValue(newProyect as Proyect);

      // Act
      const result = await service.crearProyecto(createProyectDto);

      // Assert
      expect(proyectRepository.create).toHaveBeenCalledWith({
        ...createProyectDto,
        estado: 0,
      });
      expect(studentRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(professorRepository.findOneBy).toHaveBeenCalledWith({ id: 2 });
      expect(proyectRepository.save).toHaveBeenCalledWith(newProyect);
      expect(result).toEqual(newProyect);
    });

    it('should throw an error when presupuesto <= 0', async () => {
      // Arrange
      const createProyectDto: CreateProyectDto = {
        titulo: 'This is a valid project title',
        area: 'Computer Science',
        presupuesto: 0, // Invalid presupuesto
        notaFinal: 0,
        estado: 0,
        fechaInicio: '2025-01-01',
        fechaFin: '2025-12-31',
        liderId: 1,
        mentorId: 2,
      };

      // Act & Assert
      await expect(service.crearProyecto(createProyectDto)).rejects.toThrow(
        'El presupuesto debe ser mayor a 0'
      );
      expect(proyectRepository.create).not.toHaveBeenCalled();
    });

    it('should throw an error when title length <= 15', async () => {
      // Arrange
      const createProyectDto: CreateProyectDto = {
        titulo: 'Short title', // Invalid title length
        area: 'Computer Science',
        presupuesto: 1000,
        notaFinal: 0,
        estado: 0,
        fechaInicio: '2025-01-01',
        fechaFin: '2025-12-31',
        liderId: 1,
        mentorId: 2,
      };

      // Act & Assert
      await expect(service.crearProyecto(createProyectDto)).rejects.toThrow(
        'El título debe tener más de 15 caracteres'
      );
      expect(proyectRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('avanzarProyecto', () => {
    it('should advance the project state by 1 when not at max state', async () => {
      // Arrange
      const proyectId = 1;
      const proyecto = {
        id: proyectId,
        estado: 2, // Current state
      } as Proyect;
      
      proyectRepository.findOneBy.mockResolvedValue(proyecto);
      proyectRepository.save.mockResolvedValue({ ...proyecto, estado: 3 } as Proyect);

      // Act
      const result = await service.avanzarProyecto(proyectId);

      // Assert
      expect(proyectRepository.findOneBy).toHaveBeenCalledWith({ id: proyectId });
      expect(proyectRepository.save).toHaveBeenCalledWith({ ...proyecto, estado: 3 });
      expect(result.estado).toBe(3);
    });

    it('should throw an error when project is already at max state', async () => {
      // Arrange
      const proyectId = 1;
      const proyecto = {
        id: proyectId,
        estado: 4, // Already at max state
      } as Proyect;
      
      proyectRepository.findOneBy.mockResolvedValue(proyecto);

      // Act & Assert
      await expect(service.avanzarProyecto(proyectId)).rejects.toThrow(
        'El proyecto ya está en su estado máximo'
      );
      expect(proyectRepository.findOneBy).toHaveBeenCalledWith({ id: proyectId });
      expect(proyectRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAllEstudiantes', () => {
    it('should return a list with the leader student if project exists', async () => {
      // Arrange
      const proyectId = 1;
      const lider = { id: 2, nombre: 'Student Leader' } as Student;
      const proyecto = {
        id: proyectId,
        lider,
      } as Proyect;
      
      proyectRepository.findOne.mockResolvedValue(proyecto);

      // Act
      const result = await service.findAllEstudiantes(proyectId);

      // Assert
      expect(proyectRepository.findOne).toHaveBeenCalledWith({
        where: { id: proyectId },
        relations: ['lider'],
      });
      expect(result).toEqual([lider]);
    });

    it('should return an empty array if project has no leader', async () => {
      // Arrange
      const proyectId = 1;
      const proyecto = {
        id: proyectId,
        titulo: 'Test Project',
        area: 'Test Area',
        presupuesto: 1000,
        notaFinal: 0,
        estado: 0,
        fechaInicio: '2025-01-01',
        fechaFin: '2025-12-31',
        lider: null,
        mentor: null,
        evaluaciones: []
      } as unknown as Proyect;
      
      proyectRepository.findOne.mockResolvedValue(proyecto);

      // Act
      const result = await service.findAllEstudiantes(proyectId);

      // Assert
      expect(proyectRepository.findOne).toHaveBeenCalledWith({
        where: { id: proyectId },
        relations: ['lider'],
      });
      expect(result).toEqual([]);
    });
  });
});