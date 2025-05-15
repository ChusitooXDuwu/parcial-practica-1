import { IsInt, IsString, Min, Length } from 'class-validator';

export class CreateProyectDto {
    @IsString()
    @Length(16)
    titulo: string;

    @IsString()
    area: string;

    @IsInt()
    @Min(1)
    presupuesto: number;

    @IsInt()
    notaFinal: number;

    @IsInt()
    estado: number;

    @IsString()
    fechaInicio: string;

    @IsString()
    fechaFin: string;

    @IsInt()
    liderId: number;

    @IsInt()
    mentorId: number;
}
