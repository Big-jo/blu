
import http from 'k6/http';
import { check, sleep, group } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
};

const BASE_URL = 'http://localhost:8000';

export default function () {
  let apiKey;
  let merchantId;

  group('Merchant Creation', () => {
    const url = `${BASE_URL}/merchants`;
    const payload = JSON.stringify({
      name: `Merchant ${__VU}`,
      email: `merchant${__VU}@test.com`,
    });

    const params = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = http.post(url, payload, params);
    check(res, { 'merchant created': (r) => r.status === 201 });
    apiKey = res.json('apiKey');
    merchantId = res.json('id');
  });

  group('Customer Creation', () => {
    const url = `${BASE_URL}/customers`;
    const requests = Array.from({ length: 100 }, (_, i) => {
      return {
        method: 'POST',
        url: url,
        body: JSON.stringify({
          name: `Customer ${__VU}-${i}`,
          email: `customer${__VU}-${i}@test.com`,
        }),
        params: {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
          },
        },
      };
    });

    const responses = http.batch(requests);
    responses.forEach((res) => {
      check(res, { 'customer created': (r) => r.status === 201 });
    });
  });

  group('Transaction Creation', () => {
    const url = `${BASE_URL}/transactions`;
    const requests = Array.from({ length: 10 }, (_, i) => {
      return {
        method: 'POST',
        url: url,
        body: JSON.stringify({
          amount: (Math.random() * 100).toFixed(2),
        }),
        params: {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'x-customer-id': `customer${__VU}-1@test.com`, // just using the first customer for simplicity
            'x-idempotency-key': `${__VU}-${i}-${Date.now()}`,
          },
        },
      };
    });

    const responses = http.batch(requests);
    responses.forEach((res) => {
      check(res, { 'transaction created': (r) => r.status === 201 });
    });
  });

  sleep(1);
}
