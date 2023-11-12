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
  let createdLabor1Id: any;

  const labor1: any = {
    status: 'active',
    internalCode: generateRandomId(),
    description: 'Cutting board for hardwood table top',
    pricePerUnit: 1,
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

  test('Expect POST: /api/v1/labor to create a labor', async () => {
    const res = await req
      .post('/api/v1/labor')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(labor1)
      .expect(201);

    // Checking that all values are the same
    Object.keys(labor1).forEach((key) =>
      expect(res.body[key]).toBe(labor1[key])
    );
    createdLabor1Id = res.body.id;
  });

  test('Expect GET: /api/v1/labor/${laborId} to return the labor', async () => {
    const res = await req
      .get(`/api/v1/labor/${createdLabor1Id}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .expect(200);

    // Checking that all values are the same
    Object.keys(labor1).forEach((key) =>
      expect(res.body[key]).toBe(labor1[key])
    );
  });

  test('Expect GET: /api/v1/labor/ to return all labors', async () => {
    // Adding extra labor
    const labor2: any = {
      status: 'inactive',
      internalCode: generateRandomId(),
      description: 'Cutting foam',
      pricePerUnit: 5,
      timePerUnit: 2,
      unit: 'm',
      internalNotes: 'Maximum saw speed: 3',
    };

    await req
      .post('/api/v1/labor')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(labor2);

    const res = await req
      .get(`/api/v1/labor/`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .expect(200);

    for (const labor of res.body) {
      Object.keys(labor1).forEach((key) => expect(labor[key]).not.toBeNull());
    }
  });

  test('Expect PATCH: /v1/labor/{laborID} to update the labor', async () => {
    const patchLabor: any = {
      status: 'inactive',
      internalCode: generateRandomId(),
      description: 'updatedDescription',
      pricePerUnit: 0,
      timePerUnit: 0,
      unit: 'kg',
      internalNotes: 'Maximum saw speed: 4',
    };

    const res = await req
      .patch(`/api/v1/labor/${createdLabor1Id}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(patchLabor)
      .expect(200);

    Object.keys(patchLabor).forEach((key) =>
      expect(res.body[key]).toBe(patchLabor[key])
    );
  });

  test('Expect POST: /api/v1/labor res status to be 409 if labor already exists', async () => {
    await req
      .post('/api/v1/labor')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(labor1)
      .expect(201);

    await req
      .post('/api/v1/labor')
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(labor1)
      .expect(409);
  });

  test('Expect GET: /api/v1/labor/${laborId} to rest status 404 if labor not exists', async () => {
    await req
      .get(`/api/v1/labor/${generateRandomId()}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .expect(404);
  });

  test('Expect UPDATE: /api/v1/labor/${laborId} to rest status 404 if labor not exists', async () => {
    const update = { status: 'active' };
    await req
      .patch(`/api/v1/labor/${generateRandomId()}`)
      .set('Content-Type', 'application/json')
      .set('authorization', `${authTokens.access_token}`)
      .send(update)
      .expect(404);
  });
});
