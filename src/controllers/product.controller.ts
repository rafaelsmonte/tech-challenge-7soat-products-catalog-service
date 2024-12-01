import { StockGateway } from '../gateways/stock.gateway';
import { ProductAdapter } from '../adapters/product.adapter';
import { CategoryGateway } from '../gateways/category.gateway';
import { ProductGateway } from '../gateways/product.gateway';
import { IDatabase } from '../interfaces/database.interface';
import { ProductUseCases } from '../usecases/product.usecases';

export class ProductController {
  static async findAll(database: IDatabase): Promise<string> {
    const productGateway = new ProductGateway(database);
    const categoryGateway = new CategoryGateway(database);
    const stockGateway = new StockGateway(database);

    const productsDetail = await ProductUseCases.findAll(
      productGateway,
      categoryGateway,
      stockGateway,
    );

    return ProductAdapter.adaptArrayJson(productsDetail);
  }

  static async findById(database: IDatabase, id: number): Promise<string> {
    const productGateway = new ProductGateway(database);
    const categoryGateway = new CategoryGateway(database);
    const stockGateway = new StockGateway(database);

    const productDetail = await ProductUseCases.findById(
      productGateway,
      categoryGateway,
      stockGateway,
      id,
    );

    return ProductAdapter.adaptJson(productDetail);
  }

  static async create(
    database: IDatabase,
    name: string,
    price: number,
    description: string,
    pictures: string[],
    categoryId: number,
    stockQuantity: number,
  ): Promise<string> {
    const productGateway = new ProductGateway(database);
    const categoryGateway = new CategoryGateway(database);
    const stockGateway = new StockGateway(database);

    const productDetail = await ProductUseCases.create(
      productGateway,
      categoryGateway,
      stockGateway,
      name,
      price,
      description,
      pictures,
      categoryId,
      stockQuantity,
    );

    return ProductAdapter.adaptJson(productDetail);
  }

  static async delete(database: IDatabase, id: number): Promise<void> {
    const productGateway = new ProductGateway(database);

    await ProductUseCases.delete(productGateway, id);
  }
}
