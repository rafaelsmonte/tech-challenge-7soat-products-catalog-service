import { ProductDetail } from '../types/product-detail.type';

export const ProductAdapter = {
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

  adaptJson: (productDetail: ProductDetail | null): string => {
    if (!productDetail) return JSON.stringify({});

    const mappedProduct = {
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

    return JSON.stringify(mappedProduct);
  },
};
