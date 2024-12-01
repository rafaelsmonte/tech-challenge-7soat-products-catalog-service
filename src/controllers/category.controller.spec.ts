import { CategoryController } from './category.controller';
import { CategoryAdapter } from '../adapters/category.adapter';
import { CategoryGateway } from '../gateways/category.gateway';
import { CategoryUseCases } from '../usecases/category.usecases';
import { IDatabase } from '../interfaces/database.interface';
import { Category } from '../entities/category.entity';

jest.mock('../adapters/category.adapter');
jest.mock('../gateways/category.gateway');
jest.mock('../usecases/category.usecases');

describe('CategoryController', () => {
  describe('findAll', () => {
    it('should fetch all categories and return them as JSON', async () => {
      const mockDatabase: IDatabase = {} as IDatabase;

      const mockCategories: Category[] = [
        {
          getId: jest.fn().mockReturnValue(1),
          getCreatedAt: jest.fn().mockReturnValue(new Date('2023-01-01T10:00:00Z')),
          getUpdatedAt: jest.fn().mockReturnValue(new Date('2023-01-02T10:00:00Z')),
          getType: jest.fn().mockReturnValue('Electronics'),
        } as unknown as Category,
      ];

      const mockCategoryGateway = new CategoryGateway(mockDatabase);
      jest.spyOn(mockCategoryGateway, 'findAll').mockResolvedValue(mockCategories);

      jest.spyOn(CategoryUseCases, 'findAll').mockResolvedValue(mockCategories);

      const mockAdaptedJson = JSON.stringify([
        {
          id: 1,
          createdAt: '2023-01-01T10:00:00.000Z',
          updatedAt: '2023-01-02T10:00:00.000Z',
          type: 'Electronics',
        },
      ]);
      jest.spyOn(CategoryAdapter, 'adaptArrayJson').mockReturnValue(mockAdaptedJson);

      const result = await CategoryController.findAll(mockDatabase);

      expect(CategoryUseCases.findAll).toHaveBeenCalledTimes(1);
      expect(CategoryUseCases.findAll).toHaveBeenCalledWith(expect.any(CategoryGateway));
      expect(CategoryAdapter.adaptArrayJson).toHaveBeenCalledWith(mockCategories);
      expect(result).toBe(mockAdaptedJson);
    });

    it('should return an empty JSON array if no categories are found', async () => {
      const mockDatabase: IDatabase = {} as IDatabase;

      const mockCategoryGateway = new CategoryGateway(mockDatabase);
      jest.spyOn(mockCategoryGateway, 'findAll').mockResolvedValue([]);

      jest.spyOn(CategoryUseCases, 'findAll').mockResolvedValue([]);

      jest.spyOn(CategoryAdapter, 'adaptArrayJson').mockReturnValue('[]');

      const result = await CategoryController.findAll(mockDatabase);

      expect(CategoryUseCases.findAll).toHaveBeenCalledTimes(2);
      expect(CategoryUseCases.findAll).toHaveBeenCalledWith(expect.any(CategoryGateway));
      expect(CategoryAdapter.adaptArrayJson).toHaveBeenCalledWith([]);
      expect(result).toBe('[]');
    });
  });
});
