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
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateVersementDto, userId: number): Promise<Versement> {
    return await this.prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(
        `SET LOCAL "app.current_user_id" = '${userId}'`,
      );

      const client = await tx.client.findUnique({
        where: { numero_compte: dto.clientId },
      });

      if (!client) {
        throw new NotFoundException(`Client ${dto.clientId} introuvable`);
      }

      const versement = await tx.versement.create({
        data: {
          numero_versement: dto.numero_versement,
          numero_cheque: dto.numero_cheque,
          montant: dto.montant,
          clientId: dto.clientId,
        },
      });

      await tx.client.update({
        where: { numero_compte: dto.clientId },
        data: {
          solde: {
            increment: dto.montant,
          },
        },
      });

      return versement;
    });
  }

  async update(
    numero_versement: string,
    dto: UpdateVersementDto,
    userId: number,
  ): Promise<Versement> {
    return await this.prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(
        `SET LOCAL "app.current_user_id" = '${userId}'`,
      );
      const versement = await tx.versement.findUnique({
        where: { numero_versement: numero_versement },
      });

      if (!versement) {
        throw new NotFoundException(
          `Versement ${numero_versement} introuvable`,
        );
      }

      if (dto.montant && dto.montant !== Number(versement.montant)) {
        const difference = dto.montant - Number(versement.montant);
        await tx.client.update({
          where: { numero_compte: versement.clientId },
          data: {
            solde: {
              increment: difference,
            },
          },
        });
      }

      return await tx.versement.update({
        where: { numero_versement: numero_versement },
        data: {
          ...(dto.numero_cheque && { numero_cheque: dto.numero_cheque }),
          ...(dto.montant && { montant: dto.montant }),
        },
      });
    });
  }

  async delete(numero_versement: string, userId: number): Promise<void> {
    return await this.prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(
        `SET LOCAL "app.current_user_id" = '${userId}'`,
      );
      const versement = await tx.versement.findUnique({
        where: { numero_versement: numero_versement },
      });

      if (!versement) {
        throw new NotFoundException(
          `Versement ${numero_versement} introuvable`,
        );
      }

      await tx.client.update({
        where: { numero_compte: versement.clientId },
        data: {
          solde: {
            decrement: versement.montant,
          },
        },
      });

      await tx.versement.delete({
        where: { numero_versement: numero_versement },
      });
    });
  }

  async getAllAudits() {
    return await this.prisma.audit_Versement.findMany({
      include: {
        versement: true,
        client: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: {
        date_operation: 'desc',
      },
    });
  }
}
