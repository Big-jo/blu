
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateCustomerDto } from '../src/modules/customer/customer.dto';
import { MerchantService } from '../src/modules/merchant/merchant.service';
import { MerchantEntity } from '../src/modules/merchant/merchant.entity';
import { CustomerService } from '../src/modules/customer/customer.service';
import { CustomerEntity } from '../src/modules/customer/customer.entity';
import { CreateTransactionDto } from 'src/modules/transaction/transaction.dto';
import { CreateMerchantDto } from 'src/modules/merchant/merchant.dto';

describe('E2E Tests', () => {
  let app: INestApplication;
  let merchant: MerchantEntity;
  let customer: CustomerEntity;
  let apiKey: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const merchantService = moduleFixture.get<MerchantService>(MerchantService);
    merchant = await merchantService.create({
      name: 'Test Merchant',
      email: `test-${Date.now()}@merchant.com`,
    });
    apiKey = merchant.apiKey;

    const customerService = moduleFixture.get<CustomerService>(CustomerService);
    customer = await customerService.create(
      {
        name: 'Test Customer',
        email: `test-${Date.now()}@customer.com`,
      },
      merchant.id,
    );
  });

  afterAll(async () => {
    await app.close();
  });
  
  describe('MerchantController (e2e)', () => {
    it('/merchants (POST)', () => {
      const uniqueEmail = `test-${Date.now()}@merchant.com`;
      const createMerchantDto: CreateMerchantDto = {
        name: 'Test Merchant',
        email: uniqueEmail,
      };
  
      return request(app.getHttpServer())
        .post('/merchants')
        .send(createMerchantDto)
        .expect(201)
        .then((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name', 'Test Merchant');
          expect(res.body).toHaveProperty('email', uniqueEmail);
          expect(res.body).toHaveProperty('apiKey');
        });
    });
  });

  describe('CustomerController (e2e)', () => {
    it('should create a new customer', async () => {
      const uniqueEmail = `test-${Date.now()}@customer.com`;
      const createCustomerDto: CreateCustomerDto = {
        name: 'Test Customer',
        email: uniqueEmail,
      };

      const response = await request(app.getHttpServer())
        .post('/customers')
        .set('x-api-key', apiKey)
        .send(createCustomerDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toEqual(createCustomerDto.name);
      expect(response.body.email).toEqual(createCustomerDto.email);
    });

    it('should return 409 if customer already exists', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'Test Customer',
        email: customer.email,
      };

      await request(app.getHttpServer())
        .post('/customers')
        .set('x-api-key', apiKey)
        .send(createCustomerDto)
        .expect(409);
    });

    it('should return a customer by id', async () => {
      const findResponse = await request(app.getHttpServer())
        .get(`/customers/${customer.id}`)
        .set('x-api-key', apiKey)
        .expect(200);

      expect(findResponse.body.id).toEqual(customer.id);
      expect(findResponse.body.name).toEqual(customer.name);
      expect(findResponse.body.email).toEqual(customer.email);
    });

    it('should return 404 if customer not found', async () => {
      await request(app.getHttpServer())
        .get('/customers/00000000-0000-0000-0000-000000000000')
        .set('x-api-key', apiKey)
        .expect(404);
    });

    it('should return an array of customers', async () => {
      const response = await request(app.getHttpServer())
        .get('/customers')
        .set('x-api-key', apiKey)
        .expect(200);

      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('email');
    });
  });

  describe('TransactionController (e2e)', () => {
    it('should create a new transaction', async () => {
      const createTransactionDto: CreateTransactionDto = {
        amount: '10.00',
      };

      const response = await request(app.getHttpServer())
        .post('/transactions')
        .set('x-api-key', apiKey)
        .set('x-customer-id', customer.id)
        .set('x-idempotency-key', Date.now().toString()+1)
        .send(createTransactionDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.amount).toEqual(10.0);
      expect(response.body.type).toEqual('CREDIT');
    });

    it('should return 400 if customer has insufficient funds', async () => {
      const createTransactionDto: CreateTransactionDto = {
        amount: '-1000000.00',
      };

      await request(app.getHttpServer())
        .post('/transactions')
        .set('x-api-key', apiKey)
        .set('x-customer-id', customer.id)
        .set('x-idempotency-key', Date.now().toString())
        .send(createTransactionDto)
        .expect(400);
    });
  });
});
