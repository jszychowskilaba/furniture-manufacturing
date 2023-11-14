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

  test('Expect GET: /api/v1/user/ to return all users', async () => {
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

  test('Expect PATCH: /api/v1/user to update user', async () => {
    const user1: any = {
      username: generateRandomId(),
      email: generateRandomId(),
      password: 'secret',
      name: 'John',
      lastName: 'Doe',
      role: 'sales',
    };

    const update = {
      email: generateRandomId(),
      lastName: generateRandomId(),
    };

    await req
      .post('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(user1)
      .expect(201);

    const res = await req
      .patch(`/api/v1/user/${user1.username}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(update)
      .expect(200);

    expect(res.body).toMatchObject(update);
  });

  test('Expect POST: /api/v1/user to res status 409 if user exists', async () => {
    const user1: any = {
      username: generateRandomId(),
      email: generateRandomId(),
      password: 'secret',
      name: 'John',
      lastName: 'Doe',
      role: 'sales',
    };

    await req
      .post('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(user1)
      .expect(201);

    await req
      .post('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(user1)
      .expect(409);
  });

  test('Expect GET: /api/v1/${user} to rest status 404 if user not exists', async () => {
    await req
      .get(`/api/v1/user/${generateRandomId()}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(user1)
      .expect(404);
  });

  test('Expect GET: /api/v1/user?pages=2 to return 2 users', async () => {
    const numberOfPages = 2;

    const res = await req
      .get(`/api/v1/user?pages=${numberOfPages}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .expect(200);

    expect(res.body.length).toBe(numberOfPages);
  });

  test('Expect PATCH: /api/v1/user to update user password and to be able to login', async () => {
    const update = {
      password: 'newPassword',
    };

    await req
      .patch(`/api/v1/user/${user1.username}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(update)
      .expect(200);

    await req
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(`client_id=${user1.username}&client_secret=${update.password}`)
      .expect(201);
  });
});
