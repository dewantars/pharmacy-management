import { Module } from '@nestjs/common';
import { EmployeeModule } from './employee-module/employee.module.js';
import { SupplierModule } from './supplier-module/supplier.module.js';

@Module({
  imports: [EmployeeModule, SupplierModule],
  exports: [EmployeeModule, SupplierModule],
})
export class UsersManageModule {}
