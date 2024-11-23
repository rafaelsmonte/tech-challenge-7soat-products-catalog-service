import { Stock } from '../entities/stock.entity';

export interface IStockGateway {
  findAll(): Promise<Stock[]>;
  findByProductId(id: number): Promise<Stock | null>;
  create(stock: Stock): Promise<Stock>;
  updateQuantityByProductId(stock: Stock): Promise<Stock>;
}
