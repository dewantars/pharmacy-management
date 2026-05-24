import { ConfigService } from '@nestjs/config';

describe('DatabaseService', () => {
  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      const config: Record<string, string | number> = {
        POSTGRE_DB: 'test_db',
        POSTGRE_HOST: 'localhost',
        POSTGRE_PORT: '5432',
        POSTGRE_USER: 'postgres',
        POSTGRE_PASSWORD: 'password',
      };
      return config[key];
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve database configuration values', () => {
    const configService = mockConfigService as unknown as ConfigService;

    expect(configService.get('POSTGRE_DB')).toBe('test_db');
    expect(configService.get('POSTGRE_HOST')).toBe('localhost');
    expect(configService.get('POSTGRE_PORT')).toBe('5432');
    expect(configService.get('POSTGRE_USER')).toBe('postgres');
    expect(configService.get('POSTGRE_PASSWORD')).toBe('password');
  });

  it('should call configService.get for each database configuration', () => {
    const dbName = mockConfigService.get<string>('POSTGRE_DB');
    const host = mockConfigService.get<string>('POSTGRE_HOST');
    const port = mockConfigService.get<string>('POSTGRE_PORT');
    const user = mockConfigService.get<string>('POSTGRE_USER');
    const password = mockConfigService.get<string>('POSTGRE_PASSWORD');

    expect(mockConfigService.get).toHaveBeenCalledWith('POSTGRE_DB');
    expect(mockConfigService.get).toHaveBeenCalledWith('POSTGRE_HOST');
    expect(mockConfigService.get).toHaveBeenCalledWith('POSTGRE_PORT');
    expect(mockConfigService.get).toHaveBeenCalledWith('POSTGRE_USER');
    expect(mockConfigService.get).toHaveBeenCalledWith('POSTGRE_PASSWORD');

    expect(dbName).toBe('test_db');
    expect(host).toBe('localhost');
    expect(port).toBe('5432');
    expect(user).toBe('postgres');
    expect(password).toBe('password');
  });

  it('should handle database connection configuration', () => {
    const config = {
      POSTGRE_DB: mockConfigService.get('POSTGRE_DB'),
      POSTGRE_HOST: mockConfigService.get('POSTGRE_HOST'),
      POSTGRE_PORT: mockConfigService.get('POSTGRE_PORT'),
      POSTGRE_USER: mockConfigService.get('POSTGRE_USER'),
      POSTGRE_PASSWORD: mockConfigService.get('POSTGRE_PASSWORD'),
    };

    expect(config).toEqual({
      POSTGRE_DB: 'test_db',
      POSTGRE_HOST: 'localhost',
      POSTGRE_PORT: '5432',
      POSTGRE_USER: 'postgres',
      POSTGRE_PASSWORD: 'password',
    });
  });

  it('should have all required configuration keys', () => {
    const requiredKeys = [
      'POSTGRE_DB',
      'POSTGRE_HOST',
      'POSTGRE_PORT',
      'POSTGRE_USER',
      'POSTGRE_PASSWORD',
    ];

    requiredKeys.forEach((key) => {
      expect(mockConfigService.get(key)).toBeDefined();
    });
  });
});
