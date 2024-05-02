// src/server.ts
import { app } from './app';
import { config } from './shared/config';

app.listen(config.port, () =>
  console.log(`Todo app listening at http://localhost:${config.port}`)
);
