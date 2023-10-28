import app from './index';
import { TokensDB } from './databases/Auth';
import { initializeDataBase } from './databases/DataBase/initialization';

// Starting redis client for Auth Data Base
// AuthDB docker container must be already running
(async () => {
  try {
    await initializeDataBase();
  } catch (error) {
    console.log(`Data Base error. ${error}`);
  }

  TokensDB.on('error', (error: unknown) => {
    throw error;
  });
  try {
    await TokensDB.connect();
  } catch (error) {
    console.log('Redis TokensDB', error);
  }

  const PORT: number = Number(process.env.PORT) || 3000;

  // Staring server
  app.listen(PORT, () => {
    console.log(`API listening port ${PORT}...`);
  });
})();
