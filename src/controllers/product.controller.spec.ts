import { ProductController } from './product.controller';
import { ProductGateway } from '../gateways/product.gateway';
import { CategoryGateway } from '../gateways/category.gateway';
import { StockGateway } from '../gateways/stock.gateway';
import { ProductUseCases } from '../usecases/product.usecases';
import { ProductAdapter } from '../adapters/product.adapter';

jest.mock('../gateways/product.gateway');
jest.mock('../gateways/category.gateway');
jest.mock('../gateways/stock.gateway');
jest.mock('../usecases/product.usecases');
jest.mock('../adapters/product.adapter');

describe('ProductController', () => {
  let mockDatabase: any;

  beforeEach(() => {
    mockDatabase = {}; // Mock básico do banco de dados
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all products in JSON format', async () => {
      const mockProductsAndCategory = [{ id: 1, name: 'Product 1' }];
      (ProductUseCases.findAll as jest.Mock).mockResolvedValue(mockProductsAndCategory);
      (ProductAdapter.adaptArrayJson as jest.Mock).mockReturnValue('mocked JSON');

      const result = await ProductController.findAll(mockDatabase);

      expect(ProductUseCases.findAll).toHaveBeenCalledWith(
        expect.any(ProductGateway),
        expect.any(CategoryGateway),
        expect.any(StockGateway),
      );
      expect(ProductAdapter.adaptArrayJson).toHaveBeenCalledWith(mockProductsAndCategory);
      expect(result).toBe('mocked JSON');
    });
  });

  describe('findById', () => {
    it('should return a product by id in JSON format', async () => {
      const mockProductDetail = { id: 1, name: 'Product 1' };
      (ProductUseCases.findById as jest.Mock).mockResolvedValue(mockProductDetail);
      (ProductAdapter.adaptJson as jest.Mock).mockReturnValue('mocked JSON');

      const result = await ProductController.findById(mockDatabase, 1);

      expect(ProductUseCases.findById).toHaveBeenCalledWith(
        expect.any(ProductGateway),
        expect.any(CategoryGateway),
        expect.any(StockGateway),
        1,
      );
      expect(ProductAdapter.adaptJson).toHaveBeenCalledWith(mockProductDetail);
      expect(result).toBe('mocked JSON');
    });
  });

  describe('create', () => {
    it('should create a product and return its details in JSON format', async () => {
      const mockProductDetail = { id: 1, name: 'New Product' };
      (ProductUseCases.create as jest.Mock).mockResolvedValue(mockProductDetail);
      (ProductAdapter.adaptJson as jest.Mock).mockReturnValue('mocked JSON');

      const result = await ProductController.create(
        mockDatabase,
        'New Product',
        100,
        'Description',
        ['pic1.jpg'],
        2,
        50,
      );

      expect(ProductUseCases.create).toHaveBeenCalledWith(
        expect.any(ProductGateway),
        expect.any(CategoryGateway),
        expect.any(StockGateway),
        'New Product',
        100,
        'Description',
        ['pic1.jpg'],
        2,
        50,
      );
      expect(ProductAdapter.adaptJson).toHaveBeenCalledWith(mockProductDetail);
      expect(result).toBe('mocked JSON');
    });
  });

  describe('delete', () => {
    it('should delete a product by id', async () => {
      await ProductController.delete(mockDatabase, 1);

      expect(ProductUseCases.delete).toHaveBeenCalledWith(expect.any(ProductGateway), 1);
    });
  });
});
