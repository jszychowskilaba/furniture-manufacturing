import { startServer } from './helpers/startServer';
import request from 'supertest';
import app from '../../app';

beforeAll(async () => {
  console.log = jest.fn();
  await startServer();
});

const req = request(app);

//
describe('Testing authenticateUser middleware', () => {
  const authTokens = { access_token: null, refresh_token: null };

  test('Expect to login into the app', async () => {
    const res = await req
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('client_id=admin&client_secret=admin')
      .expect(201);

    authTokens.access_token = res.body.access_token;
    authTokens.refresh_token = res.body.refresh_token;
  });

  test('Expect authentication error when accessing with invalid token', async () => {
    await req
      .get('/api/v1/inventory')
      .set('Content-Type', 'application/json')
      .set('authorization', `invalid token`)
      .expect(401);
  });

  test('Do not expect authentication error when accessing with valid token', async () => {
    await req
      .get('/api/v1/inventory')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .expect(200);
  });
});
