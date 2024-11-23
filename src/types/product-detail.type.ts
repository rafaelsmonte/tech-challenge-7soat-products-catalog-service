import { Stock } from '../entities/stock.entity';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';

export type ProductDetail = {
  product: Product;
  category: Category;
  stock: Stock;
};
