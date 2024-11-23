import { ProductNotFoundError } from '../errors/product-not-found.error';
import { IProductGateway } from '../interfaces/product.gateway.interface';
import { IStockGateway } from '../interfaces/stock.gateway.interface';
import { StockNotFoundError } from '../errors/stock-not-found.error';
import { Stock } from '../entities/stock.entity';
import { InsufficientStockError } from '../errors/insufficient-stock.error';
import { ProductOutOfStockError } from '../errors/product-out-of-stock.error';

export class StockUseCases {
  static async updateQuantityByProductId(
    stockGateway: IStockGateway,
    productGateway: IProductGateway,
    productId: number,
    quantity: number,
  ): Promise<Stock> {
    const product = await productGateway.findById(productId);

    if (!product) throw new ProductNotFoundError('Product not found');

    const updatedStock = await stockGateway.updateQuantityByProductId(
      Stock.new(productId, quantity),
    );

    return updatedStock;
  }

  static async reserve(
    stockGateway: IStockGateway,
    productGateway: IProductGateway,
    productId: number,
    quantity: number,
  ): Promise<void> {
    const product = await productGateway.findById(productId);

    if (!product) throw new ProductNotFoundError('Product not found');

    const currentStock = await stockGateway.findByProductId(product.getId());

    if (!currentStock) throw new StockNotFoundError('Stock not found');

    const requestedStock = Stock.new(productId, quantity);

    const currentQuantity = currentStock.getQuantity();
    const requestedQuantity = requestedStock.getQuantity();

    const updatedQuantity = currentQuantity - requestedQuantity;

    if (updatedQuantity < 0) {
      if (currentQuantity == 0) {
        throw new ProductOutOfStockError(`Product out of stock`);
      } else {
        throw new InsufficientStockError(
          `Insufficient stock. Only ${currentQuantity} products are available`,
        );
      }
    }

    await stockGateway.updateQuantityByProductId(
      Stock.new(productId, updatedQuantity),
    );
  }
}
