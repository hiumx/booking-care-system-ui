# API Documentation

The Booking Care System API is RESTful and allows for communication between the frontend and backend.

## Base URL:

`https://api.bookingcare.com/`

### Authentication:

All requests require a **Bearer token** for authentication.

### Endpoints:

#### 1. `POST /auth/signup`

- **Description:** Create a new user account.
- **Request Body:**

```json
{
    "username": "john_doe",
    "email": "john.doe@example.com",
    "password": "securePassword123"
}
```
