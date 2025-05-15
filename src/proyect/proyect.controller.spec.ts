import { Test, TestingModule } from '@nestjs/testing';
import { ProyectController } from './proyect.controller';
import { ProyectService } from './proyect.service';

describe('ProyectController', () => {
  let controller: ProyectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProyectController],
      providers: [ProyectService],
    }).compile();

    controller = module.get<ProyectController>(ProyectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
