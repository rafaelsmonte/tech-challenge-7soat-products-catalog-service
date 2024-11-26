import { IProductGateway } from "src/interfaces/product.gateway.interface";
import { IStockGateway } from "src/interfaces/stock.gateway.interface";
import { StockUseCases } from "./stock.usecases";
import { Stock } from "src/entities/stock.entity";
import { Product } from "src/entities/product.entity";
import { ProductWithQuantity } from "src/types/product-with-quantity.type";
import { ProductNotFoundError } from "src/errors/product-not-found.error";
import { StockNotFoundError } from "src/errors/stock-not-found.error";
import { InsufficientStockError } from "src/errors/insufficient-stock.error";
import { ProductOutOfStockError } from "src/errors/product-out-of-stock.error";

describe('StockUseCases', () => {
    let stockGateway: jest.Mocked<IStockGateway>;
    let productGateway: jest.Mocked<IProductGateway>;
  
    beforeEach(() => {
        stockGateway = {
          findAll: jest.fn(),
          findByProductId: jest.fn(),
          create: jest.fn(),
          updateQuantityByProductId: jest.fn(),
        };
        productGateway = {
          findAll: jest.fn(),
          findById: jest.fn(),
          create: jest.fn(),
          delete: jest.fn(),
        };
      });
  
    it('should update stock quantity', async () => {
      const productId = 1;
      const quantity = 10;
      const mockStock = new Stock(1, new Date(), new Date(), 1, 10);
      const mockProduct = new Product(1, new Date(), new Date(), 'Product 1', 100, 'Description', ['pic1.jpg'], 1);
  
      (stockGateway.updateQuantityByProductId as jest.Mock).mockResolvedValue(mockStock);
      (productGateway.findById as jest.Mock).mockResolvedValue(mockProduct);
  
      const result = await StockUseCases.updateQuantityByProductId(
        stockGateway,
        productGateway,
        productId,
        quantity,
      );
  
      expect(stockGateway.updateQuantityByProductId).toHaveBeenCalledWith(
        expect.objectContaining({ productId, quantity }),
      );
      expect(productGateway.findById).toHaveBeenCalledWith(productId);
      expect(result).toEqual(mockStock);
    });
    it('should throw ProductNotFoundError if product is not found', async () => {
        const productId = 1;
        const quantity = 2;
        const productsWithQuantity: ProductWithQuantity[] = [{ productId, quantity }];
    
        (productGateway.findById as jest.Mock).mockResolvedValue(null);
    
        await expect(
          StockUseCases.reserve(stockGateway, productGateway, productsWithQuantity),
        ).rejects.toThrow(ProductNotFoundError);
    
        expect(productGateway.findById).toHaveBeenCalledWith(productId);
      });
    
      it('should throw StockNotFoundError if stock is not found', async () => {
        const productId = 1;
        const quantity = 2;
        const productsWithQuantity: ProductWithQuantity[] = [{ productId, quantity }];
    
        (productGateway.findById as jest.Mock).mockResolvedValue({ getId: () => productId });
        (stockGateway.findByProductId as jest.Mock).mockResolvedValue(null);
    
        await expect(
          StockUseCases.reserve(stockGateway, productGateway, productsWithQuantity),
        ).rejects.toThrow(StockNotFoundError);
    
        expect(productGateway.findById).toHaveBeenCalledWith(productId);
        expect(stockGateway.findByProductId).toHaveBeenCalledWith(productId);
      });
    
      it('should throw InsufficientStockError if stock is insufficient', async () => {
        const productId = 1;
        const quantity = 2;
        const productsWithQuantity: ProductWithQuantity[] = [{ productId, quantity }];
    
        (productGateway.findById as jest.Mock).mockResolvedValue({ getId: () => productId });
        (stockGateway.findByProductId as jest.Mock).mockResolvedValue({ getQuantity: () => 1 });
    
        await expect(
          StockUseCases.reserve(stockGateway, productGateway, productsWithQuantity),
        ).rejects.toThrow(InsufficientStockError);
    
        expect(productGateway.findById).toHaveBeenCalledWith(productId);
        expect(stockGateway.findByProductId).toHaveBeenCalledWith(productId);
      });
    
      it('should throw ProductOutOfStockError if product is out of stock', async () => {
        const productId = 1;
        const quantity = 2;
        const productsWithQuantity: ProductWithQuantity[] = [{ productId, quantity }];
    
        (productGateway.findById as jest.Mock).mockResolvedValue({ getId: () => productId });
        (stockGateway.findByProductId as jest.Mock).mockResolvedValue({ getQuantity: () => 0 });
    
        await expect(
          StockUseCases.reserve(stockGateway, productGateway, productsWithQuantity),
        ).rejects.toThrow(ProductOutOfStockError);
    
        expect(productGateway.findById).toHaveBeenCalledWith(productId);
        expect(stockGateway.findByProductId).toHaveBeenCalledWith(productId);
      });
    
      it('should update stock quantity successfully', async () => {
        const productId = 1;
        const quantity = 2;
        const productsWithQuantity: ProductWithQuantity[] = [{ productId, quantity }];
    
        (productGateway.findById as jest.Mock).mockResolvedValue({ getId: () => productId });
        (stockGateway.findByProductId as jest.Mock).mockResolvedValue({ getQuantity: () => 10 });
    
        await StockUseCases.reserve(stockGateway, productGateway, productsWithQuantity);
    
        expect(productGateway.findById).toHaveBeenCalledWith(productId);
        expect(stockGateway.findByProductId).toHaveBeenCalledWith(productId);
        expect(stockGateway.updateQuantityByProductId).toHaveBeenCalledWith(
          expect.objectContaining({ productId, quantity: 8 }),
        );
      });
});

  
