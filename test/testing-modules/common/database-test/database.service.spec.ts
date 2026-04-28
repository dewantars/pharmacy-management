import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/common/database/database.service';

// Mock seluruh database.service agar tidak mencoba koneksi ke DB nyata
jest.mock('src/common/database/database.service', () => {
  return {
    DatabaseService: jest.fn().mockImplementation(() => ({
      $connect: jest.fn().mockResolvedValue(undefined),
      $disconnect: jest.fn().mockResolvedValue(undefined),
      onModuleInit: jest.fn().mockResolvedValue(undefined),
      onModuleDestroy: jest.fn().mockResolvedValue(undefined),
    })),
  };
});

describe('DatabaseService', () => {
  let service: DatabaseService;

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      const config: Record<string, string> = {
        POSTGRE_DB: 'test_db',
        POSTGRE_HOST: 'localhost',
        POSTGRE_PORT: '5432',
        POSTGRE_USER: 'postgres',
        POSTGRE_PASSWORD: 'password',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatabaseService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
