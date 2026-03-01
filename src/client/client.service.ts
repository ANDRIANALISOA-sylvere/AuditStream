import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from 'generated/prisma/client';

@Injectable()
export class ClientService {
  constructor(private prisma: PrismaService) {}

  async createClient(data: CreateClientDto): Promise<Client> {
    return await this.prisma.client.create({
      data: {
        numero_compte: data.numero_compte,
        nom_client: data.nom_client,
        solde: data.solde,
      },
    });
  }

  async getAllClient(): Promise<Client[]> {
    return await this.prisma.client.findMany();
  }
}
