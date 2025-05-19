import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateStudentDto {
    @IsInt({ message: 'La cédula debe ser un número entero' })
    @IsNotEmpty({ message: 'La cédula es requerida' })
    cedula: number;

    @IsString({ message: 'El nombre debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre es requerido' })
    nombre: string;

    @IsInt({ message: 'El semestre debe ser un número entero' })
    @Min(4, { message: 'El estudiante debe estar en semestre 4 o superior' })
    semestre: number;

    @IsString({ message: 'El programa debe ser un texto' })
    @IsNotEmpty({ message: 'El programa es requerido' })
    programa: string;

    @IsInt({ message: 'El promedio debe ser un número entero' })
    @Min(3.2, { message: 'El promedio debe ser mayor a 3.2' })
    promedio: number;
}