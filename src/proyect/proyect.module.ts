import { Module } from '@nestjs/common';
import { ProyectService } from './proyect.service';
import { ProyectController } from './proyect.controller';

@Module({
  controllers: [ProyectController],
  providers: [ProyectService],
})
export class ProyectModule {}
