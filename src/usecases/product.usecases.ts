import { ProductDetail } from '../types/product-detail.type';
import { Product } from '../entities/product.entity';
import { CategoryNotFoundError } from '../errors/category-not-found.error';
import { ProductNotFoundError } from '../errors/product-not-found.error';
import { ICategoryGateway } from '../interfaces/category.gateway.interface';
import { IProductGateway } from '../interfaces/product.gateway.interface';
import { IStockGateway } from '../interfaces/stock.gateway.interface';
import { StockNotFoundError } from '../errors/stock-not-found.error';
import { Stock } from '../entities/stock.entity';

export class ProductUseCases {
  static async findAll(
    productGateway: IProductGateway,
    categoryGateway: ICategoryGateway,
    stockGateway: IStockGateway,
  ): Promise<ProductDetail[]> {
    let productsDetail: ProductDetail[] = [];

    const products = await productGateway.findAll();

    for (const product of products) {
      const category = await categoryGateway.findById(product.getCategoryId());

      if (!category) throw new CategoryNotFoundError('Category not found');

      const stock = await stockGateway.findByProductId(product.getId());

      if (!stock) throw new StockNotFoundError('Stock not found');

      const productDetail: ProductDetail = { product, category, stock };

      productsDetail.push(productDetail);
    }

    return productsDetail;
  }

  static async findById(
    productGateway: IProductGateway,
    categoryGateway: ICategoryGateway,
    stockGateway: IStockGateway,
    id: number,
  ): Promise<ProductDetail> {
    const product = await productGateway.findById(id);

    if (!product) throw new ProductNotFoundError('Product not found');

    const category = await categoryGateway.findById(product.getCategoryId());

    if (!category) throw new CategoryNotFoundError('Category not found');

    const stock = await stockGateway.findByProductId(product.getId());

    if (!stock) throw new StockNotFoundError('Stock not found');

    return { product, category, stock };
  }

  static async create(
    productGateway: IProductGateway,
    categoryGateway: ICategoryGateway,
    stockGateway: IStockGateway,
    name: string,
    price: number,
    description: string,
    pictures: string[],
    categoryId: number,
    stockQuantity: number,
  ): Promise<ProductDetail> {
    const category = await categoryGateway.findById(categoryId);

    if (!category) throw new CategoryNotFoundError('Category not found');

    const newProduct = await productGateway.create(
      Product.new(name, price, description, pictures, categoryId),
    );

    const newStock = await stockGateway.create(
      Stock.new(newProduct.getId(), stockQuantity),
    );

    return { product: newProduct, category: category, stock: newStock };
  }

  static async delete(
    productGateway: IProductGateway,
    id: number,
  ): Promise<void> {
    const product = await productGateway.findById(id);

    if (!product) throw new ProductNotFoundError('Product not found');

    await productGateway.delete(id);
  }
}
