import { StockAdapter } from './stock.adapter';
import { ProductDetail } from '../types/product-detail.type';
import { Stock } from '../entities/stock.entity';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';

jest.mock('../types/product-detail.type');
jest.mock('../entities/stock.entity');

describe('StockAdapter', () => {
  describe('adaptArrayJson', () => {
    it('should map and return the correct JSON string for an array of product details', () => {
      // Mocking ProductDetail data
      const mockProductDetail: ProductDetail[] = [
        {
          product: {
            getId: jest.fn().mockReturnValue(1),
            getCreatedAt: jest.fn().mockReturnValue(new Date('2023-01-01T10:00:00Z')),
            getUpdatedAt: jest.fn().mockReturnValue(new Date('2023-01-02T10:00:00Z')),
            getName: jest.fn().mockReturnValue('Product 1'),
            getPrice: jest.fn().mockReturnValue(100),
            getDescription: jest.fn().mockReturnValue('Description 1'),
            getPictures: jest.fn().mockReturnValue(['pic1.jpg', 'pic2.jpg']),
          } as unknown as ProductDetail['product'],
          stock: {
            getQuantity: jest.fn().mockReturnValue(10),
          } as unknown as ProductDetail['stock'],
          category: {
            getId: jest.fn().mockReturnValue(101),
            getCreatedAt: jest.fn().mockReturnValue(new Date('2023-01-01T10:00:00Z')),
            getUpdatedAt: jest.fn().mockReturnValue(new Date('2023-01-02T10:00:00Z')),
            getType: jest.fn().mockReturnValue('DRINK'),
          } as unknown as ProductDetail['category'],
        },
      ];

      const productsDetail: ProductDetail[] = mockProductDetail;

      const result = StockAdapter.adaptArrayJson(productsDetail);

      const expectedOutput = JSON.stringify([
        {
          id: 1,
          createdAt: '2023-01-01T10:00:00.000Z',
          updatedAt: '2023-01-02T10:00:00.000Z',
          name: 'Product 1',
          price: 100,
          description: 'Description 1',
          pictures: ["pic1.jpg", "pic2.jpg"],
          quantity: 10,
          category: {
            id: 101,
            createdAt: '2023-01-01T10:00:00.000Z',
            updatedAt: '2023-01-02T10:00:00.000Z',
            type: 'DRINK',
          },
        },
      ]);

      expect(result).toBe(expectedOutput);
    });

    it('should return an empty array as JSON if the productsDetail array is empty', () => {
      const result = StockAdapter.adaptArrayJson([]);

      expect(result).toBe('[]');
    });
  });

  describe('adaptJson', () => {
    it('should map and return the correct JSON string for a valid stock object', () => {
      // Mocking Stock data
      const mockStock = new Stock(1, new Date('2023-01-01'), new Date('2023-02-01'), 1, 100);

      const result = StockAdapter.adaptJson(mockStock);

      const expectedOutput = JSON.stringify(mockStock);

      expect(result).toBe(expectedOutput);
    });

    it('should return an empty object as JSON if stock is null', () => {
      const result = StockAdapter.adaptJson(null);

      expect(result).toBe('{}');
    });
  });
});
