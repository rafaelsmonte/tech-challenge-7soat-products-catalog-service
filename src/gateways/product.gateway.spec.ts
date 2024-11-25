import { IDatabase } from 'src/interfaces/database.interface';
import { Product } from '../entities/product.entity';
import { ProductGateway } from './product.gateway';

describe('ProductGateway', () => {
  let productGateway: ProductGateway;
  let mockDatabase: Partial<IDatabase>;

  beforeEach(() => {
    // Tipando as funções do mockDatabase para retornarem Promises corretamente
    mockDatabase = {
      findAllProducts: jest.fn(() => Promise.resolve([])), // Simulando a função findAllProducts
      findProductById: jest.fn(() => Promise.resolve(null)), // Simulando a função findProductById
      createProduct: jest.fn(() => Promise.resolve(null)), // Simulando a função createProduct
      deleteProduct: jest.fn(() => Promise.resolve(undefined)), // Simulando a função deleteProduct
    };

    productGateway = new ProductGateway(mockDatabase as IDatabase);
  });

  describe('findAll', () => {
    it('should return all products from the database', async () => {
      const mockProducts = [
        new Product(1, new Date(), new Date(), 'Product 1', 100, 'Description 1', ['image1.jpg'], 1),
        new Product(2, new Date(), new Date(), 'Product 2', 200, 'Description 2', ['image2.jpg'], 1),
      ];

      // Agora mockando corretamente o retorno da função
      (mockDatabase.findAllProducts as jest.Mock).mockResolvedValue(mockProducts);

      const result = await productGateway.findAll();

      expect(mockDatabase.findAllProducts).toHaveBeenCalled();
      expect(result).toEqual(mockProducts);
    });

    it('should return an empty array if no products are found', async () => {
      // Mockando o retorno para uma lista vazia
      (mockDatabase.findAllProducts as jest.Mock).mockResolvedValue([]);

      const result = await productGateway.findAll();

      expect(mockDatabase.findAllProducts).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return the product with the given id', async () => {
      const mockProduct = new Product(1, new Date(), new Date(), 'Product 1', 100, 'Description 1', ['image1.jpg'], 1);

      // Mockando o retorno da função findProductById
      (mockDatabase.findProductById as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productGateway.findById(1);

      expect(mockDatabase.findProductById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProduct);
    });

    it('should return null if no product is found with the given id', async () => {
      // Mockando o retorno para null
      (mockDatabase.findProductById as jest.Mock).mockResolvedValue(null);

      const result = await productGateway.findById(999);

      expect(mockDatabase.findProductById).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new product and return it', async () => {
      const newProduct = new Product(3, new Date(), new Date(), 'Product 3', 300, 'Description 3', ['image3.jpg'], 2);
      // Mockando o retorno da criação do produto
      (mockDatabase.createProduct as jest.Mock).mockResolvedValue(newProduct);

      const result = await productGateway.create(newProduct);

      expect(mockDatabase.createProduct).toHaveBeenCalledWith(newProduct);
      expect(result).toEqual(newProduct);
    });
  });

  describe('delete', () => {
    it('should delete the product with the given id', async () => {
      const productId = 1;
      // Mockando o comportamento de delete (não retorna nada)
      (mockDatabase.deleteProduct as jest.Mock).mockResolvedValue(undefined);

      await productGateway.delete(productId);

      expect(mockDatabase.deleteProduct).toHaveBeenCalledWith(productId);
    });
  });
});
