import express from 'express';
import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';
import { errorMiddleware } from './shared/infrastructure/middleware/error.middleware.';
import { loggerMiddleware } from './shared/infrastructure/middleware/logger.middleware';
import { notFoundMiddleware } from './shared/infrastructure/middleware/not-found.middleware';
import { RegisterRoutes } from './routes';
import swaggerJson from './swagger.json';
import logger from './shared/infrastructure/utils/logger';
import helmet from 'helmet';

const app = express();

app.use(loggerMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
try {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));
} catch (err) {
  logger.error('Unable to read swagger.json', err);
}

RegisterRoutes(app);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
