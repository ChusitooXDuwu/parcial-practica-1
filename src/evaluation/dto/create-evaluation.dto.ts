import { IsInt, Min, Max } from 'class-validator';

export class CreateEvaluationDto {
    @IsInt()
    proyectoId: number;

    @IsInt()
    profesorId: number;

    @IsInt()
    @Min(0)
    @Max(5)
    calificacion: number;
}
