import { Test, TestingModule } from '@nestjs/testing';
import { VersementService } from './versement.service';

describe('VersementService', () => {
  let service: VersementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VersementService],
    }).compile();

    service = module.get<VersementService>(VersementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
