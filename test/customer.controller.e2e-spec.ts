
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateCustomerDto } from '../src/modules/customer/customer.dto';
import { MerchantService } from '../src/modules/merchant/merchant.service';
import { MerchantEntity } from '../src/modules/merchant/merchant.entity';

describe('CustomerController (e2e)', () => {
  let app: INestApplication;
  let merchant: MerchantEntity;
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
      email: 'test@merchant.com',
    });
    apiKey = merchant.apiKey;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /customers', () => {
    it('should create a new customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'Test Customer',
        email: 'test@customer.com',
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

    it('should return 401 if api key is missing', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'Test Customer',
        email: 'test@customer.com',
      };

      await request(app.getHttpServer())
        .post('/customers')
        .send(createCustomerDto)
        .expect(401);
    });
  });

  describe('GET /customers/:id', () => {
    it('should return a customer by id', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'Test Customer 2',
        email: 'test2@customer.com',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/customers')
        .set('x-api-key', apiKey)
        .send(createCustomerDto)
        .expect(201);

      const customerId = createResponse.body.id;

      const findResponse = await request(app.getHttpServer())
        .get(`/customers/${customerId}`)
        .set('x-api-key', apiKey)
        .expect(200);

      expect(findResponse.body.id).toEqual(customerId);
      expect(findResponse.body.name).toEqual(createCustomerDto.name);
      expect(findResponse.body.email).toEqual(createCustomerDto.email);
    });

    it('should return 404 if customer not found', async () => {
      await request(app.getHttpServer())
        .get('/customers/00000000-0000-0000-0000-000000000000')
        .set('x-api-key', apiKey)
        .expect(404);
    });
  });
});
