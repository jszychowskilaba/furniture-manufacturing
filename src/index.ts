import express from 'express';
import v1AuthRouter from './v1/routes/authRoutes';
import 'dotenv/config';
import authenticateUser from './middlewares/authenticateUser';

// Creating app
const app = express();

// Adding middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Handling routes
app.use('/api/v1/auth', v1AuthRouter);
// For testing middleware
app.use('/secret-area', authenticateUser, (req, res) => {
  res.status(200).json('I am inside the secret area');
});

export default app;
