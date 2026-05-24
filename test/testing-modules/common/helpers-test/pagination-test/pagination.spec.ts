import { paginator, PaginateOptions } from 'src/common/helpers/pagination/pagination';

describe('Pagination', () => {
  describe('paginator function', () => {
    let mockModel: any;

    beforeEach(() => {
      mockModel = {
        count: jest.fn(),
        findMany: jest.fn(),
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should be defined', () => {
      const defaultOptions: PaginateOptions = { page: 1, perPage: 10 };
      const paginateFunc = paginator(defaultOptions);
      expect(paginateFunc).toBeDefined();
      expect(typeof paginateFunc).toBe('function');
    });

    it('should return paginated result with default options', async () => {
      const defaultOptions: PaginateOptions = { page: 1, perPage: 10 };
      const paginateFunc = paginator(defaultOptions);

      const mockData = [{ id: 1 }, { id: 2 }, { id: 3 }];
      mockModel.count.mockResolvedValue(3);
      mockModel.findMany.mockResolvedValue(mockData);

      const result = await paginateFunc(mockModel, {});

      expect(result.data).toEqual(mockData);
      expect(result.meta.total).toBe(3);
      expect(result.meta.currentPage).toBe(1);
      expect(result.meta.perPage).toBe(10);
    });

    it('should use page and perPage from options when provided', async () => {
      const defaultOptions: PaginateOptions = { page: 1, perPage: 10 };
      const paginateFunc = paginator(defaultOptions);

      mockModel.count.mockResolvedValue(50);
      mockModel.findMany.mockResolvedValue([{ id: 11 }, { id: 12 }]);

      const result = await paginateFunc(mockModel, {}, { page: 2, perPage: 10 });

      expect(result.meta.currentPage).toBe(2);
      expect(result.meta.perPage).toBe(10);
      expect(mockModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
          skip: 10,
        }),
      );
    });

    it('should use string values for page and perPage', async () => {
      const defaultOptions: PaginateOptions = { page: 1, perPage: 10 };
      const paginateFunc = paginator(defaultOptions);

      mockModel.count.mockResolvedValue(50);
      mockModel.findMany.mockResolvedValue([]);

      const result = await paginateFunc(mockModel, {}, {
        page: '3',
        perPage: '20',
      });

      expect(result.meta.currentPage).toBe(3);
      expect(result.meta.perPage).toBe(20);
      expect(mockModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 20,
          skip: 40,
        }),
      );
    });

    it('should calculate lastPage correctly', async () => {
      const defaultOptions: PaginateOptions = { page: 1, perPage: 10 };
      const paginateFunc = paginator(defaultOptions);

      mockModel.count.mockResolvedValue(25);
      mockModel.findMany.mockResolvedValue([]);

      const result = await paginateFunc(mockModel, {}, { page: 1, perPage: 10 });

      expect(result.meta.lastPage).toBe(3);
    });

    it('should calculate prev and next pages correctly on first page', async () => {
      const defaultOptions: PaginateOptions = { page: 1, perPage: 10 };
      const paginateFunc = paginator(defaultOptions);

      mockModel.count.mockResolvedValue(50);
      mockModel.findMany.mockResolvedValue([]);

      const result = await paginateFunc(mockModel, {}, { page: 1, perPage: 10 });
      expect(result.meta.prev).toBeNull();
      expect(result.meta.next).toBe(2);
    });

    it('should calculate prev and next pages correctly on middle page', async () => {
      const defaultOptions: PaginateOptions = { page: 1, perPage: 10 };
      const paginateFunc = paginator(defaultOptions);

      mockModel.count.mockResolvedValue(50);
      mockModel.findMany.mockResolvedValue([]);

      const result = await paginateFunc(mockModel, {}, { page: 2, perPage: 10 });
      expect(result.meta.prev).toBe(1);
      expect(result.meta.next).toBe(3);
    });

    it('should calculate prev and next pages correctly on last page', async () => {
      const defaultOptions: PaginateOptions = { page: 1, perPage: 10 };
      const paginateFunc = paginator(defaultOptions);

      mockModel.count.mockResolvedValue(25);
      mockModel.findMany.mockResolvedValue([]);

      const result = await paginateFunc(mockModel, {}, { page: 3, perPage: 10 });
      expect(result.meta.prev).toBe(2);
      expect(result.meta.next).toBeNull();
    });

    it('should handle page 0 gracefully', async () => {
      const defaultOptions: PaginateOptions = { page: 1, perPage: 10 };
      const paginateFunc = paginator(defaultOptions);

      mockModel.count.mockResolvedValue(50);
      mockModel.findMany.mockResolvedValue([]);

      await paginateFunc(mockModel, {}, { page: 0, perPage: 10 });

      expect(mockModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
        }),
      );
    });

    it('should handle negative page gracefully', async () => {
      const defaultOptions: PaginateOptions = { page: 1, perPage: 10 };
      const paginateFunc = paginator(defaultOptions);

      mockModel.count.mockResolvedValue(50);
      mockModel.findMany.mockResolvedValue([]);

      await paginateFunc(mockModel, {}, { page: -5, perPage: 10 });

      expect(mockModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
        }),
      );
    });

    it('should pass where clause to count method', async () => {
      const defaultOptions: PaginateOptions = { page: 1, perPage: 10 };
      const paginateFunc = paginator(defaultOptions);

      mockModel.count.mockResolvedValue(5);
      mockModel.findMany.mockResolvedValue([]);

      const whereClause = { status: 'active' };
      await paginateFunc(
        mockModel,
        { where: whereClause },
        { page: 1, perPage: 10 },
      );

      expect(mockModel.count).toHaveBeenCalledWith({ where: whereClause });
    });

    it('should preserve other args properties in findMany', async () => {
      const defaultOptions: PaginateOptions = { page: 1, perPage: 10 };
      const paginateFunc = paginator(defaultOptions);

      mockModel.count.mockResolvedValue(10);
      mockModel.findMany.mockResolvedValue([]);

      const args = {
        where: { status: 'active' },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
      };

      await paginateFunc(mockModel, args, { page: 1, perPage: 10 });

      expect(mockModel.findMany).toHaveBeenCalledWith({
        where: { status: 'active' },
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
        skip: 0,
      });
    });

    it('should return empty data array when no results', async () => {
      const defaultOptions: PaginateOptions = { page: 1, perPage: 10 };
      const paginateFunc = paginator(defaultOptions);

      mockModel.count.mockResolvedValue(0);
      mockModel.findMany.mockResolvedValue([]);

      const result = await paginateFunc(mockModel, {}, { page: 1, perPage: 10 });

      expect(result.data).toEqual([]);
      expect(result.meta.total).toBe(0);
      expect(result.meta.lastPage).toBe(0);
    });

    it('should use default options when no options are provided', async () => {
      const defaultOptions: PaginateOptions = { page: 2, perPage: 20 };
      const paginateFunc = paginator(defaultOptions);

      mockModel.count.mockResolvedValue(50);
      mockModel.findMany.mockResolvedValue([]);

      await paginateFunc(mockModel, {});

      expect(mockModel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 20,
          skip: 20,
        }),
      );
    });

    it('should handle single page results', async () => {
      const defaultOptions: PaginateOptions = { page: 1, perPage: 10 };
      const paginateFunc = paginator(defaultOptions);

      mockModel.count.mockResolvedValue(5);
      mockModel.findMany.mockResolvedValue([
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
      ]);

      const result = await paginateFunc(mockModel, {}, { page: 1, perPage: 10 });

      expect(result.meta.lastPage).toBe(1);
      expect(result.meta.next).toBeNull();
      expect(result.meta.prev).toBeNull();
    });
  });
});
