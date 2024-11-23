import { Product } from '../entities/product.entity';

export interface IProductGateway {
  findAll(): Promise<Product[]>;
  findById(id: number): Promise<Product | null>;
  create(product: Product): Promise<Product>;
  delete(id: number): Promise<void>;
}
