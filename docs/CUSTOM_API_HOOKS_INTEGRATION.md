# Custom API Hooks Integration Guide

This guide provides step-by-step instructions for integrating the custom API hooks into your existing React + Redux Toolkit project.

## Prerequisites

Ensure your project has the following dependencies:

```json
{
    "@reduxjs/toolkit": "^1.9.0",
    "react-redux": "^8.0.0",
    "axios": "^1.0.0",
    "react": "^18.0.0"
}
```

## Step 1: Setup Redux Store (if not already configured)

If you don't have Redux configured, create the basic store structure:

```typescript
// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        user: userSlice,
        // Add other slices here
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// store/hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

## Step 2: Configure Axios (if not already configured)

```typescript
// configs/axios.config.ts
import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 10000,
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export { apiClient };
```

## Step 3: Add the Custom Hook Files

1. Copy `useApi.tsx` to your `src/hooks/` directory
2. Ensure the import path for `useAppDispatch` and `useAppSelector` is correct:

```typescript
// hooks/useApi.tsx (adjust import path as needed)
import { useAppDispatch, useAppSelector } from '../store/hooks';
```

## Step 4: Create Your First Async Thunk

Create a thunk file for your feature:

```typescript
// store/slices/userThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '../../configs/axios.config';

// Define your data types
export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

export interface GetUserRequest {
    userId: string;
}

// Create async thunk
export const getUserProfile = createAsyncThunk(
    'user/getUserProfile',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await apiClient.get<User>(`/users/${userId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getUsersList = createAsyncThunk(
    'user/getUsersList',
    async (params: { page?: number; limit?: number; search?: string }, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/users', { params });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
```

## Step 5: Create or Update Your Slice

```typescript
// store/slices/userSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { getUserProfile, getUsersList } from './userThunks';
import { User } from './userThunks';

interface UserState {
    currentUser: User | null;
    usersList: User[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    currentUser: null,
    usersList: [],
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearUserError: (state) => {
            state.error = null;
        },
        clearCurrentUser: (state) => {
            state.currentUser = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get user profile
            .addCase(getUserProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
            })
            .addCase(getUserProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Get users list
            .addCase(getUsersList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUsersList.fulfilled, (state, action) => {
                state.loading = false;
                state.usersList = action.payload.users || action.payload;
            })
            .addCase(getUsersList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearUserError, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;
```

## Step 6: Create Your First Component

```typescript
// components/UserProfile.tsx
import React, { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { getUserProfile } from '../store/slices/userThunks';

interface UserProfileProps {
  userId: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const {
    execute: fetchProfile,
    state: { data: user, loading, error },
    reset
  } = useApi(getUserProfile, {
    onSuccess: (userData) => {
      console.log('User profile loaded successfully:', userData);
    },
    onError: (error) => {
      console.error('Failed to load user profile:', error);
    }
  });

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    }
  }, [userId, fetchProfile]);

  if (loading) {
    return <div className="loading">Loading user profile...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Error loading profile: {error.message}</p>
        <button onClick={() => fetchProfile(userId)}>Retry</button>
      </div>
    );
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <div className="user-info">
        <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>
      <div className="actions">
        <button onClick={() => fetchProfile(userId)}>Refresh</button>
        <button onClick={reset}>Clear</button>
      </div>
    </div>
  );
};

export default UserProfile;
```

## Step 7: Update Your App Component

```typescript
// App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import UserProfile from './components/UserProfile';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <h1>My Application</h1>
        </header>
        <main>
          <UserProfile userId="123" />
        </main>
      </div>
    </Provider>
  );
}

export default App;
```

## Step 8: Add Basic Styling (Optional)

```css
/* styles/components.css */
.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    font-size: 16px;
    color: #666;
}

.error {
    padding: 20px;
    background-color: #fee;
    border: 1px solid #fcc;
    border-radius: 4px;
    color: #c33;
}

.error button {
    margin-top: 10px;
    padding: 8px 16px;
    background-color: #c33;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.user-profile {
    max-width: 600px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.user-info p {
    margin: 10px 0;
}

.actions {
    margin-top: 20px;
}

.actions button {
    margin-right: 10px;
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.actions button:hover {
    background-color: #0056b3;
}
```

## Step 9: Testing Your Integration

1. Start your development server:

    ```bash
    npm start
    ```

2. Open your browser and navigate to your app

3. Check the browser console for any errors

4. Verify that the API call is made when the component mounts

5. Test the loading, success, and error states

## Common Issues and Solutions

### Issue 1: Import Path Errors

**Problem:** `Cannot resolve module` errors for the hook imports

**Solution:** Adjust the import paths based on your project structure:

```typescript
// If hooks are in src/hooks/
import { useApi } from '../hooks/useApi';

// If hooks are in src/utils/hooks/
import { useApi } from '../utils/hooks/useApi';
```

### Issue 2: TypeScript Errors

**Problem:** Type errors in the hook usage

**Solution:** Ensure your types are properly defined and exported:

```typescript
// Make sure to export types from your thunks file
export type { User, GetUserRequest };

// Import and use the types in your components
import type { User } from '../store/slices/userThunks';
```

### Issue 3: Redux State Not Updating

**Problem:** Hook works but Redux state doesn't update

**Solution:** Ensure your slice handles the thunk actions:

```typescript
// In your slice's extraReducers
.addCase(getUserProfile.fulfilled, (state, action) => {
  // Make sure you're updating the state correctly
  state.currentUser = action.payload;
})
```

### Issue 4: Network Errors

**Problem:** API calls fail with network errors

**Solution:** Check your axios configuration and API base URL:

```typescript
// Make sure your API base URL is correct
const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api', // Adjust this to your API URL
});
```

## Next Steps

1. **Add More Features:** Create additional thunks for CRUD operations
2. **Error Handling:** Implement global error handling patterns
3. **Loading States:** Add sophisticated loading indicators
4. **Caching:** Implement data caching strategies
5. **Testing:** Add unit tests for your hooks and components

## Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Redux Hooks Documentation](https://react-redux.js.org/api/hooks)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Custom API Hooks Usage Guide](./CUSTOM_API_HOOKS_GUIDE.md) - For advanced patterns and examples

## Support

If you encounter any issues during integration, please:

1. Check the browser console for error messages
2. Verify your Redux DevTools for state changes
3. Review the network tab for API call details
4. Refer to the complete examples in `/src/components/examples/UserExamples.tsx`
