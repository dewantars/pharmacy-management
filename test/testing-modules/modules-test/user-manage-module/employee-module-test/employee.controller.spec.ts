import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from 'src/module/user-manage-module/employee-module/employee.controller';
import { EmployeeService } from 'src/module/user-manage-module/employee-module/employee.service';
import { FileInterceptor } from '@nestjs/platform-express';

jest.mock('src/module/user-manage-module/employee-module/employee.service', () => ({
  EmployeeService: jest.fn(),
}));
jest.mock('src/module/user-manage-module/employee-module/dto/create-employee.dto', () => ({}));
jest.mock('src/module/user-manage-module/employee-module/dto/update-employee.dto', () => ({}));

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let service: jest.Mocked<EmployeeService>;

  const mockEmployeeService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockFile: Express.Multer.File = {
    fieldname: 'profileAvatar',
    originalname: 'avatar.png',
    encoding: '7bit',
    mimetype: 'image/png',
    buffer: Buffer.from('mock-image'),
    size: 1024,
    stream: null!,
    destination: '',
    filename: 'avatar.png',
    path: '',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeService,
          useValue: mockEmployeeService,
        },
      ],
    })
      .overrideInterceptor(FileInterceptor('profileAvatar'))
      .useValue({ intercept: jest.fn((ctx, next) => next.handle()) })
      .overrideInterceptor(FileInterceptor('file'))
      .useValue({ intercept: jest.fn((ctx, next) => next.handle()) })
      .compile();

    controller = module.get<EmployeeController>(EmployeeController);
    service = module.get(EmployeeService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─── create ───────────────────────────────────────────────────────────────

  describe('create', () => {
    it('should call service.create with dto and file, then return the result', async () => {
      const mockDto = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CASHIER',
      } as any;

      const mockResult = { id: 'emp-1', name: 'John Doe' };
      mockEmployeeService.create.mockResolvedValue(mockResult);

      const result = await controller.create(mockDto, mockFile);

      expect(service.create).toHaveBeenCalledWith(mockDto, mockFile);
      expect(result).toEqual(mockResult);
    });

    it('should call service.create with undefined file when no file is uploaded', async () => {
      const mockDto = { name: 'Jane Doe', email: 'jane@example.com' } as any;
      const mockResult = { id: 'emp-2', name: 'Jane Doe' };

      mockEmployeeService.create.mockResolvedValue(mockResult);

      const result = await controller.create(mockDto, undefined);

      expect(service.create).toHaveBeenCalledWith(mockDto, undefined);
      expect(result).toEqual(mockResult);
    });

    it('should propagate errors thrown by service.create', async () => {
      mockEmployeeService.create.mockRejectedValue(new Error('Email already exists'));

      await expect(
        controller.create({ name: 'John' } as any, mockFile),
      ).rejects.toThrow('Email already exists');
    });
  });

  // ─── findAll ──────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('should call service.findAll with page and perPage and return the result', async () => {
      const mockResult = {
        data: [{ id: 'emp-1' }, { id: 'emp-2' }],
        total: 2,
      };

      mockEmployeeService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(1, 10);

      expect(service.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(mockResult);
    });

    it('should call service.findAll with undefined when query params are not provided', async () => {
      const mockResult = { data: [], total: 0 };

      mockEmployeeService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll(undefined, undefined);

      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined);
      expect(result).toEqual(mockResult);
    });

    it('should propagate errors thrown by service.findAll', async () => {
      mockEmployeeService.findAll.mockRejectedValue(new Error('Database error'));

      await expect(controller.findAll(1, 10)).rejects.toThrow('Database error');
    });
  });

  // ─── findOne ──────────────────────────────────────────────────────────────

  describe('findOne', () => {
    it('should call service.findOne with the given id and return the result', async () => {
      const mockEmployee = { id: 'emp-1', name: 'John Doe' };

      mockEmployeeService.findOne.mockResolvedValue(mockEmployee);

      const result = await controller.findOne('emp-1');

      expect(service.findOne).toHaveBeenCalledWith('emp-1');
      expect(result).toEqual(mockEmployee);
    });

    it('should propagate errors thrown by service.findOne', async () => {
      mockEmployeeService.findOne.mockRejectedValue(new Error('Employee not found'));

      await expect(controller.findOne('invalid-id')).rejects.toThrow(
        'Employee not found',
      );
    });
  });

  // ─── update ───────────────────────────────────────────────────────────────

  describe('update', () => {
    it('should call service.update with id, dto, and file then return the result', async () => {
      const mockDto = { name: 'John Updated' } as any;
      const mockUpdated = { id: 'emp-1', name: 'John Updated' };

      mockEmployeeService.update.mockResolvedValue(mockUpdated);

      const result = await controller.update('emp-1', mockDto, mockFile);

      expect(service.update).toHaveBeenCalledWith('emp-1', mockDto, mockFile);
      expect(result).toEqual(mockUpdated);
    });

    it('should call service.update with undefined file when no file is uploaded', async () => {
      const mockDto = { name: 'John Updated' } as any;
      const mockUpdated = { id: 'emp-1', name: 'John Updated' };

      mockEmployeeService.update.mockResolvedValue(mockUpdated);

      const result = await controller.update('emp-1', mockDto, undefined);

      expect(service.update).toHaveBeenCalledWith('emp-1', mockDto, undefined);
      expect(result).toEqual(mockUpdated);
    });

    it('should propagate errors thrown by service.update', async () => {
      mockEmployeeService.update.mockRejectedValue(new Error('Employee not found'));

      await expect(
        controller.update('invalid-id', {} as any, undefined),
      ).rejects.toThrow('Employee not found');
    });
  });

  // ─── remove ───────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('should call service.remove with the given id and return the result', async () => {
      const mockRemoved = { id: 'emp-1', deleted: true };

      mockEmployeeService.remove.mockResolvedValue(mockRemoved);

      const result = await controller.remove('emp-1');

      expect(service.remove).toHaveBeenCalledWith('emp-1');
      expect(result).toEqual(mockRemoved);
    });

    it('should propagate errors thrown by service.remove', async () => {
      mockEmployeeService.remove.mockRejectedValue(new Error('Employee not found'));

      await expect(controller.remove('invalid-id')).rejects.toThrow(
        'Employee not found',
      );
    });
  });
});