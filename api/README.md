# HeroBot API

Express.js backend API for HeroBot.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following content:
```
PORT=3000
NODE_ENV=development
```

## Running the API

Development mode with hot reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Available Endpoints

- `GET /`: Welcome message
- `GET /health`: Health check endpoint

## Testing

Run tests:
```bash
npm test
```
