import { Product } from './product.entity';
import { InvalidProductError } from '../errors/invalid-product.error';

describe('Product', () => {
  let product: Product;

  beforeEach(() => {
    product = new Product(1, new Date(), new Date(), 'Product 1', 100, 'Description', ['pic1.jpg'], 1);
  });

  describe('constructor', () => {
    it('should create a product with valid attributes', () => {
      expect(product.getId()).toBe(1);
      expect(product.getName()).toBe('Product 1');
      expect(product.getPrice()).toBe(100);
      expect(product.getDescription()).toBe('Description');
      expect(product.getPictures()).toEqual(['pic1.jpg']);
      expect(product.getCategoryId()).toBe(1);
    });
  });

  describe('setName', () => {
    it('should set a valid name', () => {
      product.setName('New Name');
      expect(product.getName()).toBe('New Name');
    });

    it('should throw an error if name length is greater than 50', () => {
      expect(() => {
        product.setName('A'.repeat(51)); // Name with 51 characters
      }).toThrowError(InvalidProductError);
      expect(() => {
        product.setName('A'.repeat(51));
      }).toThrowError('Name size must be lesser than 50');
    });
  });

  describe('setPrice', () => {
    it('should set a valid price', () => {
      product.setPrice(200);
      expect(product.getPrice()).toBe(200);
    });

    it('should throw an error if price is less than or equal to 0', () => {
      expect(() => {
        product.setPrice(0);
      }).toThrowError(InvalidProductError);
      expect(() => {
        product.setPrice(-10);
      }).toThrowError('Price must be greater than 0');
    });
  });

  describe('setDescription', () => {
    it('should set a valid description', () => {
      product.setDescription('New description');
      expect(product.getDescription()).toBe('New description');
    });

    it('should throw an error if description length is greater than 50', () => {
      expect(() => {
        product.setDescription('A'.repeat(51)); // Description with 51 characters
      }).toThrowError(InvalidProductError);
      expect(() => {
        product.setDescription('A'.repeat(51));
      }).toThrowError('Description size must be lesser than 50');
    });
  });

  describe('new', () => {
    it('should create a new product with initial values', () => {
      const newProduct = Product.new('New Product', 150, 'New Product Description', ['pic1.jpg'], 2);
      expect(newProduct.getId()).toBe(0); // Default ID should be 0
      expect(newProduct.getName()).toBe('New Product');
      expect(newProduct.getPrice()).toBe(150);
      expect(newProduct.getDescription()).toBe('New Product Description');
      expect(newProduct.getCategoryId()).toBe(2);
      expect(newProduct.getCreatedAt()).toBeInstanceOf(Date);
      expect(newProduct.getUpdatedAt()).toBeInstanceOf(Date);
    });
  });
});
