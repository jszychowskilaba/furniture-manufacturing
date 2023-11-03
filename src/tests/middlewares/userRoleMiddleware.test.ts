import { startServer } from '../v1/helpers/startServer';
import request from 'supertest';
import app from '../../app';
import { generateRandomId } from '../v1/helpers/generateRandomId';

beforeAll(async () => {
  console.log = jest.fn();
  await startServer();
});

const req = request(app);

describe('Testing userRole middleware: ', () => {
  const authTokens = { access_token: null, refresh_token: null };
  const salesUser = {
    username: generateRandomId(),
    email: generateRandomId(),
    password: 'sales',
    name: 'sales',
    lastName: 'sales',
    role: 'sales',
  };

  const productionManagerUser = {
    username: generateRandomId(),
    email: generateRandomId(),
    password: 'productionManager',
    name: 'productionManager',
    lastName: 'productionManager',
    role: 'productionManager',
  };

  const inventoryAdministratorUser = {
    username: generateRandomId(),
    email: generateRandomId(),
    password: 'inventoryAdministrator',
    name: 'inventoryAdministrator',
    lastName: 'inventoryAdministrator',
    role: 'inventoryAdministrator',
  };

  test('Expect POST: /api/v1/auth/login to return tokens', async () => {
    const res = await req
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send('client_id=admin&client_secret=admin')
      .expect(201);

    authTokens.access_token = res.body.access_token;
    authTokens.refresh_token = res.body.refresh_token;
  });

  test('Expect users to be created', async () => {
    await req
      .post('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(salesUser)
      .expect(201);

    await req
      .post('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(productionManagerUser)
      .expect(201);

    await req
      .post('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(inventoryAdministratorUser)
      .expect(201);
  });

  test('Expect sales to create a order and throw forbidden in restricted areas', async () => {
    const res = await req
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(
        `client_id=${salesUser.username}&client_secret=${salesUser.password}`
      )
      .expect(201);

    const authTokens = { ...res.body };

    await req
      .post('/api/v1/inventory')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send()
      .expect(403);

    await req
      .post('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send()
      .expect(403);

    await req
      .post('/api/v1/orders')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send()
      .expect(400);
  });

  test('Expect inventoryAdministrator to create material and throw forbidden in restricted areas', async () => {
    const res = await req
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(
        `client_id=${inventoryAdministratorUser.username}&client_secret=${inventoryAdministratorUser.password}`
      )
      .expect(201);

    const authTokens = { ...res.body };

    await req
      .post('/api/v1/orders')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send()
      .expect(403);

    await req
      .post('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send()
      .expect(403);

    await req
      .post('/api/v1/inventory')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send()
      .expect(400);
  });

  test('Expect productionManager to have crate labor and throw forbidden in restricted areas', async () => {
    const res = await req
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send(
        `client_id=${productionManagerUser.username}&client_secret=${productionManagerUser.password}`
      )
      .expect(201);

    const authTokens = { ...res.body };

    await req
      .post('/api/v1/inventory')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send()
      .expect(403);

    await req
      .post('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send()
      .expect(403);

    await req
      .post('/api/v1/labor')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send()
      .expect(400);
  });
});
