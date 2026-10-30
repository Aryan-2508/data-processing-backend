# Data Processing Backend

A high-volume data processing backend built using **Node.js, Express.js, TypeScript, and MongoDB**. This project focuses on handling large datasets efficiently and generating analytical insights using MongoDB aggregation pipelines.

## Tech Stack

- **Node.js** – JavaScript runtime
- **Express.js** – REST API framework
- **TypeScript** – Static typing
- **MongoDB** – NoSQL database
- **Mongoose** – MongoDB object modeling
- **tsx** – TypeScript development execution

## Features

- Customer, product, order, and payment data models.
- MongoDB document relationships using references.
- Data filtering, sorting, and pagination.
- Product categorization using categories and tags.
- MongoDB aggregation pipelines for analytics.
- Revenue analysis by product category.
- Monthly revenue analysis for the current year.
- Average Revenue Per Paying User (ARPU).
- Batch processing for large datasets.
- Configurable database seeding.
- Database indexes for query optimization.
- Centralized error handling.
- API execution-time monitoring.

## Project Structure

```text
data-processing-backend/
│
├── src/
│   ├── config/
│   │   └── database.ts
│   │
│   ├── controllers/
│   │   ├── analytics.controller.ts
│   │   ├── customer.controller.ts
│   │   ├── order.controller.ts
│   │   ├── payment.controller.ts
│   │   └── product.controller.ts
│   │
│   ├── middleware/
│   │   └── errorHandler.ts
│   │
│   ├── models/
│   │   ├── customer.model.ts
│   │   ├── order.model.ts
│   │   ├── payment.model.ts
│   │   └── product.model.ts
│   │
│   ├── routes/
│   │   ├── analytics.routes.ts
│   │   ├── customer.routes.ts
│   │   ├── order.routes.ts
│   │   ├── payment.routes.ts
│   │   └── product.routes.ts
│   │
│   ├── scripts/
│   │   └── seed.ts
│   │
│   ├── services/
│   │   ├── analytics.service.ts
│   │   ├── order.service.ts
│   │   └── product.service.ts
│   │
│   ├── utils/
│   │   └── bulkProcessor.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Aryan-2508/data-processing-backend.git
```

### 2. Navigate to the Project Directory

```bash
cd data-processing-backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Replace `your_mongodb_connection_string` with your MongoDB connection string.

## Available Scripts

| Command         | Description                         |
| --------------- | ----------------------------------- |
| `npm install`   | Installs project dependencies       |
| `npm run dev`   | Starts the development server       |
| `npm run build` | Compiles TypeScript into JavaScript |
| `npm run seed`  | Runs the database seeding script    |

## Running the Application

Start the development server:

```bash
npm run dev
```

The server runs at:

```text
http://localhost:5000
```

### Health Check

```http
GET /health
```

Example response:

```json
{
  "success": true,
  "message": "Data Processing Backend is running successfully"
}
```

## Database Seeding

The project includes a standalone seed script for generating sample database records.

Run the following command:

```bash
npm run seed
```

The seed script generates sample records for:

- Customers
- Products
- Orders
- Payments

### Seeding Features

- Batch-based insertion for handling large datasets.
- Configurable record generation.
- Sample data with different categories, tags, and statuses.
- Progress logging during insertion.
- Error handling during data generation.

**Note:** Configure the seed script according to the required dataset size before running it. Review any database-clearing option carefully before use.

## Analytics Dashboard API

The project provides a single analytics endpoint that returns multiple analytical metrics in one response.

### Get Analytics Dashboard

```http
GET /api/analytics/dashboard
```

**Base URL:**

```text
http://localhost:5000
```

**Complete URL:**

```text
http://localhost:5000/api/analytics/dashboard
```

### Dashboard Metrics

The analytics dashboard includes:

| Metric                   | Description                                             |
| ------------------------ | ------------------------------------------------------- |
| Total Customers          | Total number of customers                               |
| Total Products           | Total number of products                                |
| Total Orders             | Total number of orders                                  |
| Pending Orders           | Number of orders awaiting processing                    |
| Successful Payments      | Total successful payment count                          |
| Total Revenue            | Revenue generated from successful payments              |
| Total Paying Users       | Number of unique customers who made successful payments |
| Average revenue per User | Average revenue per paying user                         |
| Revenue by Category      | Revenue grouped by product category                     |
| Monthly Revenue          | Revenue grouped by month for the current year           |

### Example Response

```json
{
  "success": true,
  "data": {
    "totalCustomers": 10000,
    "totalProducts": 1000,
    "totalOrders": 50000,
    "pendingOrders": 10000,
    "successfulPayments": 12500,
    "totalRevenue": 39993004,
    "totalPayingUsers": 2500,
    "averageRevenuePerUser": 15997.2,
    "revenueByCategory": [
      {
        "category": "Home",
        "totalRevenue": 8046718
      },
      {
        "category": "Accessories",
        "totalRevenue": 8031314
      }
    ],
    "monthlyRevenue": []
  },
  "executionTime": "..."
}
```

*The values above are illustrative. Actual results depend on the records in your database.*

## Data Processing and Optimization

### Batch Processing

The project uses batch processing to avoid loading large datasets into memory at once.

Records are divided into smaller batches and processed sequentially to improve memory efficiency.

### Aggregation Pipelines

MongoDB aggregation pipelines are used for:

- Filtering successful payments.
- Joining related collections.
- Grouping records by categories and dates.
- Calculating revenue metrics.
- Generating analytical reports.

### Database Indexing

Indexes are defined on frequently queried fields to improve query performance.

Examples include:

- Customer city and active status.
- Product category and creation date.
- Product tags.
- Order customer and status.
- Payment order and status.

### Pagination

Pagination helps retrieve large datasets in smaller portions instead of returning all records in a single response.

## Error Handling

The project uses centralized error-handling middleware to provide consistent API error responses and manage application errors.

## Building the Project

Compile the TypeScript source code:

```bash
npm run build
```

The compiled JavaScript output is generated in the `dist/` directory.

## Author

**Aryan Rana**

GitHub: [https://github.com/Aryan-2508](https://github.com/Aryan-2508)
