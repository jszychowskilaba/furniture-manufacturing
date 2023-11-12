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

describe('Testing authRoutes', () => {
  const authTokens = { access_token: null, refresh_token: null };
  let createdMaterial1Id: any;

  const material1: any = {
    status: 'active',
    internalCode: generateRandomId(), // to avoid unique column
    description: 'Iron 3/8 nail for enforced wood',
    stock: 1000,
    reservedStock: 0,
    pricePerUnit: 2,
    unit: 'kg',
    purchaseTime: 4,
    internalNotes: 'used for making union of different parts',
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

  test('Expect POST: /api/v1/inventory to create a material', async () => {
    const res = await req
      .post('/api/v1/inventory')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(material1)
      .expect(201);

    // Checking that all values are the same
    Object.keys(material1).forEach((key) =>
      expect(res.body[key]).toBe(material1[key])
    );
    createdMaterial1Id = res.body.id;
  });

  test('Expect GET: /api/v1/inventory/${materialId} to return the material', async () => {
    const res = await req
      .get(`/api/v1/inventory/${createdMaterial1Id}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .expect(200);

    // Checking that all values are the same
    Object.keys(material1).forEach((key) =>
      expect(res.body[key]).toBe(material1[key])
    );
  });

  test('Expect GET: /api/v1/inventory/ to return all inventory', async () => {
    // Adding extra material
    const material2: any = {
      status: 'active',
      internalCode: generateRandomId(), // to avoid unique column
      description: 'Iron 3/8 nail for enforced wood',
      stock: 10,
      reservedStock: 9,
      pricePerUnit: 4,
      unit: 'm',
      purchaseTime: 1,
      internalNotes: 'note',
    };

    await req
      .post('/api/v1/inventory')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(material2);

    const res = await req
      .get(`/api/v1/inventory/`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .expect(200);

    for (const material of res.body) {
      Object.keys(material1).forEach((key) =>
        expect(material[key]).not.toBeNull()
      );
    }
  });

  test('Expect PATCH: /v1/inventory/{materialID} to update the material', async () => {
    const patchMaterial: any = {
      status: 'inactive',
      internalCode: generateRandomId(), // to avoid unique column
      description: 'newDescription',
      stock: 0,
      reservedStock: 0,
      pricePerUnit: 0,
      unit: 'r',
      purchaseTime: 0,
      internalNotes: 'newNote',
    };

    const res = await req
      .patch(`/api/v1/inventory/${createdMaterial1Id}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(patchMaterial)
      .expect(200);

    Object.keys(patchMaterial).forEach((key) =>
      expect(res.body[key]).toBe(patchMaterial[key])
    );
  });

  test('Expect POST: /api/v1/inventory to res with status 409 when creating equal materials', async () => {
    await req
      .post('/api/v1/inventory')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(material1)
      .expect(201);

    await req
      .post('/api/v1/inventory')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(material1)
      .expect(409);
  });

  test('Expect GET: /api/v1/inventory/noExistent to return 404 if material do not exists', async () => {
    const randomName = generateRandomId();
    await req
      .get(`/api/v1/inventory/${randomName}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .expect(404);
  });

  test('Expect PATCH: /api/v1/inventory/noExistent to return 404 if material do not exists', async () => {
    const randomName = generateRandomId();
    const update = {status: "active"}

    await req
      .patch(`/api/v1/inventory/${randomName}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(update)
      .expect(404);
  });
});
