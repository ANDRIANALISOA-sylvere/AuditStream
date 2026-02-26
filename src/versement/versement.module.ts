import { Module } from '@nestjs/common';
import { VersementService } from './versement.service';
import { VersementController } from './versement.controller';

@Module({
  providers: [VersementService],
  controllers: [VersementController]
})
export class VersementModule {}
