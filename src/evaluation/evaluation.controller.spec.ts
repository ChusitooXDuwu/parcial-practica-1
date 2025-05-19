import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EvaluationController } from './evaluation.controller';
import { EvaluationService } from './evaluation.service';
import { Evaluation } from './entities/evaluation.entity';
import { Proyect } from '../proyect/entities/proyect.entity';
import { Professor } from '../professor/entities/professor.entity';

describe('EvaluationController', () => {
  let controller: EvaluationController;

  const mockEvaluationRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    merge: jest.fn(),
  });

  const mockProyectRepository = () => ({
    findOne: jest.fn(),
    findOneBy: jest.fn(),
  });

  const mockProfessorRepository = () => ({
    findOne: jest.fn(),
    findOneBy: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluationController],
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

    controller = module.get<EvaluationController>(EvaluationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
