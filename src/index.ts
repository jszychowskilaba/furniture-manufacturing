/* eslint-disable import/no-extraneous-dependencies */
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import v1AuthRouter from './v1/routes/authRoutes';
import 'dotenv/config';
import { TokensDB } from './databases/Tokens';

// Starting redis client for auth tokens database
// TokensDB docker must be already executed
(async () => {
  TokensDB.on('error', (error: unknown) => {
    // eslint-disable-next-line no-console
    throw error;
  });
  await TokensDB.connect();
})();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(bodyParser.json());
app.use('/api/v1/auth', v1AuthRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening port ${PORT}...`);
});

export default app;
