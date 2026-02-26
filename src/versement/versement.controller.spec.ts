import { Test, TestingModule } from '@nestjs/testing';
import { VersementController } from './versement.controller';

describe('VersementController', () => {
  let controller: VersementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VersementController],
    }).compile();

    controller = module.get<VersementController>(VersementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
