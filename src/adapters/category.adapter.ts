import { Category } from '../entities/category.entity';

export const CategoryAdapter = {
  adaptArrayJson: (categories: Category[]): string => {
    const mappedCategories = categories.map((category) => {
      return {
        id: category.getId(),
        createdAt: category.getCreatedAt(),
        updatedAt: category.getUpdatedAt(),
        type: category.getType(),
      };
    });

    return JSON.stringify(mappedCategories);
  },
};
