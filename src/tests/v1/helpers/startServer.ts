import { initializeDataBase } from '../../../databases/DataBase/initialization';
import { TokensDB } from '../../../databases/Auth/Auth';
import app from '../../../app';

export const startServer = async () => {
  let errorFlag = false;

  try {
    await initializeDataBase();
  } catch (error) {
    console.log(`Data Base error. ${error}`);
    errorFlag = true;
  }

  TokensDB.on('error', (error: unknown) => {
    throw error;
  });

  try {
    await TokensDB.connect();
  } catch (error) {
    console.log('Redis TokensDB', error);
    errorFlag = true;
  }

  if (errorFlag) {
    console.log('Something went wrong. Can not start app.');
  } else {
    // Staring server
    const PORT: number = Number(process.env.PORT) || 3000;

    app.listen(PORT, () => {
      console.log(`API listening port ${PORT}...`);
    });
  }
};
