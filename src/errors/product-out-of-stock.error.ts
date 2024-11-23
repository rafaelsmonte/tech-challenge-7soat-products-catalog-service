export class ProductOutOfStockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProductOutOfStockError';
  }
}
