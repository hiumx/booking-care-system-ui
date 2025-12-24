# Redux State Management Setup

This project uses Redux Toolkit with TypeScript for state management. The setup includes persistent storage, typed hooks, and comprehensive slices for different parts of the application.

## Project Structure

```
src/
  store/
    slices/
      authSlice.ts          # Authentication state
      userSlice.ts          # User profile state
      appointmentSlice.ts   # Appointment management
      doctorSlice.ts        # Doctor listings and details
      specialtySlice.ts     # Medical specialties
      facilitySlice.ts      # Medical facilities
      blogSlice.ts          # Blog posts and content
      uiSlice.ts           # UI state and preferences
    selectors/
      index.ts             # Memoized selectors
    hooks.ts               # Typed Redux hooks
    ReduxProvider.tsx      # Provider component
    index.ts              # Store configuration
```

## Features

### ✅ What's Included

- **Redux Toolkit** for modern Redux patterns
- **Redux Persist** for data persistence
- **TypeScript** integration with typed hooks
- **Async Thunks** for API calls
- **Memoized Selectors** for performance
- **Comprehensive State Management** for:
    - Authentication & Authorization
    - User Profile Management
    - Appointment Booking & Management
    - Doctor Listings & Search
    - Medical Specialties
    - Healthcare Facilities
    - Blog Content Management
    - UI State & Preferences

### 🔄 State Persistence

The following states are persisted to localStorage:

- Authentication data (user, tokens)
- User profile information
- UI preferences (theme, language, etc.)

## Usage Examples

### 1. Using Typed Hooks

```tsx
import { useAppSelector, useAppDispatch } from '../store/hooks';

const MyComponent = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const isLoading = useAppSelector((state) => state.auth.isLoading);

    // ... component logic
};
```

### 2. Dispatching Actions

```tsx
import { loginAsync } from '../store/slices/authSlice';

const handleLogin = async () => {
    try {
        await dispatch(loginAsync({ email, password })).unwrap();
        // Handle success
    } catch (error) {
        // Handle error
    }
};
```

### 3. Using Selectors

```tsx
import { selectIsAuthenticated, selectUpcomingAppointments } from '../store/selectors';

const Dashboard = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const upcomingAppointments = useAppSelector(selectUpcomingAppointments);

    // ... component logic
};
```

### 4. Managing UI State

```tsx
import { addNotification, setTheme } from '../store/slices/uiSlice';

// Show notification
dispatch(
    addNotification({
        type: 'success',
        title: 'Success!',
        message: 'Operation completed successfully',
        duration: 5000,
    })
);

// Change theme
dispatch(setTheme('dark'));
```

## Available Slices

### AuthSlice

- User authentication and authorization
- Login/logout functionality
- Token management
- Login attempt tracking

### UserSlice

- User profile management
- Personal information updates
- Medical information tracking
- Preferences management

### AppointmentSlice

- Appointment booking and management
- Available time slots
- Appointment history
- Filtering and pagination

### DoctorSlice

- Doctor listings and search
- Doctor profiles and details
- Featured doctors
- Filtering by specialty, location, etc.

### SpecialtySlice

- Medical specialties management
- Specialty-based filtering
- Featured specialties

### FacilitySlice

- Healthcare facility listings
- Location-based search
- Facility details and amenities
- Nearby facilities

### BlogSlice

- Blog post management
- Categories and tags
- Comments system
- Featured and related posts

### UISlice

- Theme management
- Notifications system
- Modal management
- Loading states
- User preferences
- Responsive design state

## API Integration

Each slice includes async thunks for API calls:

```tsx
// Example API call
export const fetchDoctors = createAsyncThunk(
    'doctor/fetchDoctors',
    async (params, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/doctors', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Failed to fetch doctors');
            return await response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);
```

## Best Practices

### 1. Use Typed Hooks

Always use `useAppDispatch` and `useAppSelector` instead of the plain Redux hooks.

### 2. Use Selectors

Create and use memoized selectors for derived state to improve performance.

### 3. Handle Loading States

Use the built-in loading states in slices to show appropriate UI feedback.

### 4. Error Handling

Handle errors consistently using the error states provided by each slice.

### 5. Normalize State

Keep state normalized and avoid nested structures when possible.

## Development Tools

### Redux DevTools

The store is configured with Redux DevTools for debugging. Install the browser extension and open developer tools to inspect state changes.

### Performance Monitoring

The UI slice includes performance metrics tracking for monitoring application performance.

## Environment Setup

The Redux store is automatically configured when you wrap your app with `ReduxProvider`:

```tsx
// App.tsx
import ReduxProvider from './store/ReduxProvider';

function App() {
    return <ReduxProvider>{/* Your app components */}</ReduxProvider>;
}
```

## Example Component

See `src/components/ReduxExample/ReduxExample.tsx` for a complete example of how to use Redux in a component.

## Migration Guide

If you're migrating from a different state management solution:

1. **From Context API**: Replace context providers with Redux slices
2. **From useState**: Move component state to appropriate Redux slices
3. **From other Redux setups**: Update imports to use the new typed hooks and selectors

## Troubleshooting

### Common Issues

1. **Persistence not working**: Check that the slice is included in the whitelist in `store/index.ts`
2. **TypeScript errors**: Ensure you're using the typed hooks from `store/hooks.ts`
3. **Selectors not updating**: Use `createSelector` for memoized selectors

### Performance Optimization

1. Use `createSelector` for computed state
2. Keep selectors specific and focused
3. Avoid subscribing to unnecessary state changes
4. Use loading states to prevent unnecessary re-renders

## Next Steps

1. Customize the API endpoints in each slice to match your backend
2. Add more specific actions based on your application requirements
3. Implement proper error boundaries for better error handling
4. Add middleware for logging or analytics as needed
