import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyect } from './entities/proyect.entity';
import { CreateProyectDto } from './dto/create-proyect.dto';
import { Student } from '../student/entities/student.entity';

@Injectable()
export class ProyectService {
  constructor(
    @InjectRepository(Proyect)
    private proyectRepository: Repository<Proyect>,
  ) { }

  async crearProyecto(createProyectDto: CreateProyectDto) {
    if ((createProyectDto.presupuesto || 0) <= 0) {
      throw new Error('El presupuesto debe ser mayor a 0');
    }

    if ((createProyectDto.titulo?.length || 0) <= 15) {
      throw new Error('El título debe tener más de 15 caracteres');
    }

    const proyecto = this.proyectRepository.create(createProyectDto);
    return this.proyectRepository.save(proyecto);
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
