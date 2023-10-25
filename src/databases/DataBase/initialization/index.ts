import { createDB } from './createDB';
import { createPublicSchema } from './createPublicSchema';

/**
 * Initialize the database.
 */
const initializeDB = async (): Promise<void> => {
  await createDB();
  await createPublicSchema();
};

initializeDB();
