import { initializeDataBase } from '../../../databases/DataBase/initialization';
import { TokensDB } from '../../../databases/Auth/Auth';

export const startServer = async () => {
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
};
