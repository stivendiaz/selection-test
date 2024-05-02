// src/app.ts
import swaggerUi from 'swagger-ui-express';
import express, {
  json,
  urlencoded,
  Response as ExResponse,
  Request as ExRequest,
} from 'express';
import { RegisterRoutes } from './routes';

export const app = express();

// Use body parser to read sent json payloads
app.use(
  urlencoded({
    extended: true,
  })
);

app.use('/docs', swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(swaggerUi.generateHTML(await import('../src/swagger.json')));
});
app.use(json());

RegisterRoutes(app);
