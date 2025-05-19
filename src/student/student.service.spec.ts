import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentService } from './student.service';
import { Student } from './entities/student.entity';
import { Proyect } from '../proyect/entities/proyect.entity';
import { CreateStudentDto } from './dto/create-student.dto';

describe('StudentService', () => {
  let service: StudentService;
  let studentRepository: jest.Mocked<Repository<Student>>;
  let proyectRepository: jest.Mocked<Repository<Proyect>>;

  const mockStudentRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  const mockProyectRepository = () => ({
    count: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getRepositoryToken(Student),
          useFactory: mockStudentRepository,
        },
        {
          provide: getRepositoryToken(Proyect),
          useFactory: mockProyectRepository,
        },
      ],
    }).compile();

    service = module.get<StudentService>(StudentService);
    studentRepository = module.get(getRepositoryToken(Student)) as jest.Mocked<Repository<Student>>;
    proyectRepository = module.get(getRepositoryToken(Proyect)) as jest.Mocked<Repository<Proyect>>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crearEstudiante', () => {
    it('should create a student successfully when promedio > 3.2 and semestre >= 4', async () => {
      // Arrange
      const createStudentDto: CreateStudentDto = {
        cedula: 123456789,
        nombre: 'Test Student',
        semestre: 5,
        programa: 'Computer Science',
        promedio: 4.0,
      };
      const newStudent = { ...createStudentDto, id: 1 };
      
      studentRepository.create.mockReturnValue(newStudent as Student);
      studentRepository.save.mockResolvedValue(newStudent as Student);

      // Act
      const result = await service.crearEstudiante(createStudentDto);

      // Assert
      expect(studentRepository.create).toHaveBeenCalledWith(createStudentDto);
      expect(studentRepository.save).toHaveBeenCalledWith(newStudent);
      expect(result).toEqual(newStudent);
    });

    it('should throw an error when promedio <= 3.2', async () => {
      // Arrange
      const createStudentDto: CreateStudentDto = {
        cedula: 123456789,
        nombre: 'Test Student',
        semestre: 5,
        programa: 'Computer Science',
        promedio: 3.0,
      };

      // Act & Assert
      await expect(service.crearEstudiante(createStudentDto)).rejects.toThrow(
        'El estudiante debe tener promedio > 3.2 y semestre ≥ 4'
      );
      expect(studentRepository.create).not.toHaveBeenCalled();
      expect(studentRepository.save).not.toHaveBeenCalled();
    });

    it('should throw an error when semestre < 4', async () => {
      // Arrange
      const createStudentDto: CreateStudentDto = {
        cedula: 123456789,
        nombre: 'Test Student',
        semestre: 3,
        programa: 'Computer Science',
        promedio: 4.0,
      };

      // Act & Assert
      await expect(service.crearEstudiante(createStudentDto)).rejects.toThrow(
        'El estudiante debe tener promedio > 3.2 y semestre ≥ 4'
      );
      expect(studentRepository.create).not.toHaveBeenCalled();
      expect(studentRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('eliminarEstudiante', () => {
    it('should delete a student if they have no active projects', async () => {
      // Arrange
      const studentId = 1;
      proyectRepository.count.mockResolvedValue(0);
      studentRepository.delete.mockResolvedValue({ affected: 1, raw: {} });

      // Act
      const result = await service.eliminarEstudiante(studentId);

      // Assert
      expect(proyectRepository.count).toHaveBeenCalledWith({
        where: { lider: { id: studentId }, estado: expect.anything() },
      });
      expect(studentRepository.delete).toHaveBeenCalledWith(studentId);
      expect(result).toEqual({ affected: 1, raw: {} });
    });

    it('should throw an error if student has active projects', async () => {
      // Arrange
      const studentId = 1;
      proyectRepository.count.mockResolvedValue(2); // Student has active projects

      // Act & Assert
      await expect(service.eliminarEstudiante(studentId)).rejects.toThrow(
        'No se puede eliminar el estudiante con proyectos activos'
      );
      expect(proyectRepository.count).toHaveBeenCalledWith({
        where: { lider: { id: studentId }, estado: expect.anything() },
      });
      expect(studentRepository.delete).not.toHaveBeenCalled();
    });
  });
});