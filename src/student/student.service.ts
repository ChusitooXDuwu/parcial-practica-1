import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Student } from './entities/student.entity';
import { Proyect } from '../proyect/entities/proyect.entity';
import { CreateStudentDto } from './dto/create-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,

    @InjectRepository(Proyect)
    private proyectRepository: Repository<Proyect>,
  ) { }

  async crearEstudiante(createStudentDto: CreateStudentDto) {
    if (createStudentDto.promedio <= 3.2 || createStudentDto.semestre < 4) {
      throw new Error('El estudiante debe tener promedio > 3.2 y semestre ≥ 4');
    }
    const student = this.studentRepository.create(createStudentDto);
    return this.studentRepository.save(student);
  }

  async eliminarEstudiante(id: number) {
    const proyectosActivos = await this.proyectRepository.count({
      where: { lider: { id }, estado: Not(4) }, // estado 4 = finalizado
    });

    if (proyectosActivos > 0) {
      throw new Error('No se puede eliminar el estudiante con proyectos activos');
    }

    return this.studentRepository.delete(id);
  }
}
