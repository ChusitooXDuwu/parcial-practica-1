import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProyectController } from './proyect.controller';
import { ProyectService } from './proyect.service';
import { Proyect } from './entities/proyect.entity';
import { Student } from '../student/entities/student.entity';
import { Professor } from '../professor/entities/professor.entity';

describe('ProyectController', () => {
  let controller: ProyectController;

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
      controllers: [ProyectController],
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

    controller = module.get<ProyectController>(ProyectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
