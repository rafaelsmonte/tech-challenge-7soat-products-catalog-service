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

  // method for testing SonarQube coverage, should not be merged on main
  static adjust_score_testing_coverage(score: number): string {
    if (score < 0) return '0';
    if (score > 100) return '100';
    return score.toFixed(2);
  }

  // method for testing SonarQube coverage, should not be merged on main
  static describe_number_testing_coverage(number: number): string {
    if (number % 2 === 0) return 'Even';
    return 'Odd';
  }

  // method for testing SonarQube coverage, should not be merged on main
  static calculate_discount_testing_coverage(price: number): string {
    if (price > 500) return '20%';
    if (price > 100) return '10%';
    return 'No discount';
  }

  // method for testing SonarQube coverage, should not be merged on main
  static determine_age_group_testing_coverage(age: number): string {
    if (age < 13) return 'Child';
    if (age < 18) return 'Teenager';
    if (age < 65) return 'Adult';
    return 'Senior';
  }

  // method for testing SonarQube coverage, should not be merged on main
  static speed_category_testing_coverage(speed: number): string {
    if (speed < 0) return 'Invalid';
    if (speed <= 30) return 'Slow';
    if (speed <= 70) return 'Normal';
    return 'Fast';
  }

}
