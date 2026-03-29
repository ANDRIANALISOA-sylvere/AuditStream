// versement.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Versement } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVersementDto } from './dto/create-versement.dto';
import { UpdateVersementDto } from './dto/update-versement.dto';

@Injectable()
export class VersementService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<Versement[]> {
    return await this.prisma.versement.findMany({
      include: { client: true },
    });
  }

  async create(dto: CreateVersementDto, userId: number): Promise<Versement> {
    return await this.prisma.versement.create({
      data: {
        numero_versement: dto.numero_versement,
        numero_cheque: dto.numero_cheque,
        montant: dto.montant,
        clientId: dto.clientId,
      },
    });
  }

  async update(
    numero_versement: string,
    dto: UpdateVersementDto,
    userId: number,
  ): Promise<Versement> {
    const versement = await this.prisma.versement.findUnique({
      where: { numero_versement },
    });

    if (!versement) {
      throw new NotFoundException(`Versement ${numero_versement} introuvable`);
    }

    return await this.prisma.versement.update({
      where: { numero_versement },
      data: {
        ...(dto.numero_cheque && { numero_cheque: dto.numero_cheque }),
        ...(dto.montant && { montant: dto.montant }),
      },
    });
  }

  async delete(numero_versement: string, userId: number): Promise<void> {
    const versement = await this.prisma.versement.findUnique({
      where: { numero_versement },
    });

    if (!versement) {
      throw new NotFoundException(`Versement ${numero_versement} introuvable`);
    }

    await this.prisma.versement.delete({
      where: { numero_versement },
    });
  }
}
