/* eslint-disable import/no-extraneous-dependencies */
import request from 'supertest';
import app from '../index';

const req = request(app);

test('should return login', async () => {
  const res = await req.get('/api/v1/auth/login');
  // eslint-disable-next-line no-console
  console.log(res.body);
});
