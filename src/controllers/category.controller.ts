import { CategoryAdapter } from '../adapters/category.adapter';
import { CategoryGateway } from '../gateways/category.gateway';
import { IDatabase } from '../interfaces/database.interface';
import { CategoryUseCases } from '../usecases/category.usecases';

export class CategoryController {
  static async findAll(database: IDatabase): Promise<string> {
    const categoryGateway = new CategoryGateway(database);
    const categories = await CategoryUseCases.findAll(categoryGateway);
    const categoriesJson = CategoryAdapter.adaptArrayJson(categories);

    return categoriesJson;
  }
}
