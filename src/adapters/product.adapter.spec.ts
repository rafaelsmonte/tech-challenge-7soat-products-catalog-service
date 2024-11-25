import { ProductAdapter } from './product.adapter';
import { ProductDetail } from '../types/product-detail.type';

describe('ProductAdapter', () => {
  describe('adaptArrayJson', () => {
    it('should return an empty JSON array for an empty input array', () => {
      const result = ProductAdapter.adaptArrayJson([]);
      expect(result).toBe('[]');
    });

    it('should map an array of ProductDetail objects to JSON', () => {
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
            getType: jest.fn().mockReturnValue('Electronics'),
          } as unknown as ProductDetail['category'],
        },
      ];

      const result = ProductAdapter.adaptArrayJson(mockProductDetail);

      const expectedOutput = JSON.stringify([
        {
          id: 1,
          createdAt: '2023-01-01T10:00:00.000Z',
          updatedAt: '2023-01-02T10:00:00.000Z',
          name: 'Product 1',
          price: 100,
          description: 'Description 1',
          pictures: ['pic1.jpg', 'pic2.jpg'],
          quantity: 10,
          category: {
            id: 101,
            createdAt: '2023-01-01T10:00:00.000Z',
            updatedAt: '2023-01-02T10:00:00.000Z',
            type: 'Electronics',
          },
        },
      ]);

      expect(result).toBe(expectedOutput);
    });
  });

  describe('adaptJson', () => {
    it('should return an empty JSON object for null input', () => {
      const result = ProductAdapter.adaptJson(null);
      expect(result).toBe('{}');
    });

    it('should map a ProductDetail object to JSON', () => {
      const mockProductDetail: ProductDetail = {
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
          getType: jest.fn().mockReturnValue('Electronics'),
        } as unknown as ProductDetail['category'],
      };

      const result = ProductAdapter.adaptJson(mockProductDetail);

      const expectedOutput = JSON.stringify({
        id: 1,
        createdAt: '2023-01-01T10:00:00.000Z',
        updatedAt: '2023-01-02T10:00:00.000Z',
        name: 'Product 1',
        price: 100,
        description: 'Description 1',
        pictures: ['pic1.jpg', 'pic2.jpg'],
        quantity: 10,
        category: {
          id: 101,
          createdAt: '2023-01-01T10:00:00.000Z',
          updatedAt: '2023-01-02T10:00:00.000Z',
          type: 'Electronics',
        },
      });

      expect(result).toBe(expectedOutput);
    });
  });
});
