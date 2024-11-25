import { ProductUseCases } from './product.usecases';
import { IProductGateway } from '../interfaces/product.gateway.interface';
import { ICategoryGateway } from '../interfaces/category.gateway.interface';
import { IStockGateway } from '../interfaces/stock.gateway.interface';
import { CategoryNotFoundError } from '../errors/category-not-found.error';
import { StockNotFoundError } from '../errors/stock-not-found.error';
import { Product } from '../entities/product.entity';
import { Stock } from '../entities/stock.entity';
import { Category } from '../entities/category.entity';
import { ProductDetail } from '../types/product-detail.type';
import { ProductNotFoundError } from 'src/errors/product-not-found.error';

jest.mock('../interfaces/product.gateway.interface');
jest.mock('../interfaces/category.gateway.interface');
jest.mock('../interfaces/stock.gateway.interface');

describe('ProductUseCases', () => {
  let productGateway: jest.Mocked<IProductGateway>;
  let categoryGateway: jest.Mocked<ICategoryGateway>;
  let stockGateway: jest.Mocked<IStockGateway>;

  beforeEach(() => {
    productGateway = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    categoryGateway = {
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    stockGateway = {
      findByProductId: jest.fn(),
      create: jest.fn(),
      updateQuantityByProductId: jest.fn(),
      findAll: jest.fn(),
    };
  });

  it('should find all products with their category and stock', async () => {
    const product = new Product(1, new Date(), new Date(), 'Product 1', 100, 'Description', ['pic1.jpg'], 1);
    const category = new Category(1, new Date(), new Date(), 'MEAL');
    const stock = new Stock(1, new Date(), new Date(), 1, 50);

    productGateway.findAll.mockResolvedValue([product]);
    categoryGateway.findById.mockResolvedValue(category);
    stockGateway.findByProductId.mockResolvedValue(stock);

    const result = await ProductUseCases.findAll(productGateway, categoryGateway, stockGateway);

    expect(result).toEqual([
      { product, category, stock },
    ]);
  });

  it('should throw CategoryNotFoundError when a product has no category', async () => {
    const product = new Product(1, new Date(), new Date(), 'Product 1', 100, 'Description', ['pic1.jpg'], 1);
    productGateway.findAll.mockResolvedValue([product]);
    categoryGateway.findById.mockResolvedValue(null); // Simulate category not found
    stockGateway.findByProductId.mockResolvedValue(new Stock(1, new Date(), new Date(), 1, 50));

    await expect(ProductUseCases.findAll(productGateway, categoryGateway, stockGateway))
      .rejects
      .toThrow(CategoryNotFoundError);
  });

  it('should throw StockNotFoundError when a product has no stock', async () => {
    const product = new Product(1, new Date(), new Date(), 'Product 1', 100, 'Description', ['pic1.jpg'], 1);
    const category = new Category(1, new Date(), new Date(), 'MEAL');
    productGateway.findAll.mockResolvedValue([product]);
    categoryGateway.findById.mockResolvedValue(category);
    stockGateway.findByProductId.mockResolvedValue(null); // Simulate stock not found

    await expect(ProductUseCases.findAll(productGateway, categoryGateway, stockGateway))
      .rejects
      .toThrow(StockNotFoundError);
  });

  it('should return empty array if no products exist', async () => {
    productGateway.findAll.mockResolvedValue([]); // Simulate no products found

    const result = await ProductUseCases.findAll(productGateway, categoryGateway, stockGateway);

    expect(result).toEqual([]);
  });

  // Outros testes existentes...
  it('should find a product by ID with its category and stock', async () => {
    const product = new Product(1, new Date(), new Date(), 'Product 1', 100, 'Description', ['pic1.jpg'], 1);
    const category = new Category(1, new Date(), new Date(), 'MEAL');
    const stock = new Stock(1, new Date(), new Date(), 1, 50);

    productGateway.findById.mockResolvedValue(product);
    categoryGateway.findById.mockResolvedValue(category);
    stockGateway.findByProductId.mockResolvedValue(stock);

    const result = await ProductUseCases.findById(productGateway, categoryGateway, stockGateway, 1);

    expect(result.product).toEqual(product);
    expect(result.category).toEqual(category);
    expect(result.stock).toEqual(stock);
  });

  it('should throw ProductNotFoundError when product is not found by ID', async () => {
    productGateway.findById.mockResolvedValue(null);

    await expect(ProductUseCases.findById(productGateway, categoryGateway, stockGateway, 1))
      .rejects
      .toThrow(ProductNotFoundError);
  });

  it('should throw CategoryNotFoundError when category is not found for product', async () => {
    const product = new Product(1, new Date(), new Date(), 'Product 1', 100, 'Description', ['pic1.jpg'], 1);
    productGateway.findById.mockResolvedValue(product);
    categoryGateway.findById.mockResolvedValue(null); // Simulate category not found
    stockGateway.findByProductId.mockResolvedValue(new Stock(1, new Date(), new Date(), 1, 50));

    await expect(ProductUseCases.findById(productGateway, categoryGateway, stockGateway, 1))
      .rejects
      .toThrow(CategoryNotFoundError);
  });

  it('should throw StockNotFoundError when stock is not found for product', async () => {
    const product = new Product(1, new Date(), new Date(), 'Product 1', 100, 'Description', ['pic1.jpg'], 1);
    const category = new Category(1, new Date(), new Date(), 'MEAL');
    productGateway.findById.mockResolvedValue(product);
    categoryGateway.findById.mockResolvedValue(category);
    stockGateway.findByProductId.mockResolvedValue(null); // Simulate stock not found

    await expect(ProductUseCases.findById(productGateway, categoryGateway, stockGateway, 1))
      .rejects
      .toThrow(StockNotFoundError);
  });

  it('should create a product with its stock and category', async () => {
    const category = new Category(1, new Date(), new Date(), 'MEAL');
    const product = new Product(1, new Date(), new Date(), 'New Product', 100, 'Product Description', ['pic.jpg'], 1);
    const stock = new Stock(1, new Date(), new Date(), 1, 50);

    categoryGateway.findById.mockResolvedValue(category);
    productGateway.create.mockResolvedValue(product);
    stockGateway.create.mockResolvedValue(stock);

    const result = await ProductUseCases.create(
      productGateway,
      categoryGateway,
      stockGateway,
      'New Product',
      100,
      'Product Description',
      ['pic.jpg'],
      1,
      50
    );

    expect(result.product).toEqual(product);
    expect(result.category).toEqual(category);
    expect(result.stock).toEqual(stock);
  });

  it('should throw CategoryNotFoundError when category is not found during product creation', async () => {
    categoryGateway.findById.mockResolvedValue(null);

    await expect(ProductUseCases.create(
      productGateway,
      categoryGateway,
      stockGateway,
      'New Product',
      100,
      'Product Description',
      ['pic.jpg'],
      1,
      50
    ))
      .rejects
      .toThrow(CategoryNotFoundError);
  });

  it('should delete a product', async () => {
    const product = new Product(1, new Date(), new Date(), 'Product 1', 100, 'Description', ['pic1.jpg'], 1);
    productGateway.findById.mockResolvedValue(product);
    productGateway.delete.mockResolvedValue(undefined);

    await expect(ProductUseCases.delete(productGateway, 1)).resolves.not.toThrow();
    expect(productGateway.delete).toHaveBeenCalledWith(1);
  });

  it('should throw ProductNotFoundError when deleting a non-existent product', async () => {
    productGateway.findById.mockResolvedValue(null);

    await expect(ProductUseCases.delete(productGateway, 1))
      .rejects
      .toThrow(ProductNotFoundError);
  });
});
