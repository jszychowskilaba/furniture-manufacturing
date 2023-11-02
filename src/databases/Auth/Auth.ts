import { createClient } from 'redis';
import { config } from '../../config/Auth';
// Create redis TokensDB client
export const TokensDB = createClient({
  url: config.url,
});
