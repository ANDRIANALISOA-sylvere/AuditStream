import { Injectable } from '@nestjs/common';
import { IsNumber, IsString } from 'class-validator';

@Injectable()
export class CreateClientDto {
  @IsString()
  numero_compte: string;

  @IsString()
  nom_client: string;

  @IsNumber()
  solde: number;
}
