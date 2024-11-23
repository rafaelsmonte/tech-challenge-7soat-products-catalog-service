import { Product } from '../entities/product.entity';
import { IDatabase } from '../interfaces/database.interface';
import { IProductGateway } from '../interfaces/product.gateway.interface';

export class ProductGateway implements IProductGateway {
  constructor(private database: IDatabase) {}

  public async findAll(): Promise<Product[]> {
    return this.database.findAllProducts();
  }

  public async findById(id: number): Promise<Product | null> {
    return this.database.findProductById(id);
  }

  public async create(product: Product): Promise<Product> {
    return this.database.createProduct(product);
  }

  public async delete(id: number): Promise<void> {
    return this.database.deleteProduct(id);
  }
}
