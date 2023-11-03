/* eslint-disable @typescript-eslint/no-explicit-any */
import { startServer } from './helpers/startServer';
import { generateRandomId } from './helpers/generateRandomId';
import request from 'supertest';
import app from '../../app';

beforeAll(async () => {
  console.log = jest.fn();
  await startServer();
});

const req = request(app);

describe('Testing userRoutes', () => {
  const authTokens = { access_token: null, refresh_token: null };
  const user1: any = {
    username: generateRandomId(),
    email: generateRandomId(),
    password: 'secret',
    name: 'John',
    lastName: 'Doe',
    role: 'sales',
  };

  test('Expect to login into the app', async () => {
    const res = await req
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('client_id=admin&client_secret=admin')
      .expect(201);

    authTokens.access_token = res.body.access_token;
    authTokens.refresh_token = res.body.refresh_token;
  });

  test('Expect POST: /api/v1/user to create a user', async () => {
    const res = await req
      .post('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(user1)
      .expect(201);

    delete user1.password;

    Object.keys(user1).forEach((key) => {
      expect(expect(res.body[key]).toBe(user1[key]));
    });
  });

  test('Expect GET: /api/v1/${user} to return a user', async () => {
    const res = await req
      .get(`/api/v1/user/${user1.username}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(user1)
      .expect(200);

    Object.keys(user1).forEach((key) => {
      expect(expect(res.body[key]).toBe(user1[key]));
    });
  });

  test('Expect PATCH :/api/v1/${user} to update the user', async () => {
    const patchUser: any = {
      name: 'Bob',
      lastName: 'Simpson',
      role: 'projectManager',
    };

    const res = await req
      .get(`/api/v1/user/${user1.username}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(patchUser)
      .expect(200);

    Object.keys(patchUser).forEach((key) => {
      expect(expect(res.body[key]).toBe(user1[key]));
    });
  });

  test('Expect GET: /api/v1/inventory/ to return all inventory', async () => {
    // Adding extra user
    const user2: any = {
      username: generateRandomId(),
      email: generateRandomId(),
      password: 'secretPassword',
      name: 'Jose',
      lastName: 'Szy',
      role: 'productionManager',
    };

    await req
      .post('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(user2)
      .expect(201);

    const res = await req
      .get('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .expect(200);

    for (const user of res.body) {
      Object.keys(user1).forEach((key) => expect(user[key]).not.toBeNull());
    }
  });
});
