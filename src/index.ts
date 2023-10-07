/* eslint-disable import/no-extraneous-dependencies */
import express, { Application } from 'express';
import bodyParser from 'body-parser';
import v1AuthRouter from './v1/routes/authRoutes';
import 'dotenv/config';

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;

app.use(bodyParser.json());
app.use('/api/v1/auth', v1AuthRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening port ${PORT}...`);
});

export default app;
