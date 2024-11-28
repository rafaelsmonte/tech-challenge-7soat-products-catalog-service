import { PrismaDatabase } from './prisma-database.external'; // Replace with correct path
import { DatabaseError } from '../errors/database.error';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    category: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

const mockPrismaClient = new (jest.requireMock(
  '@prisma/client',
).PrismaClient)();

describe('PrismaDatabase - findAllCategories', () => {
  let database: PrismaDatabase;

  beforeEach(() => {
    database = new PrismaDatabase();
    (database as any).prismaClient = mockPrismaClient;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of categories', async () => {
    const mockCategories = [
      {
        id: 1,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        type: 'MEAL',
      },
      {
        id: 2,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-02'),
        type: 'MEAL',
      },
    ];

    mockPrismaClient.category.findMany.mockResolvedValue(mockCategories);

    const result = await database.findAllCategories();

    const expectedCategories = mockCategories.map(
      (category) =>
        new Category(
          category.id,
          category.createdAt,
          category.updatedAt,
          category.type,
        ),
    );

    expect(result).toEqual(expectedCategories);
    expect(mockPrismaClient.category.findMany).toHaveBeenCalledTimes(1);
  });

  it('should throw a DatabaseError if findMany fails', async () => {
    // Suppress console logs for this test
    jest.spyOn(console, 'log').mockImplementation(() => {});

    mockPrismaClient.category.findMany.mockRejectedValue(
      new Error('Database error'),
    );

    await expect(database.findAllCategories()).rejects.toThrow(DatabaseError);
    await expect(database.findAllCategories()).rejects.toThrow(
      'Failed to find categories',
    );

    expect(mockPrismaClient.category.findMany).toHaveBeenCalledTimes(2);

    jest.restoreAllMocks();
  });
});
describe('PrismaDatabase - findCategoryById', () => {
  let database: PrismaDatabase;

  beforeEach(() => {
    database = new PrismaDatabase();
    (database as any).prismaClient = mockPrismaClient;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a category when found', async () => {
    const mockCategory = {
      id: 1,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
      type: 'MEAL',
    };

    mockPrismaClient.category.findUnique.mockResolvedValue(mockCategory);

    const result = await database.findCategoryById(1);

    const expectedCategory = new Category(
      mockCategory.id,
      mockCategory.createdAt,
      mockCategory.updatedAt,
      mockCategory.type,
    );

    expect(result).toEqual(expectedCategory);
    expect(mockPrismaClient.category.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockPrismaClient.category.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should return null when category is not found', async () => {
    mockPrismaClient.category.findUnique.mockResolvedValue(null);

    const result = await database.findCategoryById(99);

    expect(result).toBeNull();
    expect(mockPrismaClient.category.findUnique).toHaveBeenCalledWith({
      where: { id: 99 },
    });
    expect(mockPrismaClient.category.findUnique).toHaveBeenCalledTimes(1);
  });

  it('should throw a DatabaseError if findUnique fails', async () => {
    // Suppress console logs for this test
    jest.spyOn(console, 'log').mockImplementation(() => {});

    mockPrismaClient.category.findUnique.mockRejectedValue(
      new Error('Database error'),
    );

    await expect(database.findCategoryById(1)).rejects.toThrow(DatabaseError);
    await expect(database.findCategoryById(1)).rejects.toThrow(
      'Failed to find category',
    );

    expect(mockPrismaClient.category.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockPrismaClient.category.findUnique).toHaveBeenCalledTimes(2);

    jest.restoreAllMocks();
  });
});
describe('ProductDatabase', () => {
  let database: PrismaDatabase;

  beforeEach(() => {
    database = new PrismaDatabase();
    (database as any).prismaClient = mockPrismaClient;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAllProducts', () => {
    it('should return a list of products', async () => {
      const mockProducts = [
        {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          name: 'Product A',
          price: 100,
          description: 'Description A',
          pictures: ['pic1.jpg'],
          categoryId: 1,
        },
      ];

      mockPrismaClient.product.findMany.mockResolvedValue(mockProducts);

      const result = await database.findAllProducts();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Product);
      expect(mockPrismaClient.product.findMany).toHaveBeenCalled();
    });

    it('should throw a DatabaseError if findMany fails', async () => {
      mockPrismaClient.product.findMany.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(database.findAllProducts()).rejects.toThrow(DatabaseError);
    });
  });

  describe('findProductById', () => {
    it('should return a product if found', async () => {
      const mockProduct = {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        name: 'Product A',
        price: 100,
        description: 'Description A',
        pictures: ['pic1.jpg'],
        categoryId: 1,
      };

      mockPrismaClient.product.findUnique.mockResolvedValue(mockProduct);

      const result = await database.findProductById(1);
      expect(result).toBeInstanceOf(Product);
      expect(mockPrismaClient.product.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should return null if no product is found', async () => {
      mockPrismaClient.product.findUnique.mockResolvedValue(null);

      const result = await database.findProductById(99);
      expect(result).toBeNull();
    });

    it('should throw a DatabaseError if findUnique fails', async () => {
      mockPrismaClient.product.findUnique.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(database.findProductById(1)).rejects.toThrow(DatabaseError);
    });
  });

  describe('createProduct', () => {
    it('should throw a DatabaseError if create fails', async () => {
      const mockInputProduct = new Product(
        null,
        null,
        null,
        'Product A',
        100,
        'Description A',
        ['pic1.jpg'],
        1,
      );

      mockPrismaClient.product.create.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(database.createProduct(mockInputProduct)).rejects.toThrow(
        DatabaseError,
      );
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product by id', async () => {
      mockPrismaClient.product.delete.mockResolvedValue();

      await expect(database.deleteProduct(1)).resolves.toBeUndefined();
      expect(mockPrismaClient.product.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw a DatabaseError if delete fails', async () => {
      mockPrismaClient.product.delete.mockRejectedValue(
        new Error('Database error'),
      );

      await expect(database.deleteProduct(1)).rejects.toThrow(DatabaseError);
    });
  });
});
