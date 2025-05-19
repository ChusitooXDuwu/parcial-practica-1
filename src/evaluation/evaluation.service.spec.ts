import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvaluationService } from './evaluation.service';
import { Evaluation } from './entities/evaluation.entity';
import { Proyect } from '../proyect/entities/proyect.entity';
import { Professor } from '../professor/entities/professor.entity';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';

describe('EvaluationService', () => {
  let service: EvaluationService;
  let evaluationRepository: jest.Mocked<Repository<Evaluation>>;
  let proyectRepository: jest.Mocked<Repository<Proyect>>;
  let professorRepository: jest.Mocked<Repository<Professor>>;

  const mockEvaluationRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });

  const mockProyectRepository = () => ({
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
  });

  const mockProfessorRepository = () => ({
    findOneBy: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluationService,
        {
          provide: getRepositoryToken(Evaluation),
          useFactory: mockEvaluationRepository,
        },
        {
          provide: getRepositoryToken(Proyect),
          useFactory: mockProyectRepository,
        },
        {
          provide: getRepositoryToken(Professor),
          useFactory: mockProfessorRepository,
        },
      ],
    }).compile();

    service = module.get<EvaluationService>(EvaluationService);
    evaluationRepository = module.get(getRepositoryToken(Evaluation)) as jest.Mocked<Repository<Evaluation>>;
    proyectRepository = module.get(getRepositoryToken(Proyect)) as jest.Mocked<Repository<Proyect>>;
    professorRepository = module.get(getRepositoryToken(Professor)) as jest.Mocked<Repository<Professor>>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('crearEvaluacion', () => {
    it('should create an evaluation when evaluator is not the mentor and calificacion is valid', async () => {
      // Arrange
      const createEvaluationDto: CreateEvaluationDto = {
        proyectoId: 1,
        profesorId: 2,
        calificacion: 4,
      };
      
      const mentor = { id: 3, nombre: 'Mentor Professor' } as Professor;
      const evaluator = { id: 2, nombre: 'Evaluator Professor' } as Professor;
      const proyecto = { 
        id: 1, 
        mentor, 
        notaFinal: 0 
      } as Proyect;
      
      const newEvaluation = { 
        id: 1,
        proyecto,
        profesor: evaluator,
      } as Evaluation;
      
      proyectRepository.findOne.mockResolvedValue(proyecto);
      professorRepository.findOneBy.mockResolvedValue(evaluator);
      evaluationRepository.create.mockReturnValue(newEvaluation);
      evaluationRepository.save.mockResolvedValue(newEvaluation);
      proyectRepository.save.mockResolvedValue({ ...proyecto, notaFinal: 4 });

      // Act
      const result = await service.crearEvaluacion(createEvaluationDto);

      // Assert
      expect(proyectRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['mentor'],
      });
      expect(professorRepository.findOneBy).toHaveBeenCalledWith({ id: 2 });
      expect(evaluationRepository.create).toHaveBeenCalledWith({
        proyecto,
        profesor: evaluator,
      });
      expect(proyectRepository.save).toHaveBeenCalledWith({ ...proyecto, notaFinal: 4 });
      expect(evaluationRepository.save).toHaveBeenCalledWith(newEvaluation);
      expect(result).toEqual(newEvaluation);
    });

    it('should throw an error when evaluator is the same as mentor', async () => {
      // Arrange
      const mentorId = 2;
      const createEvaluationDto: CreateEvaluationDto = {
        proyectoId: 1,
        profesorId: mentorId, // Same as mentor
        calificacion: 4,
      };
      
      const mentor = { id: mentorId, nombre: 'Professor' } as Professor;
      const proyecto = { 
        id: 1, 
        mentor, 
      } as Proyect;
      
      proyectRepository.findOne.mockResolvedValue(proyecto);
      professorRepository.findOneBy.mockResolvedValue(mentor);

      // Act & Assert
      await expect(service.crearEvaluacion(createEvaluationDto)).rejects.toThrow(
        'El evaluador no puede ser el mentor del proyecto'
      );
      expect(proyectRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['mentor'],
      });
      expect(professorRepository.findOneBy).toHaveBeenCalledWith({ id: mentorId });
      expect(evaluationRepository.create).not.toHaveBeenCalled();
      expect(evaluationRepository.save).not.toHaveBeenCalled();
    });

    it('should throw an error when calificacion is not between 0 and 5', async () => {
      // Arrange
      const createEvaluationDto: CreateEvaluationDto = {
        proyectoId: 1,
        profesorId: 2,
        calificacion: 6, // Invalid calificacion
      };
      
      const mentor = { id: 3, nombre: 'Mentor Professor' } as Professor;
      const evaluator = { id: 2, nombre: 'Evaluator Professor' } as Professor;
      const proyecto = { 
        id: 1, 
        mentor, 
      } as Proyect;
      
      proyectRepository.findOne.mockResolvedValue(proyecto);
      professorRepository.findOneBy.mockResolvedValue(evaluator);

      // Act & Assert
      await expect(service.crearEvaluacion(createEvaluationDto)).rejects.toThrow(
        'La calificación debe estar entre 0 y 5'
      );
      expect(proyectRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['mentor'],
      });
      expect(professorRepository.findOneBy).toHaveBeenCalledWith({ id: 2 });
      expect(evaluationRepository.create).not.toHaveBeenCalled();
      expect(evaluationRepository.save).not.toHaveBeenCalled();
    });
  });
});