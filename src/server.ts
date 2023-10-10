import app from './index';

const PORT: number = Number(process.env.PORT) || 3000;

// Staring server
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening port ${PORT}...`);
});
