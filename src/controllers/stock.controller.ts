import { ProductWithQuantity } from '../types/product-with-quantity.type';
import { StockAdapter } from '../adapters/stock.adapter';
import { ProductGateway } from '../gateways/product.gateway';
import { StockGateway } from '../gateways/stock.gateway';
import { IDatabase } from '../interfaces/database.interface';
import { StockUseCases } from '../usecases/stock.usecases';

export class StockController {
  static async update(
    database: IDatabase,
    productId: number,
    quantity: number,
  ): Promise<string> {
    const stockGateway = new StockGateway(database);
    const productGateway = new ProductGateway(database);

    const stock = await StockUseCases.updateQuantityByProductId(
      stockGateway,
      productGateway,
      productId,
      quantity,
    );

    const stockJson = StockAdapter.adaptJson(stock);

    return stockJson;
  }

  static async reserve(
    database: IDatabase,
    productsWithQuantity: ProductWithQuantity[],
  ): Promise<void> {
    const stockGateway = new StockGateway(database);
    const productGateway = new ProductGateway(database);

    await StockUseCases.reserve(
      stockGateway,
      productGateway,
      productsWithQuantity,
    );
  }
}
