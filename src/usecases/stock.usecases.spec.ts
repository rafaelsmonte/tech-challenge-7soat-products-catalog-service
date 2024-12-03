import { StockUseCases } from './stock.usecases';
import { ProductNotFoundError } from '../errors/product-not-found.error';
import { StockNotFoundError } from '../errors/stock-not-found.error';
import { InsufficientStockError } from '../errors/insufficient-stock.error';
import { ProductOutOfStockError } from '../errors/product-out-of-stock.error';
import { IStockGateway } from '../interfaces/stock.gateway.interface';
import { IProductGateway } from '../interfaces/product.gateway.interface';
import { ICategoryGateway } from '../interfaces/category.gateway.interface';
import { Stock } from '../entities/stock.entity';
import { Decimal } from '@prisma/client/runtime/library';
import { Product } from 'src/entities/product.entity';
import { Category } from 'src/entities/category.entity';

describe('StockUseCases', () => {
  let stockGateway: jest.Mocked<IStockGateway>;
  let productGateway: jest.Mocked<IProductGateway>;
  let categoryGateway: jest.Mocked<ICategoryGateway>;
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2024-12-01T21:26:46.713Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });
  beforeEach(() => {
    stockGateway = {
      updateQuantityByProductId: jest.fn(),
      findByProductId: jest.fn(),
    } as unknown as jest.Mocked<IStockGateway>;

    productGateway = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IProductGateway>;

    categoryGateway = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<ICategoryGateway>;
  });

  describe('updateQuantityByProductId', () => {
    it('should update stock quantity successfully', async () => {
      const mockProduct = new Product(1, new Date(), new Date(), 'Mock Product', 100, 'A mock product for testing', [], 1);

      const productId = 1;
      const quantity = 10;
      const mockStock = new Stock(productId, new Date(), new Date(), productId, quantity);

      productGateway.findById.mockResolvedValue(mockProduct);
      stockGateway.updateQuantityByProductId.mockResolvedValue(mockStock);

      const result = await StockUseCases.updateQuantityByProductId(stockGateway, productGateway, productId, quantity);

      expect(productGateway.findById).toHaveBeenCalledWith(productId);
      expect(stockGateway.updateQuantityByProductId).toHaveBeenCalledWith(Stock.new(productId, quantity));
      expect(result).toEqual(mockStock);
    });

    it('should throw ProductNotFoundError if product does not exist', async () => {
      const productId = 1;
      const quantity = 10;

      productGateway.findById.mockResolvedValue(null);

      await expect(
        StockUseCases.updateQuantityByProductId(stockGateway, productGateway, productId, quantity),
      ).rejects.toThrow(ProductNotFoundError);
    });
  });

  describe('reserve', () => {
    it('should reserve stock successfully', async () => {
      const productId = 1;
      const quantity = 2;
      const productsWithQuantity = [{ productId, quantity }];
      const initialQuantity = 10;
      const updatedQuantity = 8;
      const mockProduct = new Product(productId, new Date(), new Date(), 'Mock Product', 100, 'A mock product for testing', [], 1);
      const mockCategory = new Category(1, new Date(), new Date(), 'MEAL');

      //Giver the following stock
      const mockStock = new Stock(1, new Date(), new Date(), mockProduct.getId(), initialQuantity);

      productGateway.findById.mockResolvedValue(mockProduct);
      stockGateway.findByProductId.mockResolvedValue(mockStock);
      categoryGateway.findById.mockResolvedValue(mockCategory);


      //When I reserve stock for the given products
      const result = await StockUseCases.reserve(stockGateway, productGateway, categoryGateway, productsWithQuantity);

      expect(productGateway.findById).toHaveBeenCalledWith(productId);
      expect(stockGateway.findByProductId).toHaveBeenCalledWith(productId);
      expect(stockGateway.updateQuantityByProductId).toHaveBeenCalledWith(Stock.new(productId, updatedQuantity));

      
      //Then the result should be equal to the product with the reserved stock      
      expect(result).toEqual([
        {
          product: mockProduct,
          category: mockCategory,
          stock: Stock.new(productId, quantity),
        },
      ]);
    });

    it('should throw ProductNotFoundError if product does not exist', async () => {
      const productId = 1;
      const quantity = 2;
      const productsWithQuantity = [{ productId, quantity }];

      productGateway.findById.mockResolvedValue(null);

      await expect(
        StockUseCases.reserve(stockGateway, productGateway, categoryGateway, productsWithQuantity),
      ).rejects.toThrow(ProductNotFoundError);
    });

    it('should throw StockNotFoundError if stock does not exist', async () => {
      const productId = 1;
      const quantity = 2;
      const productsWithQuantity = [{ productId, quantity }];
      const mockProduct = new Product(1, new Date(), new Date(), 'Mock Product', 100, 'A mock product for testing', [], 1);


      productGateway.findById.mockResolvedValue(mockProduct);
      stockGateway.findByProductId.mockResolvedValue(null);

      await expect(
        StockUseCases.reserve(stockGateway, productGateway, categoryGateway, productsWithQuantity),
      ).rejects.toThrow(StockNotFoundError);
    });

    it('should throw InsufficientStockError if stock is insufficient', async () => {
      const productId = 1;
      const quantity = 5;
      const productsWithQuantity = [{ productId, quantity }];
      const mockProduct = new Product(1, new Date(), new Date(), 'Mock Product', 100, 'A mock product for testing', [], 1);

      const mockStock = new Stock(productId, new Date(), new Date(), productId, 3);

      productGateway.findById.mockResolvedValue(mockProduct);
      stockGateway.findByProductId.mockResolvedValue(mockStock);

      await expect(
        StockUseCases.reserve(stockGateway, productGateway, categoryGateway, productsWithQuantity),
      ).rejects.toThrow(InsufficientStockError);
    });

    it('should throw ProductOutOfStockError if stock is zero', async () => {
      const productId = 1;
      const quantity = 2;
      const productsWithQuantity = [{ productId, quantity }];
      const mockProduct = new Product(1, new Date(), new Date(), 'Mock Product', 100, 'A mock product for testing', [], 1);

      const mockStock = new Stock(productId, new Date(), new Date(), productId, 0);

      productGateway.findById.mockResolvedValue(mockProduct);
      stockGateway.findByProductId.mockResolvedValue(mockStock);

      await expect(
        StockUseCases.reserve(stockGateway, productGateway, categoryGateway, productsWithQuantity),
      ).rejects.toThrow(ProductOutOfStockError);
    });
  });
});
