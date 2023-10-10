/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import v1AuthRouter from './v1/routes/authRoutes';
import 'dotenv/config';
import { TokensDB } from './databases/Auth';
import authenticateUser from './middlewares/authenticateUser';

// Starting redis client for Auth Data Base
// AuthDB docker container must be already running
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

// Creating app
const app: Application = express();

// Adding middlewares
app.use(bodyParser.json());

// Hadnling routes
app.use('/api/v1/auth', v1AuthRouter);
// For testing middleware
app.use('/secret-area', authenticateUser, (req, res) => {
  res.status(200).json('I am inside the secret area');
});

export default app;
