import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateCustomerDto } from 'src/modules/customer/customer.dto';
import { CreateTransactionDto } from 'src/modules/transaction/transaction.dto';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;
  let customerId: string;
  let walletId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Create a customer and get their wallet ID
    const uniqueCustomerEmail = `transaction-customer-${Date.now()}@example.com`;
    const createCustomerDto: CreateCustomerDto = {
      name: 'Transaction Test Customer',
      email: uniqueCustomerEmail,
    };

    const customerRes = await request(app.getHttpServer())
      .post('/customers')
      .send(createCustomerDto)
      .expect(201);

      expect(customerRes.body).toHaveProperty('id');
      expect(customerRes.body).toHaveProperty('wallet');
      expect(customerRes.body.wallet.balance).toBe('0.000');
  });

  afterEach(async () => {
    await app.close();
  });

  it('/transactions (POST)', () => {
    const createTransactionDto: CreateTransactionDto = {
      amount: "100",
    };

    return request(app.getHttpServer())
      .post('/transactions')
      .send(createTransactionDto)
      .expect(201)
      .then((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('amount', 100);
        expect(res.body).toHaveProperty('type', TransactionType.CREDIT);
      });
  });

  it('/transactions (GET)', async () => {
    // Create a transaction first
    const createTransactionDto: CreateTransactionDto = {
      amount: "50",
    };

    await request(app.getHttpServer())
      .post('/transactions')
      .send(createTransactionDto)
      .expect(201);

    return request(app.getHttpServer())
      .get('/transactions')
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('amount');
        expect(res.body[0]).toHaveProperty('type');
      });
  });
});
