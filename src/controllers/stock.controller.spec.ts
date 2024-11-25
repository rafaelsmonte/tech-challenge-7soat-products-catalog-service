import { StockController } from './stock.controller';
import { IDatabase } from '../interfaces/database.interface';
import { StockGateway } from '../gateways/stock.gateway';
import { ProductGateway } from '../gateways/product.gateway';
import { StockUseCases } from '../usecases/stock.usecases';
import { ProductWithQuantity } from 'src/types/product-with-quantity.type';
import { StockAdapter } from '../adapters/stock.adapter';

jest.mock('../gateways/stock.gateway');
jest.mock('../gateways/product.gateway');
jest.mock('../usecases/stock.usecases');
jest.mock('../adapters/stock.adapter');

describe('StockController', () => {
  const mockDatabase: IDatabase = {} as IDatabase;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('update', () => {
    it('should update the stock and return JSON response', async () => {
      const productId = 1;
      const quantity = 10;
      const mockStock = { id: 1, quantity: 10 };
      const mockStockJson = JSON.stringify(mockStock);

      (StockUseCases.updateQuantityByProductId as jest.Mock).mockResolvedValue(mockStock);
      (StockAdapter.adaptJson as jest.Mock).mockReturnValue(mockStockJson);

      const result = await StockController.update(mockDatabase, productId, quantity);

      expect(StockGateway).toHaveBeenCalledWith(mockDatabase);
      expect(ProductGateway).toHaveBeenCalledWith(mockDatabase);
      expect(StockUseCases.updateQuantityByProductId).toHaveBeenCalledWith(
        expect.any(StockGateway),
        expect.any(ProductGateway),
        productId,
        quantity,
      );
      expect(StockAdapter.adaptJson).toHaveBeenCalledWith(mockStock);
      expect(result).toBe(mockStockJson);
    });
  });

  describe('reserve', () => {
    it('should reserve stock for the given products', async () => {
      const productsWithQuantity: ProductWithQuantity[] = [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 3 },
      ];

      (StockUseCases.reserve as jest.Mock).mockResolvedValue(undefined);

      await StockController.reserve(mockDatabase, productsWithQuantity);

      expect(StockGateway).toHaveBeenCalledWith(mockDatabase);
      expect(ProductGateway).toHaveBeenCalledWith(mockDatabase);
      expect(StockUseCases.reserve).toHaveBeenCalledWith(
        expect.any(StockGateway),
        expect.any(ProductGateway),
        productsWithQuantity,
      );
    });
  });
});
