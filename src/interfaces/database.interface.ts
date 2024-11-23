import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { Stock } from '../entities/stock.entity';

export interface IDatabase {
  // Category
  findAllCategories(): Promise<Category[]>;
  findCategoryById(id: number): Promise<Category>;

  // Product
  findAllProducts(): Promise<Product[]>;
  findProductById(id: number): Promise<Product | null>;
  createProduct(product: Product): Promise<Product>;
  deleteProduct(id: number): Promise<void>;

  // Stock
  findAllStocks(): Promise<Stock[]>;
  findStockByProductId(productId: number): Promise<Stock | null>;
  createStock(stock: Stock): Promise<Stock>;
  updateStockQuantityByProductId(
    productId: number,
    quantity: number,
  ): Promise<Stock>;
}
