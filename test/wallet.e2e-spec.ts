import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateCustomerDto } from 'src/modules/customer/customer.dto';

describe('WalletController (e2e)', () => {
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

  it('/wallets (GET)', async () => {
    // Create a customer first to ensure a wallet exists
    const uniqueEmail = `customer-${Date.now()}@example.com`;
    const createCustomerDto: CreateCustomerDto = {
      name: 'Wallet Test Customer',
      email: uniqueEmail,
    };

    await request(app.getHttpServer())
      .post('/customers')
      .send(createCustomerDto)
      .expect(201);

    return request(app.getHttpServer())
      .get('/wallets')
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('balance');
      });
  });
});
