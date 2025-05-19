import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyect } from './entities/proyect.entity';
import { CreateProyectDto } from './dto/create-proyect.dto';
import { UpdateProyectDto } from './dto/update-proyect.dto';
import { Student } from '../student/entities/student.entity';
import { Professor } from '../professor/entities/professor.entity';

@Injectable()
export class ProyectService {
  constructor(
    @InjectRepository(Proyect)
    private proyectRepository: Repository<Proyect>,
    
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    
    @InjectRepository(Professor)
    private professorRepository: Repository<Professor>,
  ) {}

  async create(createProyectDto: CreateProyectDto) {
    return this.crearProyecto(createProyectDto);
  }

  async crearProyecto(createProyectDto: CreateProyectDto) {
    if ((createProyectDto.presupuesto || 0) <= 0) {
      throw new Error('El presupuesto debe ser mayor a 0');
    }

    if ((createProyectDto.titulo?.length || 0) <= 15) {
      throw new Error('El título debe tener más de 15 caracteres');
    }

    const proyecto = this.proyectRepository.create({
      ...createProyectDto,
      estado: createProyectDto.estado || 0,
    });

   
    if (createProyectDto.liderId) {
      const lider = await this.studentRepository.findOneBy({ id: createProyectDto.liderId });
      if (lider) {
        proyecto.lider = lider;
      }
    }

    if (createProyectDto.mentorId) {
      const mentor = await this.professorRepository.findOneBy({ id: createProyectDto.mentorId });
      if (mentor) {
        proyecto.mentor = mentor;
      }
    }

    return this.proyectRepository.save(proyecto);
  }

  async findAll() {
    return this.proyectRepository.find({
      relations: ['lider', 'mentor']
    });
  }

  async findOne(id: number) {
    return this.proyectRepository.findOne({
      where: { id },
      relations: ['lider', 'mentor']
    });
  }

  async update(id: number, updateProyectDto: UpdateProyectDto) {
    const proyecto = await this.findOne(id);
    if (!proyecto) {
      throw new Error('Proyecto no encontrado');
    }

   
    if (updateProyectDto.liderId) {
      const lider = await this.studentRepository.findOneBy({ id: updateProyectDto.liderId });
      if (lider) {
        proyecto.lider = lider;
      }
    }

    if (updateProyectDto.mentorId) {
      const mentor = await this.professorRepository.findOneBy({ id: updateProyectDto.mentorId });
      if (mentor) {
        proyecto.mentor = mentor;
      }
    }

   
    this.proyectRepository.merge(proyecto, updateProyectDto);
    
    return this.proyectRepository.save(proyecto);
  }

  async remove(id: number) {
    return this.proyectRepository.delete(id);
  }

  async avanzarProyecto(id: number) {
    const proyecto = await this.proyectRepository.findOneBy({ id });
    if (!proyecto) throw new Error('Proyecto no encontrado');

    if (proyecto.estado >= 4) {
      throw new Error('El proyecto ya está en su estado máximo');
    }

    proyecto.estado += 1;
    return this.proyectRepository.save(proyecto);
  }

  async findAllEstudiantes(proyectoId: number): Promise<Student[]> {
    const proyecto = await this.proyectRepository.findOne({
      where: { id: proyectoId },
      relations: ['lider'],
    });

    return proyecto?.lider ? [proyecto.lider] : [];
  }
}