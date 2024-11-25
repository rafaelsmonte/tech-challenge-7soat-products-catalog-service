import { Stock } from './stock.entity';
import { InvalidStockError } from '../errors/invalid-stock.error';

describe('Stock', () => {
  describe('Constructor', () => {
    it('should create a stock instance with correct values', () => {
      const now = new Date();
      const stock = new Stock(1, now, now, 101, 50);

      expect(stock.getId()).toBe(1);
      expect(stock.getCreatedAt()).toBe(now);
      expect(stock.getUpdatedAt()).toBe(now);
      expect(stock.getProductId()).toBe(101);
      expect(stock.getQuantity()).toBe(50);
    });
  });

  describe('Static Method new', () => {
    it('should create a new stock instance with initial values', () => {
      const now = new Date();
      const stock = Stock.new(101, 50);
  
      expect(stock.getId()).toBe(0);  // New stock has id = 0
      
      // Verificar se a diferença entre as datas é menor que 1000ms (1 segundo)
      expect(Math.abs(stock.getCreatedAt().getTime() - now.getTime())).toBeLessThanOrEqual(1000);
      expect(Math.abs(stock.getUpdatedAt().getTime() - now.getTime())).toBeLessThanOrEqual(1000);
  
      expect(stock.getProductId()).toBe(101);
      expect(stock.getQuantity()).toBe(50);
    });
  });

  describe('Setters and Getters', () => {
    let stock: Stock;
    
    beforeEach(() => {
      stock = new Stock(1, new Date(), new Date(), 101, 50);
    });

    it('should update quantity with setQuantity', () => {
      stock.setQuantity(100);
      expect(stock.getQuantity()).toBe(100);
    });

    it('should throw InvalidStockError when setting a negative quantity', () => {
      expect(() => stock.setQuantity(-10)).toThrowError(InvalidStockError);
      expect(() => stock.setQuantity(-10)).toThrowError('Quantity value must be higher than -1');
    });

    it('should update productId with setProductId', () => {
      stock.setProductId(202);
      expect(stock.getProductId()).toBe(202);
    });

    it('should update id with setId', () => {
      stock.setId(999);
      expect(stock.getId()).toBe(999);
    });

    it('should update createdAt with setCreatedAt', () => {
      const newDate = new Date(2024, 0, 1);
      stock.setCreatedAt(newDate);
      expect(stock.getCreatedAt()).toBe(newDate);
    });

    it('should update updatedAt with setUpdatedAt', () => {
      const newDate = new Date(2024, 0, 1);
      stock.setUpdatedAt(newDate);
      expect(stock.getUpdatedAt()).toBe(newDate);
    });
  });
});
