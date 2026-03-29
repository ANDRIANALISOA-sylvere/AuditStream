import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateVersementDto {
  @IsString()
  @IsOptional()
  numero_cheque?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  montant?: number;
}
