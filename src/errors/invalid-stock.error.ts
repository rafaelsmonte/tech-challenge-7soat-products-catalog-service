export class InvalidStockError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidStockError';
  }
}
