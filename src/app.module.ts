import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ClientModule } from './client/client.module';
import { UserModule } from './user/user.module';
import { VersementModule } from './versement/versement.module';

@Module({
  imports: [PrismaModule, ClientModule, UserModule, VersementModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
