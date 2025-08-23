# Blu - A Production-Ready Nestjs Project

## Description

This project is a production-ready application that demonstrates a robust and scalable architecture for handling merchants, customers, wallets, and transactions. It is built with NestJS, a progressive Node.js framework.

### Features
*   **Merchant Management:** Create and manage merchants.
*   **Customer Management:** Create and manage customers for each merchant.
*   **Wallet Management:** Each merchant and customer has a wallet with a balance.
*   **Transaction Management:** Perform credit and debit transactions between customers and merchants.
*   **Authentication:** Secure the API with API keys.
*   **Database Migrations:** Use TypeORM migrations to manage the database schema.
*   **Testing:** Includes unit and end-to-end tests to ensure the quality of the code.
*   **Load Testing:** Includes k6 scripts to simulate user traffic and identify performance bottlenecks.
*   **Docker Support:** Includes a Dockerfile and docker-compose.yml for easy containerization and deployment.

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v20 or higher)
*   [Yarn](https://yarnpkg.com/)
*   [Docker](https://www.docker.com/)
*   [k6](https://k6.io/docs/getting-started/installation/)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/big-jo/blu.git
    ```

2.  Install the dependencies:

    ```bash
    yarn install
    ```

3.  Start the database:

    ```bash
    docker-compose up -d
    ```

4.  Run the database migrations:
    Ideally, it would be done automatically on application startup, but to run it manually, use:

    ```bash
    yarn migration:run
    ```

## Running the application

### Development

```bash
# watch mode
yarn run start:dev
```

### Production

```bash
yarn run start:prod
```

## Running the tests

### Unit tests

```bash
yarn run test
```

### End-to-end tests

```bash
yarn run test:e2e
```

## API Reference

The API is documented using Swagger. You can access the Swagger UI at `http://localhost:${PORT}/api/v1/documentation`.

### Authentication

Most of the endpoints are protected by an API key. You need to provide the API key in the `x-api-key` header of your requests.

When performing operations on behalf of a customer, you also need to provide the customer ID in the `x-customer-id` header.

## Deployment

The application can be deployed using Docker. The `Dockerfile` and `docker-compose.yml` files are included in the project.

To build and run the Docker container, you can use the following commands:

```bash
docker-compose build
docker-compose up
```

## Built With

*   [NestJS](https://nestjs.com/) - The web framework used.
*   [TypeORM](https://typeorm.io/) - The ORM used to interact with the database.
*   [PostgreSQL](https://www.postgresql.org/) - The database used to store the data.
*   [Jest](https://jestjs.io/) - The testing framework used.
*   [k6](https://k6.io/) - The load testing tool used.
*   [Docker](https://www.docker.com/) - The containerization platform used.

## Benchmarking

To run the k6 benchmark tests, you can use the following command:

```bash
k6 run k6-scripts/user-story.js
```

This will simulate a user story that includes merchant creation, customer creation, and transactions. You can adjust the number of virtual users (VUs) and the duration of the test in the `k6-scripts/user-story.js` file.
