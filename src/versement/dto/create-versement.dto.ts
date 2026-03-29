import { IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateVersementDto {
  @IsString()
  numero_versement: string;

  @IsString()
  numero_cheque: string;

  @IsNumber()
  @IsPositive()
  montant: number;

  @IsString()
  clientId: string;
}
