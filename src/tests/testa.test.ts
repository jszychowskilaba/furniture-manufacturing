/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import app from '../index';
import { TokensDB } from '../databases/Auth';

beforeAll(async () => {
  TokensDB.on('error', (error: unknown) => {
    throw error;
  });
  try {
    await TokensDB.connect();
  } catch (error) {
    console.log('Redis TokensDB', error);
  }
});

afterAll(async () => {
  await TokensDB.quit();
});

describe('Sample Test', () => {
  test('should test that true === true', async () => {
    const response = await request(app).get('/secret-area').set('Authorization', 'b246784f-a45e-4c81-a379-1695da6468bc');
    console.log(response.body);
  });
});
