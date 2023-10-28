import { createDB } from './createDB';
import { createPublicSchema } from './createPublicSchema';

/**
 * Initialize the database.
 */
const initializeDataBase = async (): Promise<void> => {
  await createDB();
  await createPublicSchema();
};

export {initializeDataBase};
