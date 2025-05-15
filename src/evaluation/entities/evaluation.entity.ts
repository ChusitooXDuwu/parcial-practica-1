import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Proyect } from '../../proyect/entities/proyect.entity';
import { Professor } from '../../professor/entities/professor.entity';

@Entity()
export class Evaluation {
    @PrimaryGeneratedColumn('increment', { type: 'bigint' })
    id: number;

    @ManyToOne(() => Proyect, (proyecto) => proyecto.evaluaciones)
    proyecto: Proyect;

    @ManyToOne(() => Professor, (profesor) => profesor.evaluaciones)
    profesor: Professor;
}
