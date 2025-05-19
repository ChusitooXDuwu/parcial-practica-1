import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Professor } from './entities/professor.entity';
import { Evaluation } from '../evaluation/entities/evaluation.entity';
import { CreateProfessorDto } from './dto/create-professor.dto';
import { UpdateProfessorDto } from './dto/update-professor.dto';

@Injectable()
export class ProfessorService {
  constructor(
    @InjectRepository(Professor)
    private professorRepository: Repository<Professor>,

    @InjectRepository(Evaluation)
    private evaluationRepository: Repository<Evaluation>,
  ) {}

  async create(createProfessorDto: CreateProfessorDto) {
    return this.crearProfesor(createProfessorDto);
  }

  async crearProfesor(createProfessorDto: CreateProfessorDto) {
    if (!/^\d{5}$/.test(createProfessorDto.extension?.toString() || '')) {
      throw new Error('La extensión debe tener exactamente 5 dígitos');
    }

    const professor = this.professorRepository.create({
      ...createProfessorDto,
      esParEvaluador: createProfessorDto.esParEvaluador || false,
    });
    return this.professorRepository.save(professor);
  }

  async findAll() {
    return this.professorRepository.find();
  }

  async findOne(id: number) {
    return this.professorRepository.findOneBy({ id });
  }

  async update(id: number, updateProfessorDto: UpdateProfessorDto) {
    await this.professorRepository.update(id, updateProfessorDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.professorRepository.delete(id);
  }

  async asignarEvaluador(id: number) {
    const evaluaciones = await this.evaluationRepository.count({
      where: { profesor: { id } },
    });

    if (evaluaciones >= 3) {
      throw new Error('El profesor ya tiene 3 evaluaciones activas');
    }

    await this.professorRepository.update(id, { esParEvaluador: true });
    return { message: 'Profesor asignado como par evaluador' };
  }
}