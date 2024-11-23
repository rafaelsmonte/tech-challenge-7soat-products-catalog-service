import { IStockGateway } from '../interfaces/stock.gateway.interface';
import { IDatabase } from '../interfaces/database.interface';
import { Stock } from '../entities/stock.entity';

export class StockGateway implements IStockGateway {
  constructor(private database: IDatabase) {}

  async findAll(): Promise<Stock[]> {
    return this.database.findAllStocks();
  }

  async findByProductId(productId: number): Promise<Stock | null> {
    return this.database.findStockByProductId(productId);
  }

  async create(stock: Stock): Promise<Stock> {
    return this.database.createStock(stock);
  }

  async updateQuantityByProductId(stock: Stock): Promise<Stock> {
    return this.database.updateStockQuantityByProductId(
      stock.getProductId(),
      stock.getQuantity(),
    );
  }
}
