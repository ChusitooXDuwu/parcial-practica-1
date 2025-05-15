import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { Student } from '../../student/entities/student.entity';
import { Professor } from '../../professor/entities/professor.entity';
import { Evaluation } from '../../evaluation/entities/evaluation.entity';

@Entity()
export class Proyect {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column()
    titulo: string;

    @Column()
    area: string;

    @Column('int')
    presupuesto: number;

    @Column('int')
    notaFinal: number;

    @Column('int')
    estado: number;

    @Column()
    fechaInicio: string;

    @Column()
    fechaFin: string;

    @ManyToOne(() => Student, (estudiante) => estudiante.proyectos)
    lider: Student;

    @ManyToOne(() => Professor, (profesor) => profesor.mentorias)
    mentor: Professor;

    @OneToMany(() => Evaluation, (evaluacion) => evaluacion.proyecto)
    evaluaciones: Evaluation[];
}
