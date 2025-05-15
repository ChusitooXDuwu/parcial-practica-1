import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Proyect } from '../../proyect/entities/proyect.entity';
import { Evaluation } from '../../evaluation/entities/evaluation.entity';

@Entity()
export class Professor {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column('int')
    cedula: number;

    @Column()
    nombre: string;

    @Column()
    departamento: string;

    @Column('int')
    extension: number;

    @Column()
    esParEvaluador: boolean;

    @OneToMany(() => Proyect, (proyecto) => proyecto.mentor)
    mentorias: Proyect[];

    @OneToMany(() => Evaluation, (evaluacion) => evaluacion.profesor)
    evaluaciones: Evaluation[];
}
