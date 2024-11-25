import { CategoryUseCases } from './category.usecases';
import { ICategoryGateway } from '../interfaces/category.gateway.interface';
import { Category } from '../entities/category.entity';

// Mock da interface ICategoryGateway
jest.mock('../interfaces/category.gateway.interface');

describe('CategoryUseCases', () => {
  let categoryGatewayMock: jest.Mocked<ICategoryGateway>;

  beforeEach(() => {
    // Mock da interface ICategoryGateway
    categoryGatewayMock = {
      findAll: jest.fn(),
      findById: jest.fn(),
    };
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories: Category[] = [
        new Category(1, new Date(), new Date(), 'MEAL'), 
        new Category(2, new Date(), new Date(), 'DRINK'), 
      ];

      // Simulando o retorno do método findAll
      categoryGatewayMock.findAll.mockResolvedValue(categories);

      const result = await CategoryUseCases.findAll(categoryGatewayMock);

      expect(result).toEqual(categories); // Verifica se as categorias retornadas são as mesmas
      expect(categoryGatewayMock.findAll).toHaveBeenCalledTimes(1); // Verifica se o método foi chamado
    });

    it('should return an empty array if no categories are found', async () => {
      // Simulando o retorno de uma lista vazia
      categoryGatewayMock.findAll.mockResolvedValue([]);

      const result = await CategoryUseCases.findAll(categoryGatewayMock);

      expect(result).toEqual([]); // Verifica se retorna um array vazio
      expect(categoryGatewayMock.findAll).toHaveBeenCalledTimes(1); // Verifica se o método foi chamado
    });

    it('should throw an error if there is an issue retrieving categories', async () => {
      // Simulando um erro ao chamar findAll
      categoryGatewayMock.findAll.mockRejectedValue(new Error('Database error'));

      await expect(CategoryUseCases.findAll(categoryGatewayMock)).rejects.toThrow('Database error');
      expect(categoryGatewayMock.findAll).toHaveBeenCalledTimes(1); // Verifica se o método foi chamado
    });
  });
});
