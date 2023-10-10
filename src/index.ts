/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import v1AuthRouter from './v1/routes/authRoutes';
import 'dotenv/config';
import authenticateUser from './middlewares/authenticateUser';

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
