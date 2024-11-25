import { CategoryType } from '../enum/category-type.enum';
import { InvalidCategoryError } from '../errors/invalid-category.error';

export class Category {
  private id: number;
  private createdAt: Date;
  private updatedAt: Date;
  private type: CategoryType;

  constructor(id: number, createdAt: Date, updatedAt: Date, type: string) {
    this.setId(id);
    this.setCreatedAt(createdAt);
    this.setUpdatedAt(updatedAt);
    this.setType(type);
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

  public getType(): string {
    return this.type;
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

  public setType(type: string): void {
    this.type = CategoryType[type];

    if (!this.type)
      throw new InvalidCategoryError(
        'Type must be MEAL, DRINK, SIDE or DESSERT',
      );
  }
}
