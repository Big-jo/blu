import http from 'k6/http';
import { check, sleep } from 'k6';
import { TransactionType } from '../src/modules/transaction/transaction.enum.ts';

export const options = {
  scenarios: {
    constant_arrival_rate: {
      executor: 'constant-arrival-rate',
      rate: 3000, // 3000 transactions per second
      timeUnit: '1s',
      duration: '10s', // Run for 10 seconds
      preAllocatedVUs: 100, // initial VUs to allocate
      maxVUs: 500, // maximum VUs to allow
    },
  },
};

export default function () {
  // Create a customer and get their wallet ID for each iteration
  // In a real-world scenario, you might want to pre-create these or use a shared pool
  const uniqueCustomerEmail = `transaction-customer-${__VU}-${__ITER}@example.com`;
  const createCustomerPayload = JSON.stringify({
    name: 'Transaction User',
    email: uniqueCustomerEmail,
  });

  const customerParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const customerRes = http.post('http://localhost:3000/customers', createCustomerPayload, customerParams);
  check(customerRes, { 'customer created': (r) => r.status === 201 });

  const customerId = customerRes.json('id');

  // Assuming the first wallet belongs to the created customer
  const walletRes = http.get('http://localhost:3000/wallets');
  check(walletRes, { 'wallets fetched': (r) => r.status === 200 });
  const walletId = walletRes.json('[0].id');

  const transactionPayload = JSON.stringify({
    amount: Math.random() * 100, // Random amount
    type: Math.random() > 0.5 ? TransactionType.CREDIT : TransactionType.DEBIT,
    walletId: walletId,
    customerId: customerId,
  });

  const transactionParams = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post('http://localhost:3000/transactions', transactionPayload, transactionParams);

  check(res, {
    'is status 201': (r) => r.status === 201,
  });

  sleep(0.1);
}
