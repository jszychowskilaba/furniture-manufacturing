import { startServer } from './helpers/startServer';
import request from 'supertest';
import app from '../../app';



beforeAll(async () => {
  console.log = jest.fn();
  await startServer();
});

const req = request(app);

describe('Testing authRoutes', () => {
  const authTokens = { access_token: null, refresh_token: null };
  const refreshedAuthTokens = { access_token: null, refresh_token: null };

  test('Expect POST: /api/v1/auth/login to return tokens', async () => {
    const res = await req
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('client_id=admin&client_secret=admin')
      .expect(201);

    authTokens.access_token = res.body.access_token;
    authTokens.refresh_token = res.body.refresh_token;
  });

  test('Expect POST: /api/v1/auth/refresh-tokens to refresh the tokens', async () => {
    const res = await req
      .post('/api/v1/auth/refresh-tokens')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(`refresh_token=${authTokens.refresh_token}`)
      .expect(200);

    refreshedAuthTokens.access_token = res.body.access_token;
    refreshedAuthTokens.refresh_token = res.body.refresh_token;

    expect(refreshedAuthTokens.access_token).not.toBe(authTokens.access_token);
    expect(refreshedAuthTokens.refresh_token).not.toBe(
      authTokens.refresh_token
    );
  });

  test('Expect POST: /api/v1/auth/login to refresh the tokens', async () => {
    const res = await req
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(`client_id=admin&client_secret=admin`)
      .expect(201);

    authTokens.access_token = res.body.access_token;
    authTokens.refresh_token = res.body.refresh_token;

    expect(refreshedAuthTokens.access_token).not.toBe(authTokens.access_token);
    expect(refreshedAuthTokens.refresh_token).not.toBe(
      authTokens.refresh_token
    );
  });

  test('Expect DELETE: /api/v1/auth/logout to delete tokens', async () => {
    const res = await req
      .delete('/api/v1/auth/logout')
      .set('authorization', `${authTokens.access_token}`)
      .expect(204);

    expect(res.body).toEqual({});
  });
});
