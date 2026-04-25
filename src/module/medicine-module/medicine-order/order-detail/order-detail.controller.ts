import { Controller, Delete, Get, Query, UseGuards } from '@nestjs/common';
import { OrderDetailService } from './order-detail.service.js';
import { AuthGuard } from '@nestjs/passport';

@Controller()
@UseGuards(AuthGuard('jwt'))
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Get()
  findAll(@Query('page') page?: number, @Query('perPage') perPage?: number) {
    return this.orderDetailService.findAll(perPage!, page!);
  }

  @Delete()
  delete(
    @Query('medicine-id') medicineId?: string,
    @Query('order-id') orderId?: string,
  ) {
    return this.orderDetailService.delete(medicineId!, orderId!);
  }
}
