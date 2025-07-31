# Timely Backend

Timely Backend is a robust and scalable server-side application built using the [NestJS](https://nestjs.com) framework. It serves as the backend for managing schedules, employees, organizations, and services efficiently. Designed with modularity and maintainability in mind, this application leverages TypeScript, TypeORM, and Swagger for API documentation.

## Features

- **Employee Management**: Create, update, and manage employee records.
- **Schedule Management**: Define and manage schedules for employees with time validation.
- **Organization Management**: Handle organizational data and relationships.
- **Service Management**: Manage services offered by organizations.
- **API Documentation**: Comprehensive Swagger documentation for all endpoints.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A running instance of a PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/m-uchyla/timely-backend.git
   cd timely-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure the environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=your_username
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=timely
   ```

4. Run database migrations:
   ```bash
   npm run typeorm migration:run
   ```

### Running the Application

- **Development Mode**:
  ```bash
  npm run start:dev
  ```

- **Production Mode**:
  ```bash
  npm run start:prod
  ```

### Testing

- **Unit Tests**:
  ```bash
  npm run test
  ```

- **End-to-End Tests**:
  ```bash
  npm run test:e2e
  ```

- **Test Coverage**:
  ```bash
  npm run test:cov
  ```

## API Documentation

The API is documented using Swagger. Once the application is running, you can access the Swagger UI at:
```
http://localhost:3000/api
```

## Deployment

For deployment instructions, refer to the [NestJS Deployment Guide](https://docs.nestjs.com/deployment).

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push them to your fork.
4. Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For questions or support, please contact:

- **Author**: Mateusz Uchyła
- **GitHub**: [m-uchyla](https://github.com/m-uchyla)
