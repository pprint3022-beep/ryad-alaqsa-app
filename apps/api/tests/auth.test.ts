import request from 'supertest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../src/index';

describe('API foundation', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health reports status without requiring the database', async () => {
    const response = await request(app.server).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      status: 'ok',
      database: expect.stringMatching(/^(connected|disconnected)$/),
    });
    expect(typeof response.body.redis.enabled).toBe('boolean');
    expect(typeof response.body.uptime).toBe('number');
    expect(typeof response.body.version).toBe('string');
  });

  it('GET /api/version reports the API version', async () => {
    const response = await request(app.server).get('/api/version');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ ok: true });
    expect(typeof response.body.version).toBe('string');
  });

  it('POST /api/auth/login returns 400 for a missing portal', async () => {
    const response = await request(app.server)
      .post('/api/auth/login')
      .send({ login: 'director@ryad.ma', password: 'secret' });

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      ok: false,
      error: 'validation_error',
    });
  });

  it('POST /api/auth/login returns 400 for an empty body', async () => {
    const response = await request(app.server)
      .post('/api/auth/login')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      ok: false,
      error: 'validation_error',
    });
  });

  it('GET /api/auth/me returns 401 without a bearer token', async () => {
    const response = await request(app.server).get('/api/auth/me');

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      ok: false,
      error: 'unauthorized',
    });
  });

  it('returns a JSON 404 for unknown routes', async () => {
    const response = await request(app.server).get('/api/does-not-exist');

    expect(response.status).toBe(404);
    expect(response.body).toMatchObject({
      ok: false,
      error: 'not_found',
    });
  });
});

/**
 * These tests touch PostgreSQL. Enable them explicitly with:
 *   RUN_DB_TESTS=1 pnpm --filter api test
 * (PowerShell: $env:RUN_DB_TESTS='1'; pnpm --filter api test)
 */
const describeDb = process.env.RUN_DB_TESTS === '1' ? describe : describe.skip;

describeDb('auth with a database', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/auth/login rejects unknown credentials', async () => {
    const response = await request(app.server)
      .post('/api/auth/login')
      .send({
        login: 'nobody@example.invalid',
        password: 'not-the-password',
        portal: 'admin_portal',
      });

    expect(response.status).toBe(401);
    expect(response.body).toMatchObject({
      ok: false,
      error: 'invalid_credentials',
    });
  });
});
