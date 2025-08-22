import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateCustomerDto } from 'src/modules/customer/customer.dto';

describe('CustomerController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/customers (POST)', () => {
    const uniqueEmail = `customer-${Date.now()}@example.com`;
    const createCustomerDto: CreateCustomerDto = {
      name: 'Test Customer',
      email: uniqueEmail,
    };

    return request(app.getHttpServer())
      .post('/customers')
      .send(createCustomerDto)
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name', 'Test Customer');
        expect(res.body).toHaveProperty('email', uniqueEmail);
      });
  });

  it('/customers (GET)', async () => {
    const uniqueEmail = `another-${Date.now()}@example.com`;
    const createCustomerDto: CreateCustomerDto = {
      name: 'Another Customer',
      email: uniqueEmail,
    };

    await request(app.getHttpServer())
      .post('/customers')
      .send(createCustomerDto)
      .expect(201);

    return request(app.getHttpServer())
      .get('/customers')
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('name');
        expect(res.body[0]).toHaveProperty('email');
      });
  });
});
