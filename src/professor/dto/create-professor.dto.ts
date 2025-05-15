import { IsInt, IsString, Length, Matches } from 'class-validator';

export class CreateProfessorDto {
    @IsInt()
    cedula: number;

    @IsString()
    nombre: string;

    @IsString()
    departamento: string;

    @IsInt()
    @Matches(/^\d{5}$/, { message: 'La extensión debe tener exactamente 5 dígitos' })
    extension: number;


    esParEvaluador?: boolean;
}
