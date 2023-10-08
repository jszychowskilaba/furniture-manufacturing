import { createClient } from 'redis';

const TokensDB = createClient({ url: 'redis://localhost:6379' });

export default TokensDB;
