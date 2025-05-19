import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessorService } from './professor.service';
import { Professor } from './entities/professor.entity';
import { Evaluation } from '../evaluation/entities/evaluation.entity';
import { CreateProfessorDto } from './dto/create-professor.dto';

describe('ProfessorService', () => {
  let service: ProfessorService;
  let professorRepository: jest.Mocked<Repository<Professor>>;
  let evaluationRepository: jest.Mocked<Repository<Evaluation>>;

  const mockProfessorRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  });

  const mockEvaluationRepository = () => ({
    count: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessorService,
        {
          provide: getRepositoryToken(Professor),
          useFactory: mockProfessorRepository,
        },
        {
          provide: getRepositoryToken(Evaluation),
          useFactory: mockEvaluationRepository,
        },
      ],
    }).compile();

    service = module.get<ProfessorService>(ProfessorService);
    professorRepository = module.get(getRepositoryToken(Professor)) as jest.Mocked<Repository<Professor>>;
    evaluationRepository = module.get(getRepositoryToken(Evaluation)) as jest.Mocked<Repository<Evaluation>>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crearProfesor', () => {
    it('should create a professor when extension has exactly 5 digits', async () => {
      // Arrange
      const createProfessorDto: CreateProfessorDto = {
        cedula: 123456789,
        nombre: 'Test Professor',
        departamento: 'Computer Science',
        extension: 12345,
        esParEvaluador: false,
      };
      const newProfessor = { ...createProfessorDto, id: 1 };
      
      professorRepository.create.mockReturnValue(newProfessor as Professor);
      professorRepository.save.mockResolvedValue(newProfessor as Professor);

      // Act
      const result = await service.crearProfesor(createProfessorDto);

      // Assert
      expect(professorRepository.create).toHaveBeenCalledWith({
        ...createProfessorDto,
        esParEvaluador: false,
      });
      expect(professorRepository.save).toHaveBeenCalledWith(newProfessor);
      expect(result).toEqual(newProfessor);
    });

    it('should throw an error when extension does not have exactly 5 digits', async () => {
      // Arrange
      const createProfessorDto: CreateProfessorDto = {
        cedula: 123456789,
        nombre: 'Test Professor',
        departamento: 'Computer Science',
        extension: 1234, // Only 4 digits
        esParEvaluador: false,
      };

      // Act & Assert
      await expect(service.crearProfesor(createProfessorDto)).rejects.toThrow(
        'La extensión debe tener exactamente 5 dígitos'
      );
      expect(professorRepository.create).not.toHaveBeenCalled();
      expect(professorRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('asignarEvaluador', () => {
    it('should assign professor as evaluator when they have less than 3 active evaluations', async () => {
      // Arrange
      const professorId = 1;
      evaluationRepository.count.mockResolvedValue(2); // Less than 3 evaluations
      professorRepository.update.mockResolvedValue({ affected: 1, raw: {}, generatedMaps: [] });

      // Act
      const result = await service.asignarEvaluador(professorId);

      // Assert
      expect(evaluationRepository.count).toHaveBeenCalledWith({
        where: { profesor: { id: professorId } },
      });
      expect(professorRepository.update).toHaveBeenCalledWith(professorId, { esParEvaluador: true });
      expect(result).toEqual({ message: 'Profesor asignado como par evaluador' });
    });

    it('should throw an error when professor already has 3 or more active evaluations', async () => {
      // Arrange
      const professorId = 1;
      evaluationRepository.count.mockResolvedValue(3); // Already has 3 evaluations

      // Act & Assert
      await expect(service.asignarEvaluador(professorId)).rejects.toThrow(
        'El profesor ya tiene 3 evaluaciones activas'
      );
      expect(evaluationRepository.count).toHaveBeenCalledWith({
        where: { profesor: { id: professorId } },
      });
      expect(professorRepository.update).not.toHaveBeenCalled();
    });
  });
});