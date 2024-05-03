import * as dotenv from 'dotenv';

dotenv.config();

enum NodeEnv {
  TEST = 'test',
  DEV = 'development',
}

interface Env {
  env: NodeEnv;
  dbFilename: string;
  dbTestFilename: string;
  port: number;
  accessTokenSecret: string;
  accessTokenLifetime: string;
}

export const config: Env = {
  env: (process.env.NODE_ENV as NodeEnv) || NodeEnv.DEV,
  dbFilename: process.env.DB_FILENAME || 'db.sqlite3',
  dbTestFilename: process.env.DB_TEST_FILENAME || 'db.test.sqlite3',
  port: Number(process.env.APP_PORT) || 3000,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET || 'secret',
  accessTokenLifetime: process.env.ACCESS || '2h',
};
