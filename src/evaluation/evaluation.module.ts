import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';
import { Evaluation } from './entities/evaluation.entity';
import { Proyect } from '../proyect/entities/proyect.entity';
import { Professor } from '../professor/entities/professor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evaluation, Proyect, Professor]),
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService],
  exports: [EvaluationService],
})
export class EvaluationModule {}