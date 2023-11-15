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

describe('Testing orderRoutes', () => {
  const authTokens = { access_token: null, refresh_token: null };

  let manufactureOrder: any = {};
  let createdManufactureOrder: any = {};
  let createdMaterial1: any = {};
  let createdMaterial2: any = {};
  let createdLabor1: any = {};
  let createdLabor2: any = {};

  const material1 = {
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

  const material2 = {
    status: 'active',
    internalCode: generateRandomId(), // to avoid unique column
    description: 'Iron 3/8 nail for enforced wood',
    stock: 500,
    reservedStock: 0,
    pricePerUnit: 1,
    unit: 'm',
    purchaseTime: 10,
    internalNotes: 'used for making union of different parts',
  };

  const labor1 = {
    status: 'active',
    internalCode: generateRandomId(),
    description: 'Cutting board for hardwood table top',
    pricePerUnit: 3,
    timePerUnit: 300,
    unit: 'm',
    internalNotes: 'Maximum saw speed: 3',
  };

  const labor2 = {
    status: 'active',
    internalCode: generateRandomId(),
    description: 'Hardwood joint',
    pricePerUnit: 5,
    timePerUnit: 300,
    unit: 'm',
    internalNotes: 'Maximum saw speed: 3',
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

  test('Expect materials and labors to be created', async () => {
    const mat1 = await req
      .post('/api/v1/inventory')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(material1)
      .expect(201);

    createdMaterial1 = { ...mat1.body };

    const mat2 = await req
      .post('/api/v1/inventory')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(material2)
      .expect(201);

    createdMaterial2 = { ...mat2.body };

    const lab1 = await req
      .post('/api/v1/labor')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(labor1)
      .expect(201);

    createdLabor1 = { ...lab1.body };

    const lab2 = await req
      .post('/api/v1/labor')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(labor2)
      .expect(201);

    createdLabor2 = { ...lab2.body };
  });

  test('Expect POST: /api/v1/order to create a manufacture order', async () => {
    manufactureOrder = {
      status: 'inProduction',
      internalCode: generateRandomId(),
      description: 'Basic wood table for client Bob Doe',
      unitsToManufacture: 3,
      internalNotes: 'See design sent to email @July 23',
      materials: [
        { id: createdMaterial1.id, quantity: 20 },
        { id: createdMaterial2.id, quantity: 10 },
      ],
      labors: [
        { id: createdLabor1.id, quantity: 10 },
        { id: createdLabor2.id, quantity: 20 },
      ],
    };

    const res = await req
      .post('/api/v1/orders')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(manufactureOrder)
      .expect(201);

    createdManufactureOrder = res.body;

    manufactureOrder.totalPrice =
      material1.pricePerUnit * 20 * 3 +
      material2.pricePerUnit * 10 * 3 +
      labor1.pricePerUnit * 10 * 3 +
      labor2.pricePerUnit * 20 * 3;

    manufactureOrder.totalProductionTime =
      labor1.timePerUnit * 10 * 3 + labor2.timePerUnit * 20 * 3;

    delete manufactureOrder.materials;
    delete manufactureOrder.labors;

    Object.keys(manufactureOrder).forEach((key) =>
      expect(createdManufactureOrder[key]).toBe(manufactureOrder[key])
    );
  });

  test('Expect GET: /api/v1/order/${orderId} to get the manufactureOrder', async () => {
    const mo = await req
      .get(`/api/v1/orders/${createdManufactureOrder.id}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .expect(200);

    expect(mo.body).toEqual(createdManufactureOrder);
  });

  test('Expect materials stock and reserved stock to be updated after a order', async () => {
    const res1 = await req
      .get(`/api/v1/inventory/${createdMaterial1.id}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .expect(200);

    expect(res1.body.stock).toBe(material1.stock - 20 * 3);
    expect(res1.body.reservedStock).toBe(material1.reservedStock + 20 * 3);

    const res2 = await req
      .get(`/api/v1/inventory/${createdMaterial2.id}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .expect(200);

    expect(res2.body.stock).toBe(material2.stock - 10 * 3);
    expect(res2.body.reservedStock).toBe(material2.reservedStock + 10 * 3);
  });

  test('Expect POST: /v1/orders/{orderID}/manufacture to manufacture and update materials', async () => {
    const toManufacture = {
      quantity: 2,
    };

    await req
      .post(`/api/v1/orders/${createdManufactureOrder.id}/manufactureOrder`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(toManufacture)
      .expect(200);

    const res1 = await req
      .get(`/api/v1/inventory/${createdMaterial1.id}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .expect(200);

    expect(res1.body.stock).toBe(material1.stock - 20 * 3);
    expect(res1.body.reservedStock).toBe(20 * 1);

    const res2 = await req
      .get(`/api/v1/inventory/${createdMaterial2.id}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .expect(200);

    expect(res2.body.stock).toBe(material2.stock - 10 * 3);
    expect(res2.body.reservedStock).toBe(10 * 1);
  });

  test('Expect GET: /api/v1/order/ to get all orders', async () => {
    const res = await req
      .get(`/api/v1/orders/`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .expect(200);

    for (const order of res.body) {
      Object.getOwnPropertyNames(createdManufactureOrder).forEach((key) =>
        expect(order[key]).not.toBeNull()
      );
    }
  });

  test('Expect POST: /api/v1/order to res status 422 if order already exists', async () => {
    manufactureOrder = {
      status: 'inProduction',
      internalCode: generateRandomId(),
      description: 'Basic wood table for client Bob Doe',
      unitsToManufacture: 3,
      internalNotes: 'See design sent to email @July 23',
      materials: [
        { id: createdMaterial1.id, quantity: 20 },
        { id: createdMaterial2.id, quantity: 10 },
      ],
      labors: [
        { id: createdLabor1.id, quantity: 10 },
        { id: createdLabor2.id, quantity: 20 },
      ],
    };

    await req
      .post('/api/v1/orders')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(manufactureOrder)
      .expect(201);

    await req
      .post('/api/v1/orders')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(manufactureOrder)
      .expect(422);
  });

  test('Expect GET: /api/v1/order/${orderId} to res 404 if order do not exist', async () => {
    await req
      .get(`/api/v1/orders/${generateRandomId()}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .expect(404);
  });

  test('Expect POST: /v1/orders/{orderID}/manufactureOrder to res status 400 if quantity is negative', async () => {
    const toManufacture = {
      quantity: -1,
    };

    await req
      .post(`/api/v1/orders/${createdManufactureOrder.id}/manufactureOrder`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(toManufacture)
      .expect(400);
  });

  test('Expect UPDATE: /v1/orders/{orderID} to res 403 if order already have manufactured units', async () => {
    const update = {
      internalCode: generateRandomId(),
    };

    const res = await req
      .patch(`/api/v1/orders/${createdManufactureOrder.id}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(update)
      .expect(403);

    expect(res.body.internalCode).toEqual(update.internalCode);
  });

  test('Expect UPDATE: /v1/orders/{orderID} to res status 404 if order do not exist', async () => {
    const update = {
      internalCode: generateRandomId(),
    };

    await req
      .patch(`/api/v1/orders/${generateRandomId()}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(update)
      .expect(404);
  });

  test('Expect GET: /api/v1/orders?pages=2 to return 2 orders', async () => {
    const numberOfPages = 2;

    const res = await req
      .get(`/api/v1/orders?pages=${numberOfPages}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .expect(200);

    expect(res.body.length).toBe(numberOfPages);
  });

  test('Expect POST: /v1/orders/{orderID}/manufactureOrder to res status 403 if exceeding units to manufacture', async () => {
    const toManufacture = {
      quantity: 50,
    };

    await req
      .post(`/api/v1/orders/${createdManufactureOrder.id}/manufactureOrder`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(toManufacture)
      .expect(403);
  });

  test('Expect POST: /v1/orders/ to res status 422 if there are not enough materials', async () => {
    manufactureOrder = {
      status: 'inProduction',
      internalCode: generateRandomId(),
      description: 'Basic wood table for client Bob Doe',
      unitsToManufacture: 3,
      internalNotes: 'See design sent to email @July 23',
      materials: [
        { id: createdMaterial1.id, quantity: 99999 },
        { id: createdMaterial2.id, quantity: 10 },
      ],
      labors: [
        { id: createdLabor1.id, quantity: 10 },
        { id: createdLabor2.id, quantity: 20 },
      ],
    };
    await req
      .post(`/api/v1/orders/`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(manufactureOrder)
      .expect(422);
  });

  test('Expect POST: /v1/orders/{orderId}/manufacture res status 404 if a material do not exist', async () => {
    const manufactureOrder = {
      status: 'inProduction',
      internalCode: generateRandomId(),
      description: 'Basic wood table for client Bob Doe',
      unitsToManufacture: 3,
      internalNotes: 'See design sent to email @July 23',
      materials: [
        { id: generateRandomId(), quantity: 99999 },
        { id: createdMaterial2.id, quantity: 10 },
      ],
      labors: [
        { id: createdLabor1.id, quantity: 10 },
        { id: createdLabor2.id, quantity: 20 },
      ],
    };

    await req
      .post(`/api/v1/orders/`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(manufactureOrder)
      .expect(404);
  });

  test('Expect PATCH: /v1/orders/{orderId} status = "canceled" to return materials', async () => {
    const update = {
      status: 'canceled',
    };

    const res = await req
      .patch(`/api/v1/orders/${createdManufactureOrder.id}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(update)
      .expect(200);

    expect(res.body.materials).toEqual([]);
    expect(res.body.labors).toEqual([]);
  });
});
