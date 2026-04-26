import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from 'src/module/user-manage-module/employee-module/employee.service';
import { DatabaseService } from 'src/common/database/database.service';
import { NotFoundException } from '@nestjs/common';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let prisma: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: DatabaseService,
          useValue: {
            employee: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    prisma = module.get<DatabaseService>(DatabaseService);
  });

  describe('getEmployeeSeniority', () => {
    it('should throw NotFoundException if employee not found', async () => {
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.getEmployeeSeniority('1')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if employee has no startDate', async () => {
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue({ name: 'John', startDate: null });
      await expect(service.getEmployeeSeniority('1')).rejects.toThrow(NotFoundException);
    });

    it('should calculate correct seniority for exact years', async () => {
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 2);
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue({ name: 'John', startDate });

      const result = await service.getEmployeeSeniority('1');
      expect(result.years).toBe(2);
      expect(result.months).toBe(0);
      expect(result.message).toContain('2 tahun');
    });

    it('should calculate correct seniority with months', async () => {
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      startDate.setMonth(startDate.getMonth() - 2);
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue({ name: 'John', startDate });

      const result = await service.getEmployeeSeniority('1');
      expect(result.years).toBe(1);
      expect(result.months).toBe(2);
      expect(result.message).toContain('1 tahun 2 bulan');
    });

    it('should handle less than 1 month', async () => {
      const startDate = new Date();
      // Only 10 days ago
      startDate.setDate(startDate.getDate() - 10);
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue({ name: 'John', startDate });

      const result = await service.getEmployeeSeniority('1');
      expect(result.years).toBe(0);
      expect(result.months).toBe(0);
      expect(result.message).toBe('Kurang dari 1 bulan');
    });
  });
});
