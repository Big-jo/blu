import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CreateMerchantDto } from 'src/modules/merchant/merchant.dto';

describe('MerchantController (e2e)', () => {
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
