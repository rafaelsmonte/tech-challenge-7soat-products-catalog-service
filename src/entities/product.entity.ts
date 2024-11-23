import { InvalidProductError } from '../errors/invalid-product.error';

export class Product {
  private id: number;
  private createdAt: Date;
  private updatedAt: Date;
  private name: string;
  private price: number;
  private description: string;
  private pictures: string[];
  private categoryId: number;

  constructor(
    id: number,
    createdAt: Date,
    updatedAt: Date,
    name: string,
    price: number,
    description: string,
    pictures: string[],
    categoryId: number,
  ) {
    this.setId(id);
    this.setCreatedAt(createdAt);
    this.setUpdatedAt(updatedAt);
    this.setName(name);
    this.setPrice(price);
    this.setDescription(description);
    this.setPictures(pictures);
    this.setCategoryId(categoryId);
  }

  static new(
    name: string,
    price: number,
    description: string,
    pictures: string[],
    categoryId: number,
  ): Product {
    const now = new Date();
    return new Product(
      0,
      now,
      now,
      name,
      price,
      description,
      pictures,
      categoryId,
    );
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

  public getName(): string {
    return this.name;
  }

  public getPrice(): number {
    return this.price;
  }

  public getDescription(): string {
    return this.description;
  }

  public getPictures(): string[] {
    return this.pictures;
  }

  public getCategoryId(): number {
    return this.categoryId;
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

  public setName(name: string): void {
    this.name = name;

    if (this.name.length > 50) {
      throw new InvalidProductError('Name size must be lesser than 50');
    }
  }

  public setPrice(price: number): void {
    this.price = price;

    if (this.price <= 0) {
      throw new InvalidProductError('Price must be greater than 0');
    }
  }

  public setDescription(description: string): void {
    this.description = description;

    if (this.description.length > 50) {
      throw new InvalidProductError('Description size must be lesser than 50');
    }
  }

  public setPictures(pictures: string[]): void {
    this.pictures = pictures;
  }

  public setCategoryId(categoryId: number): void {
    this.categoryId = categoryId;
  }
}
