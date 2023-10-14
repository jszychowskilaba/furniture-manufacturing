import express from 'express';
import 'dotenv/config';
import v1AuthRouter from './v1/routes/authRoutes';
import v1InventoryRouter from './v1/routes/inventoryRoutes';
import authenticateUser from './middlewares/authenticateUser/authenticateUser';

// Creating app
const app = express();

// Adding middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Handling routes
app.use('/api/v1/auth', v1AuthRouter);
app.use('/api/v1/inventory', authenticateUser, v1InventoryRouter);

// For testing middleware
app.use('/secret-area', authenticateUser, (req, res) => {
  res.status(200).json('I am inside the secret area');
});

export default app;
