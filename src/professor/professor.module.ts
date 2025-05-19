import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessorService } from './professor.service';
import { ProfessorController } from './professor.controller';
import { Professor } from './entities/professor.entity';
import { Evaluation } from '../evaluation/entities/evaluation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Professor, Evaluation]),
  ],
  controllers: [ProfessorController],
  providers: [ProfessorService],
  exports: [ProfessorService],
})
export class ProfessorModule {}