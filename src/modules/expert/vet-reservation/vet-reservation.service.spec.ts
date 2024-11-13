import { Test, TestingModule } from '@nestjs/testing';
import { VetReservationService } from './vet-reservation.service';

describe('VetReservationService', () => {
  let service: VetReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VetReservationService],
    }).compile();

    service = module.get<VetReservationService>(VetReservationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
