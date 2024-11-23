import { ProductsCatalogApp } from './app';
import { PrismaDatabase } from './external/prisma-database.external';

const database = new PrismaDatabase();

const app = new ProductsCatalogApp(database);

app.start();
