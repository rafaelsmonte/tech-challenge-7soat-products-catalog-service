import { CategoryGateway } from '../gateways/category.gateway';
import { Category } from '../entities/category.entity';
import { IDatabase } from '../interfaces/database.interface';

describe('CategoryGateway', () => {
  let categoryGateway: CategoryGateway;
  let mockDatabase: jest.Mocked<IDatabase>;

  beforeEach(() => {
    // Mockando a função do database
    mockDatabase = {
      findAllCategories: jest.fn(), // Garantir que a função seja mockada
      findCategoryById: jest.fn(),
      findAllProducts: jest.fn(),
      findProductById: jest.fn(),
      createProduct: jest.fn(),
      deleteProduct: jest.fn(),
      findAllStocks: jest.fn(),
      findStockByProductId: jest.fn(),
      createStock: jest.fn(),
      updateStockQuantityByProductId: jest.fn(),
    } as jest.Mocked<IDatabase>;

    categoryGateway = new CategoryGateway(mockDatabase);
  });

  describe('findAll', () => {
    it('should return all categories from the database', async () => {
      const mockCategories = [
        new Category(1, new Date(), new Date(), 'MEAL'),
        new Category(2, new Date(), new Date(), 'DRINK'),
      ];

      // Aqui você pode mockar o retorno da função findAllCategories
      mockDatabase.findAllCategories.mockResolvedValue(mockCategories);

      const result = await categoryGateway.findAll();

      expect(mockDatabase.findAllCategories).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
    });

    it('should return an empty array if no categories are found', async () => {
      mockDatabase.findAllCategories.mockResolvedValue([]);

      const result = await categoryGateway.findAll();

      expect(mockDatabase.findAllCategories).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return the category with the given id', async () => {
      const mockCategory = new Category(1, new Date(), new Date(), 'MEAL');

      mockDatabase.findCategoryById.mockResolvedValue(mockCategory);

      const result = await categoryGateway.findById(1);

      expect(mockDatabase.findCategoryById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCategory);
    });

    it('should return null if no category is found with the given id', async () => {
      mockDatabase.findCategoryById.mockResolvedValue(null);

      const result = await categoryGateway.findById(999);

      expect(mockDatabase.findCategoryById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });
});
