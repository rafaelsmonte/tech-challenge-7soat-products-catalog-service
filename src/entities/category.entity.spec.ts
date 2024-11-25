import { Category } from './category.entity';
import { CategoryType } from '../enum/category-type.enum';
import { InvalidCategoryError } from '../errors/invalid-category.error';

describe('Category', () => {
  let category: Category;

  beforeEach(() => {
    // Criando uma nova instância da classe Category antes de cada teste
    category = new Category(1, new Date('2023-01-01T10:00:00Z'), new Date('2023-01-02T10:00:00Z'), 'MEAL');
  });


  it('should create a Category instance with valid data', () => {
    expect(category.getId()).toBe(1);
    expect(category.getCreatedAt()).toEqual(new Date('2023-01-01T10:00:00Z'));
    expect(category.getUpdatedAt()).toEqual(new Date('2023-01-02T10:00:00Z'));
    expect(category.getType()).toBe(CategoryType.MEAL);
  });

  it('should update the type correctly', () => {
    category.setType('DRINK');
    expect(category.getType()).toBe(CategoryType.DRINK);
  });

  it('should throw an error if the category type is invalid', () => {
    expect(() => {
      category.setType('INVALID_TYPE');
    }).toThrowError('Type must be MEAL, DRINK, SIDE or DESSERT');
  });

  it('should throw an error if the type is not passed to setType', () => {
    expect(() => {
      category.setType('');
    }).toThrow(InvalidCategoryError);
  });

  it('should return the correct category type for valid enums', () => {
    // Testando com tipos válidos
    category.setType('SIDE');
    expect(category.getType()).toBe(CategoryType.SIDE);

    category.setType('DESSERT');
    expect(category.getType()).toBe(CategoryType.DESSERT);
  });
});
