import { Request, Response } from 'express';
import promMid from 'express-prometheus-middleware';
import { IDatabase } from '../interfaces/database.interface';
import { DatabaseError } from '../errors/database.error';
import { ProductController } from '../controllers/product.controller';
import { InvalidProductError } from '../errors/invalid-product.error';
import { InvalidCategoryError } from '../errors/invalid-category.error';
import { InvalidStockError } from '../errors/invalid-stock.error';
import { CategoryNotFoundError } from '../errors/category-not-found.error';
import { ProductNotFoundError } from '../errors/product-not-found.error';
import { StockNotFoundError } from '../errors/stock-not-found.error';
import { StockController } from '../controllers/stock.controller';
import { InsufficientStockError } from '../errors/insufficient-stock.error';
import { ProductOutOfStockError } from '../errors/product-out-of-stock.error';
import { ProductWithQuantity } from '../types/product-with-quantity.type';
import { apiKeyMiddleware } from './api-key-auth.middleware';
import { CategoryController } from '../controllers/category.controller';

export class ProductsCatalogApp {
  constructor(private database: IDatabase) {}

  start() {
    const express = require('express');
    const bodyParser = require('body-parser');
    const swaggerUi = require('swagger-ui-express');

    const port = 3000;
    const app = express();

    app.use(bodyParser.json());

    // Metrics
    app.use(
      promMid({
        metricsPath: '/metrics',
        collectDefaultMetrics: true,
        requestDurationBuckets: [0.1, 0.5, 1, 1.5],
        requestLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
        responseLengthBuckets: [512, 1024, 5120, 10240, 51200, 102400],
      }),
    );

    // Swagger
    const options = require('./swagger.json');
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(options));

    // Category endpoints
    app.get('/category', async (request: Request, response: Response) => {
      await CategoryController.findAll(this.database)
        .then((categories) => {
          response
            .setHeader('Content-type', 'application/json')
            .status(200)
            .send(categories);
        })
        .catch((error) => this.handleError(error, response));
    });

    // Product endpoints
    app.get('/product', async (request: Request, response: Response) => {
      await ProductController.findAll(this.database)
        .then((products) => {
          response
            .setHeader('Content-type', 'application/json')
            .status(200)
            .send(products);
        })
        .catch((error) => this.handleError(error, response));
    });

    app.get('/product/:id', async (request: Request, response: Response) => {
      const id = Number(request.params.id);
      await ProductController.findById(this.database, id)
        .then((product) => {
          response
            .setHeader('Content-type', 'application/json')
            .status(200)
            .send(product);
        })
        .catch((error) => this.handleError(error, response));
    });

    app.post('/product', async (request: Request, response: Response) => {
      const { name, price, description, pictures, categoryId, quantity } =
        request.body;
      await ProductController.create(
        this.database,
        name,
        price,
        description,
        pictures,
        categoryId,
        quantity,
      )
        .then((product) => {
          response
            .setHeader('Content-type', 'application/json')
            .status(200)
            .send(product);
        })
        .catch((error) => this.handleError(error, response));
    });

    app.delete('/product/:id', async (request: Request, response: Response) => {
      const id = Number(request.params.id);
      await ProductController.delete(this.database, id)
        .then(() => response.status(204).send())
        .catch((error) => this.handleError(error, response));
    });

    // Stock endpoints
    app.post(
      '/stock/update-quantity',
      async (request: Request, response: Response) => {
        const productId = Number(request.body.productId);
        const quantity = Number(request.body.quantity);

        await StockController.update(this.database, productId, quantity)
          .then((products) => {
            response
              .setHeader('Content-type', 'application/json')
              .status(200)
              .send(products);
          })
          .catch((error) => this.handleError(error, response));
      },
    );

    app.post(
      '/private/stock/reserve',
      apiKeyMiddleware,
      async (request: Request, response: Response) => {
        const productsWithQuantity: ProductWithQuantity[] =
          request.body.productsWithQuantity;

        await StockController.reserve(this.database, productsWithQuantity)
          .then((products) => {
            response
              .setHeader('Content-type', 'application/json')
              .status(200)
              .send(products);
          })
          .catch((error) => this.handleError(error, response));
      },
    );

    app.listen(port, () => {
      console.log(`Tech challenge app listening on port ${port}`);
    });
  }

  handleError(error: Error, response: Response): void {
    if (error instanceof InvalidProductError) {
      response.status(400).json({ message: error.message });
    } else if (error instanceof InvalidCategoryError) {
      response.status(400).json({ message: error.message });
    } else if (error instanceof InvalidStockError) {
      response.status(400).json({ message: error.message });
    } else if (error instanceof ProductNotFoundError) {
      response.status(404).json({ message: error.message });
    } else if (error instanceof CategoryNotFoundError) {
      response.status(404).json({ message: error.message });
    } else if (error instanceof StockNotFoundError) {
      response.status(404).json({ message: error.message });
    } else if (error instanceof InsufficientStockError) {
      response.status(409).json({ message: error.message });
    } else if (error instanceof ProductOutOfStockError) {
      response.status(409).json({ message: error.message });
    } else if (error instanceof DatabaseError) {
      response.status(500).json({ message: error.message });
    } else {
      console.log('An unexpected error has occurred: ' + error);
      response.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
