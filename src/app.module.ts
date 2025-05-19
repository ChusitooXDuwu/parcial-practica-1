import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProyectModule } from './proyect/proyect.module';
import { StudentModule } from './student/student.module';
import { ProfessorModule } from './professor/professor.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { Student } from './student/entities/student.entity';
import { Professor } from './professor/entities/professor.entity';
import { Proyect } from './proyect/entities/proyect.entity';
import { Evaluation } from './evaluation/entities/evaluation.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      entities: [Student, Professor, Proyect, Evaluation],
      synchronize: true, 
    }),
    ProyectModule,
    StudentModule,
    ProfessorModule,
    EvaluationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}