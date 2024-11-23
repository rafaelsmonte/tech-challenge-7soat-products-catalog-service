import { InvalidStockError } from '../errors/invalid-stock.error';

export class Stock {
  private id: number;
  private createdAt: Date;
  private updatedAt: Date;
  private productId: number;
  private quantity: number;

  constructor(
    id: number,
    createdAt: Date,
    updatedAt: Date,
    productId: number,
    quantity: number,
  ) {
    this.setId(id);
    this.setCreatedAt(createdAt);
    this.setUpdatedAt(updatedAt);
    this.setProductId(productId);
    this.setQuantity(quantity);
  }

  static new(productId: number, quantity: number): Stock {
    const now = new Date();
    return new Stock(0, now, now, productId, quantity);
  }

  // getters
  public getId(): number {
    return this.id;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getProductId(): number {
    return this.productId;
  }

  public getQuantity(): number {
    return this.quantity;
  }

  // setters
  public setId(id: number): void {
    this.id = id;
  }

  public setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }

  public setProductId(productId: number): void {
    this.productId = productId;
  }

  public setQuantity(quantity: number): void {
    this.quantity = quantity;

    if (this.quantity < 0) {
      throw new InvalidStockError('Quantity value must be higher than -1');
    }
  }
}
