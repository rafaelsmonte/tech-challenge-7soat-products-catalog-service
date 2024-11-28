import {
  PrismaClient,
  Category as PrismaCategory,
  Product as PrismaProduct,
  Stock as PrismaStock,
  Prisma,
} from '@prisma/client';
import Decimal from 'decimal.js';
import { Category } from '../entities/category.entity';
import { Stock } from '../entities/stock.entity';
import { Product } from '../entities/product.entity';
import { DatabaseError } from '../errors/database.error';
import { IDatabase } from '../interfaces/database.interface';

export class PrismaDatabase implements IDatabase {
  private prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();
  }

  async findAllCategories(): Promise<Category[]> {
    try {
      const categories: PrismaCategory[] =
        await this.prismaClient.category.findMany();

      return categories.map(
        (category) =>
          new Category(
            category.id,
            category.createdAt,
            category.updatedAt,
            category.type,
          ),
      );
    } catch (error) {
      console.log(`Database error: ${error}`);
      throw new DatabaseError('Failed to find categories');
    }
  }

  async findCategoryById(id: number): Promise<Category | null> {
    try {
      const category: PrismaCategory =
        await this.prismaClient.category.findUnique({
          where: { id },
        });

      if (!category) return null;

      return new Category(
        category.id,
        category.createdAt,
        category.updatedAt,
        category.type,
      );
    } catch (error) {
      console.log(`Database error: ${error}`);
      throw new DatabaseError('Failed to find category');
    }
  }

  async findAllProducts(): Promise<Product[]> {
    try {
      const products: PrismaProduct[] =
        await this.prismaClient.product.findMany();

      return products.map(
        (product) =>
          new Product(
            product.id,
            product.createdAt,
            product.updatedAt,
            product.name,
            new Decimal(product.price).toNumber(),
            product.description,
            product.pictures,
            product.categoryId,
          ),
      );
    } catch (error) {
      console.log(`Database error: ${error}`);
      throw new DatabaseError('Failed to find products');
    }
  }

  async findProductById(id: number): Promise<Product | null> {
    try {
      const product: PrismaProduct = await this.prismaClient.product.findUnique(
        {
          where: { id },
        },
      );

      if (!product) return null;

      return new Product(
        product.id,
        product.createdAt,
        product.updatedAt,
        product.name,
        new Decimal(product.price).toNumber(),
        product.description,
        product.pictures,
        product.categoryId,
      );
    } catch (error) {
      console.log(`Database error: ${error}`);
      throw new DatabaseError('Failed to find product');
    }
  }

  async createProduct(product: Product): Promise<Product> {
    try {
      const createdProduct: PrismaProduct =
        await this.prismaClient.product.create({
          data: {
            name: product.getName(),
            price: new Prisma.Decimal(product.getPrice()),
            description: product.getDescription(),
            pictures: product.getPictures(),
            categoryId: product.getCategoryId(),
          },
        });

      return new Product(
        createdProduct.id,
        createdProduct.createdAt,
        createdProduct.updatedAt,
        createdProduct.name,
        new Decimal(product.getPrice()).toNumber(),
        createdProduct.description,
        createdProduct.pictures,
        createdProduct.categoryId,
      );
    } catch (error) {
      console.log(`Database error: ${error}`);
      throw new DatabaseError('Failed to save product');
    }
  }

  async deleteProduct(id: number): Promise<void> {
    try {
      await this.prismaClient.product.delete({ where: { id } });
    } catch (error) {
      console.log(`Database error: ${error}`);
      throw new DatabaseError('Failed to delete product');
    }
  }

  async findAllStocks(): Promise<Stock[]> {
    try {
      const stocks: PrismaStock[] = await this.prismaClient.stock.findMany();

      return stocks.map(
        (stock) =>
          new Stock(
            stock.id,
            stock.createdAt,
            stock.updatedAt,
            stock.productId,
            stock.quantity,
          ),
      );
    } catch (error) {
      console.log(`Database error: ${error}`);
      throw new DatabaseError('Failed to find stocks');
    }
  }

  async findStockByProductId(productId: number): Promise<Stock | null> {
    try {
      const stock: PrismaStock = await this.prismaClient.stock.findUnique({
        where: { productId: productId },
      });

      if (!stock) return null;

      return new Stock(
        stock.id,
        stock.createdAt,
        stock.updatedAt,
        stock.productId,
        stock.quantity,
      );
    } catch (error) {
      console.log(`Database error: ${error}`);
      throw new DatabaseError('Failed to find stock');
    }
  }

  async createStock(stock: Stock): Promise<Stock> {
    try {
      const createdStock: PrismaStock = await this.prismaClient.stock.create({
        data: {
          productId: stock.getProductId(),
          quantity: stock.getQuantity(),
        },
      });

      return new Stock(
        createdStock.id,
        createdStock.createdAt,
        createdStock.updatedAt,
        createdStock.productId,
        createdStock.quantity,
      );
    } catch (error) {
      console.log(`Database error: ${error}`);
      throw new DatabaseError('Failed to save stock');
    }
  }

  async updateStockQuantityByProductId(
    productId: number,
    quantity: number,
  ): Promise<Stock> {
    try {
      const updatedStock: PrismaStock = await this.prismaClient.stock.update({
        where: {
          productId: productId,
        },
        data: {
          quantity: quantity,
        },
      });

      if (!updatedStock) return null;

      return new Stock(
        updatedStock.id,
        updatedStock.createdAt,
        updatedStock.updatedAt,
        updatedStock.productId,
        updatedStock.quantity,
      );
    } catch (error) {
      console.log(`Database error: ${error}`);
      throw new DatabaseError('Failed to update stock');
    }
  }
}
