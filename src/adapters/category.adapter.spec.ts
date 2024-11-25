import { Category } from '../entities/category.entity';
import { CategoryAdapter } from './category.adapter';

describe('CategoryAdapter', () => {
  describe('adaptArrayJson', () => {
    it('should return an empty JSON array for an empty input array', () => {
      const result = CategoryAdapter.adaptArrayJson([]);
      expect(result).toBe('[]');
    });

    it('should map an array of Category objects to JSON', () => {
      const mockCategories: Category[] = [
        {
          getId: jest.fn().mockReturnValue(1),
          getCreatedAt: jest.fn().mockReturnValue(new Date('2023-01-01T10:00:00Z')),
          getUpdatedAt: jest.fn().mockReturnValue(new Date('2023-01-02T10:00:00Z')),
          getType: jest.fn().mockReturnValue('type1'),
        } as unknown as Category,
        {
          getId: jest.fn().mockReturnValue(2),
          getCreatedAt: jest.fn().mockReturnValue(new Date('2023-02-01T10:00:00Z')),
          getUpdatedAt: jest.fn().mockReturnValue(new Date('2023-02-02T10:00:00Z')),
          getType: jest.fn().mockReturnValue('type2'),
        } as unknown as Category,
      ];

      const result = CategoryAdapter.adaptArrayJson(mockCategories);

      const expectedOutput = JSON.stringify([
        {
          id: 1,
          createdAt: '2023-01-01T10:00:00.000Z',
          updatedAt: '2023-01-02T10:00:00.000Z',
          type: 'type1',
        },
        {
          id: 2,
          createdAt: '2023-02-01T10:00:00.000Z',
          updatedAt: '2023-02-02T10:00:00.000Z',
          type: 'type2',
        },
      ]);

      expect(result).toBe(expectedOutput);
    });

    it('should handle categories with null or undefined values gracefully', () => {
      const mockCategories: Category[] = [
        {
          getId: jest.fn().mockReturnValue(null),
          getCreatedAt: jest.fn().mockReturnValue(null),
          getUpdatedAt: jest.fn().mockReturnValue(undefined),
          getType: jest.fn().mockReturnValue(undefined),
        } as unknown as Category,
      ];

      const result = CategoryAdapter.adaptArrayJson(mockCategories);

      const expectedOutput = JSON.stringify([
        {
          id: null,
          createdAt: null,
        },
      ]);

      expect(result).toBe(expectedOutput);
    });
  });
});
