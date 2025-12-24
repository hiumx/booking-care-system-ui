# Architecture

The Booking Care System follows a client-server architecture with a **frontend** that interacts with the **backend** API to manage bookings and user data.

### Key Components:

- **Frontend:** React (with TypeScript), communicates with the backend via REST API.
- **Backend:** Express.js (Node.js), handles business logic and interacts with the database.
- **Database:** PostgreSQL, stores user data, bookings, and provider information.
- **Authentication:** JWT for secure user login and authorization.

### System Flow:

1. **User Registration:** Users sign up and create a profile.
2. **Booking Process:** Users search for available healthcare providers and book appointments.
3. **Admin Panel:** Admins can manage the services, appointments, and providers.
