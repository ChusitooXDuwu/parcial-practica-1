import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluation } from './entities/evaluation.entity';
import { Proyect } from '../proyect/entities/proyect.entity';
import { Professor } from '../professor/entities/professor.entity';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectRepository(Evaluation)
    private evaluationRepository: Repository<Evaluation>,

    @InjectRepository(Proyect)
    private proyectRepository: Repository<Proyect>,

    @InjectRepository(Professor)
    private professorRepository: Repository<Professor>,
  ) { }

  async crearEvaluacion(dto: CreateEvaluationDto) {
    const { proyectoId, profesorId, calificacion } = dto;

    const proyecto = await this.proyectRepository.findOne({
      where: { id: proyectoId },
      relations: ['mentor'],
    });

    const profesor = await this.professorRepository.findOneBy({ id: profesorId });

    if (!proyecto || !profesor) throw new Error('Proyecto o profesor no encontrado');

    if (proyecto.mentor?.id === profesor.id) {
      throw new Error('El evaluador no puede ser el mentor del proyecto');
    }

    if (calificacion < 0 || calificacion > 5) {
      throw new Error('La calificación debe estar entre 0 y 5');
    }

    const evaluacion = this.evaluationRepository.create({
      proyecto,
      profesor,
    });

    return this.evaluationRepository.save(evaluacion);
  }
}
