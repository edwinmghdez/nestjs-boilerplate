# NestJS Boilerplate 🚀

A NestJS boilerplate for starting a new project faster.

## Features

- **Auth Module**
  - JWT Authentication
  - Two-Factor Authentication (2FA)
  - Redis Token Blacklist
- **User Module**
  - CRUD

## Getting Started

### Initial Setup

```bash
  # Clone repository
  git clone https://github.com/edwinmghdez/nestjs-boilerplate

  cd nestjs-boilerplate

  # Install dependencies
  npm install

  # Configure environment variables
  cp .env.example .env
```

### Docker Execution

```bash
  # Start containers (first time)
  docker compose up --build

  # Start containers (subsequent runs)
  docker compose up

  # Enter the workspace
  docker exec -it nestjs-boilerplate-app-1 /bin/bash
```

### Run Migrations

```bash
  npm run typeorm:run-migrations
```

## API Documentation

Interactive Swagger documentation available at:

- http://localhost:3000/api

- http://localhost:3000/api-json

## License

[MIT](LICENSE)