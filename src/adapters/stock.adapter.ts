import { Stock } from '../entities/stock.entity';

export const StockAdapter = {
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
