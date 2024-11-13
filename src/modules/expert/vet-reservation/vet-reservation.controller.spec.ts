import { Test, TestingModule } from '@nestjs/testing';
import { VetReservationController } from './vet-reservation.controller';
import { VetReservationService } from './vet-reservation.service';

describe('VetReservationController', () => {
  let controller: VetReservationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VetReservationController],
      providers: [VetReservationService],
    }).compile();

    controller = module.get<VetReservationController>(VetReservationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
