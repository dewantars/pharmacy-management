import { Injectable, Logger } from '@nestjs/common';
import { CreateOperationalReportDto } from './dto/create-operational-report.dto.js';
import { UpdateOperationalReportDto } from './dto/update-operational-report.dto.js';
import { ActivityLogService } from '../../logs-module/activity-log.service.js';
import { EmployeeService } from '../../user-manage-module/employee-module/employee.service.js';
import { SupplierService } from '../../user-manage-module/supplier-module/supplier.service.js';
import { MedicineService } from '../../medicine-module/medicine/medicine.service.js';


@Injectable()
export class OperationalReportService {
  private readonly logger =  new Logger(OperationalReportService.name)
  constructor(
      private readonly logService: ActivityLogService,
      private readonly supplierService: SupplierService,
      private readonly employeeService: EmployeeService,
      private readonly medicineService: MedicineService
  ){}
  create(createOperationalReportDto: CreateOperationalReportDto) {
    return 'This action adds a new operationalReport';
  }

  findAll() {
    return `This action returns all operationalReport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} operationalReport`;
  }

  update(id: number, updateOperationalReportDto: UpdateOperationalReportDto) {
    return `This action updates a #${id} operationalReport`;
  }

  remove(id: number) {
    return `This action removes a #${id} operationalReport`;
  }
}
