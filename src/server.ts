import app from './index';
import { TokensDB } from './databases/Auth';

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

const PORT: number = Number(process.env.PORT) || 3000;

// Staring server
app.listen(PORT, () => {
  console.log(`API listening port ${PORT}...`);
});
