/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import v1AuthRouter from './v1/routes/authRoutes';
import 'dotenv/config';
import { TokensDB } from './databases/Auth';
import authenticateUser from './middlewares/authenticateUser';

// Starting redis client for auth tokens database
// TokensDB docker must be already executed
(async () => {
  TokensDB.on('error', (error: unknown) => {
    throw error;
  });
  try {
    await TokensDB.connect();
  } catch (error) {
    console.log('Redis TokensDB', error);
  }
})();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(bodyParser.json());

app.use('/api/v1/auth', v1AuthRouter);

// For testing middleware
app.use('/secret-area', authenticateUser, (req, res) => {
  res.status(200).send('I am inside the secret area');
});

app.listen(PORT, () => {
  console.log(`API listening port ${PORT}...`);
});

export default app;
