import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProfessorController } from './professor.controller';
import { ProfessorService } from './professor.service';
import { Professor } from './entities/professor.entity';
import { Evaluation } from '../evaluation/entities/evaluation.entity';

describe('ProfessorController', () => {
  let controller: ProfessorController;

  const mockProfessorRepository = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    merge: jest.fn(),
  });

  const mockEvaluationRepository = () => ({
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfessorController],
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

    controller = module.get<ProfessorController>(ProfessorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
