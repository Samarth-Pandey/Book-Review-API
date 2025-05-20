# Book Review API

A RESTful API for managing books and reviews, built with Node.js, Express, and PostgreSQL.

## Features

- User authentication (JWT)
- Add, view, and search books
- Add, update, and delete reviews
- Pagination and filtering
- Search functionality

## Database Schema

### Tables

1. **Users**
   - id (PK)
   - username
   - email
   - password
   - createdAt
   - updatedAt

2. **Books**
   - id (PK)
   - title
   - author
   - genre
   - description
   - publishedYear
   - addedBy (FK to Users)
   - createdAt
   - updatedAt

3. **Reviews**
   - id (PK)
   - rating
   - comment
   - bookId (FK to Books)
   - userId (FK to Users)
   - createdAt
   - updatedAt

## Setup Instructions

1. Clone the repository
   ```bash
   git clone https://github.com/Samarth-Pandey/Book-Review-API.git
   cd Book-Review-API

2. Install dependencies

    npm install

3. Set up environment variables

    Create a .env file in the root directory

    Add the following variables:

        DB_HOST=localhost
        DB_USER=your_username
        DB_PASSWORD=your_password
        DB_NAME=book_review_db
        DB_PORT=5432
        JWT_SECRET=your_jwt_secret_key
        JWT_EXPIRE=30d

4. Start the server

    npm run dev

5. Make sure you have PostgreeSQL installed and a databse name "book_review_db" is created.


# API Endpoints

# Authentication

### POST /api/signup - Register a new user
### POST /api/login - Authenticate user and get token

# Books

### GET /api/books - Get all books (with pagination and filters)
### GET /api/books/:id - Get book details by ID
### POST /api/books - Add a new book (Authenticated)
### GET /api/search?q=query - Search books by title or author

# Reviews

### POST /api/books/:id/reviews - Add a review to a book (Authenticated)
### PUT /api/reviews/:id - Update a review (Authenticated)
### DELETE /api/reviews/:id - Delete a review (Authenticated)

# Example Requests

# Signup

curl -X POST http://localhost:5000/api/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'

# Login

curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Add Book (Authenticated)

curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title": "Sample Book", "author": "John Doe", "genre": "Fiction", "description": "A sample book description"}'

# Get Books with Pagination

curl "http://localhost:5000/api/books?page=1&size=5"

# Add Review

curl -X POST http://localhost:5000/api/books/1/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"rating": 5, "comment": "Great book!"}'


# Design Decisions

Database Choice: PostgreSQL was chosen for its reliability and support for complex queries.

Authentication: JWT was implemented for stateless authentication.

Pagination: Implemented for both books and reviews to handle large datasets.

Error Handling: Comprehensive error handling middleware for consistent error responses.

Validation: Input validation for all user-provided data.

Modular Structure: Code is organized into controllers, routes, and models for maintainability.

Please refer to this screen recording as well for the working - https://drive.google.com/file/d/1ReR2vDf5BXh0CK7K4Yb-h1Wv5-F3sQ8w/view?usp=sharing
