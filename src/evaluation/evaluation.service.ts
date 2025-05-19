import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluation } from './entities/evaluation.entity';
import { Proyect } from '../proyect/entities/proyect.entity';
import { Professor } from '../professor/entities/professor.entity';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectRepository(Evaluation)
    private evaluationRepository: Repository<Evaluation>,

    @InjectRepository(Proyect)
    private proyectRepository: Repository<Proyect>,

    @InjectRepository(Professor)
    private professorRepository: Repository<Professor>,
  ) {}

  async create(createEvaluationDto: CreateEvaluationDto) {
    return this.crearEvaluacion(createEvaluationDto);
  }

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

   
    proyecto.notaFinal = calificacion;
    await this.proyectRepository.save(proyecto);

    return this.evaluationRepository.save(evaluacion);
  }

  async findAll() {
    return this.evaluationRepository.find({
      relations: ['proyecto', 'profesor']
    });
  }

  async findOne(id: number) {
    return this.evaluationRepository.findOne({
      where: { id },
      relations: ['proyecto', 'profesor']
    });
  }

  async update(id: number, updateEvaluationDto: UpdateEvaluationDto) {
    const evaluacion = await this.findOne(id);
    if (!evaluacion) {
      throw new Error('Evaluación no encontrada');
    }

    if (updateEvaluationDto.proyectoId) {
      const proyecto = await this.proyectRepository.findOneBy({ id: updateEvaluationDto.proyectoId });
      if (proyecto) {
        evaluacion.proyecto = proyecto;
      }
    }

    if (updateEvaluationDto.profesorId) {
      const profesor = await this.professorRepository.findOneBy({ id: updateEvaluationDto.profesorId });
      if (profesor) {
        evaluacion.profesor = profesor;
      }
    }

    if (updateEvaluationDto.calificacion !== undefined) {
      // Validamos la calificación
      if (updateEvaluationDto.calificacion < 0 || updateEvaluationDto.calificacion > 5) {
        throw new Error('La calificación debe estar entre 0 y 5');
      }

      if (evaluacion.proyecto) {
        evaluacion.proyecto.notaFinal = updateEvaluationDto.calificacion;
        await this.proyectRepository.save(evaluacion.proyecto);
      }
    }

    return this.evaluationRepository.save(evaluacion);
  }

  async remove(id: number) {
    return this.evaluationRepository.delete(id);
  }
}