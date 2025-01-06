Transaction Management API

A Node.js application that provides APIs to manage users and their transactions. The application uses MongoDB Atlas as the database and adheres to modular and SOLID design principles for scalability and maintainability.

Features

Fetch user details by their ID.

Fetch all transactions for a user with filters (status, type, and date range).

Fetch all transactions across users with filters (status, type, date range) and pagination.

MongoDB aggregation framework for efficient data querying.
Database seeding with sample data.
Tech Stack
Backend: Node.js, Express.js
Database: MongoDB (MongoDB Atlas)
Environment Variables: dotenv
Middleware: body-parser, cookie-parser
