import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateCustomerDto } from 'src/modules/customer/customer.dto';
import { CreateTransactionDto } from 'src/modules/transaction/transaction.dto';
import { TransactionType } from 'src/modules/transaction/transaction.enum';

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

    customerId = customerRes.body.id;

    const walletRes = await request(app.getHttpServer())
      .get('/wallets')
      .expect(200);

    walletId = walletRes.body[0].id; // Assuming the first wallet belongs to the created customer
  });

  afterEach(async () => {
    await app.close();
  });

  it('/transactions (POST)', () => {
    const createTransactionDto: CreateTransactionDto = {
      amount: 100,
      type: TransactionType.CREDIT,
      walletId: walletId,
      customerId: customerId,
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
      amount: 50,
      type: TransactionType.DEBIT,
      walletId: walletId,
      customerId: customerId,
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
