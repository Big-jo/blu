import http from 'k6/http';
import { check, sleep, group } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 }, // ramp up to 100 users over 2 minutes
    { duration: '5m', target: 100 }, // stay at 100 users for 5 minutes
    { duration: '2m', target: 0 },   // ramp down to 0 users
  ],
};

const BASE_URL = 'http://localhost:8000';

export default function () {
  let apiKey;
  let merchantId;
  let customerId;

  group('Merchant Creation', () => {
    const url = `${BASE_URL}/api/v1/merchants`;
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
    if (res.status === 201) {
      apiKey = res.json('apiKey');
      merchantId = res.json('id');
    }
  });

  if (apiKey) {
    group('Customer Creation', () => {
      const url = `${BASE_URL}/api/v1/customers`;
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
        if (res.status === 201) {
          customerId = res.json('id');
        }
      });
    });
  }

  if (apiKey && customerId) {
    group('Transaction Creation', () => {
      const url = `${BASE_URL}/api/v1/congestion/transaction-with-delay`;
      const requests = Array.from({ length: 10 }, (_, i) => {
        const amount = (Math.random() * 100).toFixed(2);
        const type = Math.random() > 0.5 ? 'CREDIT' : 'DEBIT';
        const finalAmount = type === 'DEBIT' ? `-${amount}` : amount;

        return {
          method: 'POST',
          url: url,
          body: JSON.stringify({
            amount: finalAmount,
          }),
          params: {
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': apiKey,
              'x-customer-id': customerId,
              'x-idempotency-key': `${__VU}-${__ITER}-${i}-${Date.now()}`,
            },
          },
        };
      });
  
      const responses = http.batch(requests);
      responses.forEach((res) => {
        check(res, { 'transaction created': (r) => r.status === 201 });
      });
    });
  }

  sleep(1);
}