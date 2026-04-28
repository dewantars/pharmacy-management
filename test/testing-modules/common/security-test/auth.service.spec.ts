import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/common/security/auth/auth.service';
import { EmployeeService } from 'src/module/user-manage-module/employee-module/employee.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockEmployeeService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: EmployeeService,
          useValue: mockEmployeeService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return access_token when login is called', () => {
      const mockEmployee: any = { id: 'emp-1', email: 'test@example.com' };
      const result = service.login(mockEmployee);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: mockEmployee.email,
        sub: mockEmployee.id,
      });
      expect(result).toHaveProperty('access_token');
    });
  });

  describe('validateUser', () => {
    it('should return null if employee is not found', async () => {
      mockEmployeeService.findByEmail.mockResolvedValue(null);
      const result = await service.validateUser('notfound@example.com', 'pass');
      expect(result).toBeNull();
    });
  });
});
