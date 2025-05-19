import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectService } from './proyect.service';
import { ProyectController } from './proyect.controller';
import { Proyect } from './entities/proyect.entity';
import { Student } from '../student/entities/student.entity';
import { Professor } from '../professor/entities/professor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proyect, Student, Professor]),
  ],
  controllers: [ProyectController],
  providers: [ProyectService],
  exports: [ProyectService],
})
export class ProyectModule {}