export class InvalidProductError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidProductError';
  }
}
