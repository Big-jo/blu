import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    constant_arrival_rate: {
      executor: 'constant-arrival-rate',
      rate: 3.33, // 200 tenants per minute (200 / 60 seconds)
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 50, // initial VUs to allocate
      maxVUs: 100, // maximum VUs to allow
    },
  },
};

export default function () {
  const name = `Test Merchant ${__VU}-${__ITER}`; // Unique name for each merchant
  const email = `test-merchant-${__VU}-${__ITER}@example.com`; // Unique email

  const payload = JSON.stringify({
    name: name,
    email: email,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post('http://localhost:3000/merchants', payload, params);

  check(res, {
    'is status 201': (r) => r.status === 201,
  });

  sleep(0.1); // Small sleep to avoid overwhelming the system immediately
}
