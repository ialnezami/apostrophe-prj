# Apostrophe Backend Project

Backend server built with Express.js for user management system.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote instance)

### Installation

```bash
npm install
```

### Environment Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update the `.env` file with your configuration:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/apostrophe_db
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
```



```bash
npm start
```


