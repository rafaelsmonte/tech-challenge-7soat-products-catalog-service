import { StockAdapter } from './stock.adapter';
import { Stock } from '../entities/stock.entity';

describe('StockAdapter', () => {
  describe('adaptJson', () => {
    it('should return an empty JSON object for null input', () => {
      const result = StockAdapter.adaptJson(null);
      expect(result).toBe('{}');
    });

    it('should map a Stock object to JSON', () => {
      const mockStock: Stock = {
        getId: jest.fn().mockReturnValue(1),
        getCreatedAt: jest.fn().mockReturnValue(new Date('2023-01-01T10:00:00Z')),
        getUpdatedAt: jest.fn().mockReturnValue(new Date('2023-01-02T10:00:00Z')),
        getProductId: jest.fn().mockReturnValue(101),
        getQuantity: jest.fn().mockReturnValue(50),
      } as unknown as Stock;

      const result = StockAdapter.adaptJson(mockStock);

      const expectedOutput = JSON.stringify({
        id: 1,
        createdAt: '2023-01-01T10:00:00.000Z',
        updatedAt: '2023-01-02T10:00:00.000Z',
        productId: 101,
        quantity: 50,
      });

      expect(result).toBe(expectedOutput);
    });
  });
});
