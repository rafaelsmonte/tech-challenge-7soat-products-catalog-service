import { ProductDetail } from '../types/product-detail.type';
import { Stock } from '../entities/stock.entity';

export const StockAdapter = {
  adaptArrayJson: (productsDetail: ProductDetail[]): string => {
    const mappedProducts = productsDetail.map((productDetail) => {
      return {
        id: productDetail.product.getId(),
        createdAt: productDetail.product.getCreatedAt(),
        updatedAt: productDetail.product.getUpdatedAt(),
        name: productDetail.product.getName(),
        price: productDetail.product.getPrice(),
        description: productDetail.product.getDescription(),
        pictures: productDetail.product.getPictures(),
        quantity: productDetail.stock.getQuantity(),
        category: {
          id: productDetail.category.getId(),
          createdAt: productDetail.category.getCreatedAt(),
          updatedAt: productDetail.category.getUpdatedAt(),
          type: productDetail.category.getType(),
        },
      };
    });

    return JSON.stringify(mappedProducts);
  },

  adaptJson: (stock: Stock | null): string => {
    if (!stock) return JSON.stringify({});

    const mappedStock = {
      id: stock.getId(),
      createdAt: stock.getCreatedAt(),
      updatedAt: stock.getUpdatedAt(),
      productId: stock.getProductId(),
      quantity: stock.getQuantity(),
    };

    return JSON.stringify(mappedStock);
  },
};
