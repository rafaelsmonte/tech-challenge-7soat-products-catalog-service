import { StockGateway } from './stock.gateway';
import { Stock } from '../entities/stock.entity';
import { IDatabase } from '../interfaces/database.interface';

describe('StockGateway', () => {
  let stockGateway: StockGateway;
  let mockDatabase: Partial<IDatabase>;

  beforeEach(() => {
    mockDatabase = {
      findAllStocks: jest.fn(),
      findStockByProductId: jest.fn(),
      createStock: jest.fn(),
      updateStockQuantityByProductId: jest.fn(),
    };

    stockGateway = new StockGateway(mockDatabase as IDatabase);
  });

  describe('findAll', () => {
    it('should return all stocks from the database', async () => {
      const mockStocks = [
        new Stock(1, new Date(), new Date(), 1, 100), // Passando todos os argumentos necessários
        new Stock(2, new Date(), new Date(), 2, 200),
      ];

      (mockDatabase.findAllStocks as jest.Mock).mockResolvedValue(mockStocks);

      const result = await stockGateway.findAll();

      expect(mockDatabase.findAllStocks).toHaveBeenCalled();
      expect(result).toEqual(mockStocks);
    });

    it('should return an empty array if no stocks are found', async () => {
      (mockDatabase.findAllStocks as jest.Mock).mockResolvedValue([]);

      const result = await stockGateway.findAll();

      expect(mockDatabase.findAllStocks).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('findByProductId', () => {
    it('should return the stock for the given product id', async () => {
      const mockStock = new Stock(1, new Date(), new Date(), 1, 100);

      (mockDatabase.findStockByProductId as jest.Mock).mockResolvedValue(mockStock);

      const result = await stockGateway.findByProductId(1);

      expect(mockDatabase.findStockByProductId).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockStock);
    });

    it('should return null if no stock is found for the given product id', async () => {
      (mockDatabase.findStockByProductId as jest.Mock).mockResolvedValue(null);

      const result = await stockGateway.findByProductId(999);

      expect(mockDatabase.findStockByProductId).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new stock and return it', async () => {
      const newStock = new Stock(3, new Date(), new Date(), 1, 150);

      (mockDatabase.createStock as jest.Mock).mockResolvedValue(newStock);

      const result = await stockGateway.create(newStock);

      expect(mockDatabase.createStock).toHaveBeenCalledWith(newStock);
      expect(result).toEqual(newStock);
    });
  });

  describe('updateQuantityByProductId', () => {
    it('should update the stock quantity for the given product id', async () => {
      const updatedStock = new Stock(1, new Date(), new Date(), 1, 200);

      (mockDatabase.updateStockQuantityByProductId as jest.Mock).mockResolvedValue(updatedStock);

      const result = await stockGateway.updateQuantityByProductId(updatedStock);

      expect(mockDatabase.updateStockQuantityByProductId).toHaveBeenCalledWith(1, 200);
      expect(result).toEqual(updatedStock);
    });
  });
});
