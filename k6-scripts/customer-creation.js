
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '10s', target: 0 },
  ],
};

const apiKey = __ENV.API_KEY;

export default function () {
  const url = 'http://localhost:8000/customers';
  const payload = JSON.stringify({
    name: `Customer ${__VU}`,
    email: `customer${__VU}@test.com`,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
  };

  const res = http.post(url, payload, params);
  check(res, { 'status was 201': (r) => r.status == 201 });
  sleep(1);
}
