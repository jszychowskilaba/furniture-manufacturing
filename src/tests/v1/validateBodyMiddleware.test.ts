/* eslint-disable @typescript-eslint/no-explicit-any */
import { startServer } from './helpers/startServer';
import request from 'supertest';
import app from '../../app';
import { generateRandomId } from './helpers/generateRandomId';

beforeAll(async () => {
  console.log = jest.fn();
  await startServer();
});

const req = request(app);

//
describe('Testing validateBody middleware', () => {
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

  test('Expect POST:/api/v1/inventory to throw bad request', async () => {
    // material with invalid model
    // should have status property
    const invalidMaterial: any = {
      internalCode: new Date().toISOString(), // to avoid unique column
      description: 'Iron 3/8 nail for enforced wood',
      stock: 1000,
      reservedStock: 0,
      pricePerUnit: 2,
      unit: 'kg',
      purchaseTime: 4,
      internalNotes: 'used for making union of different parts',
    };

    await req
      .post('/api/v1/inventory')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(invalidMaterial)
      .expect(400);
  });

  test('Expect POST: /api/v1/labor to throw bad request', async () => {
    // labor with invalid model
    const invalidLabor: any = {
      status: 'inactive',
      internalCode: new Date().toISOString(),
      description: 'Cutting foam',
      pricePerUnit: 5,
      timePerUnit: '2', // should be a number
      unit: 'm',
      internalNotes: 'Maximum saw speed: 3',
    };

    await req
      .post('/api/v1/inventory')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(invalidLabor)
      .expect(400);
  });

  test('Expect POST: /api/v1/user to throw bad request', async () => {
    // user with invalid model
    const invalidUser: any = {
      username: generateRandomId(),
      email: generateRandomId(),
      password: 'secret',
      name: 'John',
      lastName: 'Doe',
      role: 'newRole', // invalid Role
    };

    await req
      .post('/api/v1/user')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(invalidUser)
      .expect(400);
  });
  test('Expect POST: /api/v1/orders to create a user to throw bad request', async () => {
    // user with invalid model
    const invalidManufactureOrder = {
      status: 'inProduction',
      internalCode: generateRandomId(),
      description: 'Basic wood table for client Bob Doe',
      unitsToManufacture: 3,
      internalNotes: 'See design sent to email @July 23',
      materials: [
        { ids: '3', quantity: 20 }, // invalid property, "ids" should be "id"
        { id: '3', quantity: 10 },
      ],
      labors: [
        { id: '34', quantity: 10 },
        { id: '34', quantity: 20 },
      ],
    };

    await req
      .post('/api/v1/orders')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(invalidManufactureOrder)
      .expect(400);
  });
});
