import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Proyect } from '../../proyect/entities/proyect.entity';

@Entity()
export class Estudiante {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @Column('int')
    cedula: number;

    @Column()
    nombre: string;

    @Column('int')
    semestre: number;

    @Column()
    programa: string;

    @Column('int')
    promedio: number;

    @OneToMany(() => Proyect, (proyecto) => proyecto.lider)
    proyectos: Proyect[];
}
