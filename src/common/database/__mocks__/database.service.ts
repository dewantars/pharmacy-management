export const DatabaseService = jest.fn().mockImplementation(() => ({
  transaction: {
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  medicineOrder: {
    findMany: jest.fn(),
  },
  $transaction: jest.fn(),
}));