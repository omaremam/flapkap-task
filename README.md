# Vending Machine API

A RESTful API for a vending machine system built with Node.js, Express, Sequelize, and PostgreSQL. The system supports user authentication, product management, and vending operations with change calculation.

This API service was tested manually, Unit tested and using JMeter

## Features

- 👥 **User Management** - Buyer and Seller roles with different permissions
- 🛍️ **Product Management** - CRUD operations for products (Sellers only)
- 💰 **Vending Operations** - Deposit money, buy products, automatic change calculation
- 🧪 **Comprehensive Testing** - Full test suite with Jest and Supertest
- 🐳 **Docker Support** - Easy deployment with Docker Compose

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Testing**: Jest, Supertest
- **Containerization**: Docker, Docker Compose
- **Database Admin**: Adminer

## Prerequisites

- Docker and Docker Compose installed on your machine
- Git

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flapkap-task
   ```

2. **Start the services**
   ```bash
   docker-compose up --build
   ```
   This should also run the tests included as well as the DB viewer container

3. **Access the API**
   - API Base URL: `http://localhost:3000`
   - Database Admin: `http://localhost:8080`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Products (Sellers only)
- `GET /api/products` - Get all products
- `POST /api/products` - Create a new product
- `GET /api/products/:id` - Get product by ID
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Vending (Buyers only)
- `POST /api/vending/deposit` - Deposit money (5, 10, 20, 50, 100 cents)
- `POST /api/vending/buy` - Buy a product
- `POST /api/vending/reset` - Reset deposit to 0

## Database Access (Adminer)

Access the database administration interface at: **http://localhost:8080**

**Connection Details:**
- System: PostgreSQL
- Server: `db` (or `localhost` if accessing from host)
- Username: `postgres`
- Password: `postgres`
- Database: `flapkap`

## Postman Collection

Import this JSON into Postman to get all the API endpoints pre-configured:

```json
{
  "info": {
    "name": "Vending Machine API",
    "description": "Complete API collection for the Vending Machine system",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000",
      "type": "string"
    },
    {
      "key": "buyerToken",
      "value": "",
      "type": "string"
    },
    {
      "key": "sellerToken",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register Buyer",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"demo_buyer\",\n  \"password\": \"password123\",\n  \"role\": \"BUYER\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Register Seller",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"demo_seller\",\n  \"password\": \"password123\",\n  \"role\": \"SELLER\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login Buyer",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    pm.collectionVariables.set('buyerToken', pm.response.json().token);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"demo_buyer\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "login"]
            }
          }
        },
        {
          "name": "Login Seller",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    pm.collectionVariables.set('sellerToken', pm.response.json().token);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"demo_seller\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Products (Seller Only)",
      "item": [
        {
          "name": "Create Product",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{sellerToken}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"productName\": \"Coca Cola\",\n  \"amountAvailable\": 10,\n  \"cost\": 50\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/products",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products"]
            }
          }
        },
        {
          "name": "Get All Products",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{sellerToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/products",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products"]
            }
          }
        },
        {
          "name": "Get Product by ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{sellerToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/products/1",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products", "1"]
            }
          }
        },
        {
          "name": "Update Product",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{sellerToken}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"amountAvailable\": 15,\n  \"cost\": 60\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/products/1",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products", "1"]
            }
          }
        },
        {
          "name": "Delete Product",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{sellerToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/products/1",
              "host": ["{{baseUrl}}"],
              "path": ["api", "products", "1"]
            }
          }
        }
      ]
    },
    {
      "name": "Vending (Buyer Only)",
      "item": [
        {
          "name": "Deposit Money",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{buyerToken}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"amount\": 100\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/vending/deposit",
              "host": ["{{baseUrl}}"],
              "path": ["api", "vending", "deposit"]
            }
          }
        },
        {
          "name": "Buy Product",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{buyerToken}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"productId\": 1,\n  \"amount\": 1\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/vending/buy",
              "host": ["{{baseUrl}}"],
              "path": ["api", "vending", "buy"]
            }
          }
        },
        {
          "name": "Reset Deposit",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{buyerToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/vending/reset",
              "host": ["{{baseUrl}}"],
              "path": ["api", "vending", "reset"]
            }
          }
        }
      ]
    },
    {
      "name": "Users (Admin Only)",
      "item": [
        {
          "name": "Get All Users",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{sellerToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/users",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users"]
            }
          }
        },
        {
          "name": "Get User by ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{sellerToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/users/1",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "1"]
            }
          }
        },
        {
          "name": "Update User",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{sellerToken}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"deposit\": 200\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/users/1",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "1"]
            }
          }
        },
        {
          "name": "Delete User",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{sellerToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/users/1",
              "host": ["{{baseUrl}}"],
              "path": ["api", "users", "1"]
            }
          }
        }
      ]
    }
  ]
}
```

## Usage Examples

### 1. Register and Login
```bash
# Register a buyer
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "john_buyer", "password": "password123", "role": "BUYER"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john_buyer", "password": "password123"}'
```

### 2. Create Product (Seller)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_SELLER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productName": "Coca Cola", "amountAvailable": 10, "cost": 50}'
```

### 3. Deposit and Buy (Buyer)
```bash
# Deposit money
curl -X POST http://localhost:3000/api/vending/deposit \
  -H "Authorization: Bearer YOUR_BUYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount": 100}'

# Buy product
curl -X POST http://localhost:3000/api/vending/buy \
  -H "Authorization: Bearer YOUR_BUYER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId": 1, "amount": 1}'
```

## Testing

Run the test suite:
```bash
docker-compose run --rm test npm test
```

Run specific tests:
```bash
docker-compose run --rm test npm test -- --testNamePattern="vending"
```

## Environment Variables

Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3000
DB_HOST=db
DB_PORT=5432
DB_NAME=flapkap
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=secret
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

## Change Calculation

The vending machine accepts coins in denominations of 5, 10, 20, 50, and 100 cents. When making a purchase, the system automatically calculates and returns change using the optimal combination of coins.

## Database Schema

- **Users**: id, username, password, role, deposit, createdAt, updatedAt
- **Products**: id, productName, amountAvailable, cost, sellerId, createdAt, updatedAt
