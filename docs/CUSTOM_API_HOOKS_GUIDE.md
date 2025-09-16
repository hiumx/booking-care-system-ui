# Custom API Hook Usage Guide

This guide provides comprehensive documentation on how to use the custom API hooks (`useApi`, `useApiMutation`) with Redux Toolkit for efficient API state management in React components.

## Table of Contents

1. [Overview](#overview)
2. [Hook Types](#hook-types)
3. [Basic Usage](#basic-usage)
4. [Advanced Patterns](#advanced-patterns)
5. [Error Handling](#error-handling)
6. [Best Practices](#best-practices)
7. [Complete Examples](#complete-examples)
8. [TypeScript Integration](#typescript-integration)
9. [Testing](#testing)

## Overview

The custom API hooks provide a standardized way to handle API calls with Redux Toolkit async thunks. They automatically manage loading states, errors, and success callbacks while integrating seamlessly with your Redux store.

### Key Features

- **Automatic State Management**: Loading, error, and success states
- **Redux Integration**: Works with Redux Toolkit async thunks
- **TypeScript Support**: Full type safety
- **Flexible Callbacks**: onSuccess, onError, onSettled hooks
- **Reset Functionality**: Clear state when needed
- **Optimistic Updates**: Support for optimistic UI patterns

## Hook Types

### 1. useApi - General Purpose Hook

For async thunks that require parameters and manual triggering.

```typescript
const { execute, state, reset } = useApi(thunk, options);
```

### 2. useApiMutation - For Create/Update/Delete Operations

Optimized for mutation operations with immediate feedback.

```typescript
const { mutate, state } = useApiMutation(thunk, options);
```

## Basic Usage

### Simple GET Request

```typescript
// 1. First, create your async thunk
const getUserProfile = createAsyncThunk(
    'user/getUserProfile',
    async (userId: string) => {
        const response = await apiClient.get(`/users/${userId}`);
        return response.data;
    }
);

// 2. Use in component
const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
    const {
        execute: fetchProfile,
        state: { data: user, loading, error },
        reset
    } = useApi(getUserProfile, {
        onSuccess: (userData) => {
            console.log('Profile loaded:', userData);
        },
        onError: (error) => {
            console.error('Failed to load profile:', error);
        }
    });

    // Fetch data on mount or when userId changes
    useEffect(() => {
        if (userId) {
            fetchProfile(userId);
        }
    }, [userId, fetchProfile]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!user) return <div>No user found</div>;

    return (
        <div>
            <h2>{user.firstName} {user.lastName}</h2>
            <p>{user.email}</p>
            <button onClick={() => fetchProfile(userId)}>Refresh</button>
            <button onClick={reset}>Clear</button>
        </div>
    );
};
```

### Mutation Operation (Create/Update/Delete)

```typescript
// 1. Create mutation thunk
const createUser = createAsyncThunk(
    'user/createUser',
    async (userData: CreateUserRequest) => {
        const response = await apiClient.post('/users', userData);
        return response.data;
    }
);

// 2. Use in component
const CreateUserForm: React.FC = () => {
    const [formData, setFormData] = useState<CreateUserRequest>({
        email: '',
        firstName: '',
        lastName: ''
    });

    const {
        mutate: createUserMutation,
        state: { loading, error, success }
    } = useApiMutation(createUser,
    useMemo(() => ({
        onSuccess: (newUser) => {
            console.log('User created:', newUser);
            // Reset form or redirect
            setFormData({ email: '', firstName: '', lastName: '' });
        },
        onError: (error) => {
            console.error('Creation failed:', error);
        }
    }), []));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createUserMutation(formData);
        } catch (error) {
            // Error handled by hook
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
                required
            />
            <input
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="First Name"
                required
            />
            <input
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Last Name"
                required
            />

            {error && <div className="error">Error: {error.message}</div>}
            {success && <div className="success">User created successfully!</div>}

            <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create User'}
            </button>
        </form>
    );
};
```

## Advanced Patterns

### List with Pagination and Filtering

```typescript
const UsersList: React.FC = () => {
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        search: '',
        role: ''
    });

    const {
        execute: fetchUsers,
        state: { data: usersData, loading, error }
    } = useApi(getUsersList, {
        onSuccess: (data) => {
            console.log(`Loaded ${data.users.length} of ${data.total} users`);
        }
    });

    // Fetch users when filters change
    useEffect(() => {
        fetchUsers(filters);
    }, [filters, fetchUsers]);

    const handleSearch = (search: string) => {
        setFilters(prev => ({ ...prev, search, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Search users..."
                onChange={(e) => handleSearch(e.target.value)}
            />

            {loading && <div>Loading users...</div>}
            {error && <div>Error: {error.message}</div>}

            {usersData && (
                <>
                    <div>
                        {usersData.users.map(user => (
                            <div key={user.id}>
                                {user.firstName} {user.lastName} - {user.email}
                            </div>
                        ))}
                    </div>

                    <Pagination
                        current={filters.page}
                        total={usersData.total}
                        pageSize={filters.limit}
                        onChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};
```

### Optimistic Updates

```typescript
const useOptimisticUserUpdate = () => {
    const dispatch = useAppDispatch();

    const { mutate: updateUserMutation, state } = useApiMutation(updateUser, {
        onSuccess: (updatedUser) => {
            // Update succeeded, data is already optimistically updated
            console.log('User updated successfully:', updatedUser);
        },
        onError: (error, originalData) => {
            // Revert optimistic update
            dispatch(revertUserUpdate(originalData));
            console.error('Update failed, reverted changes:', error);
        },
    });

    const updateUserOptimistically = async (userId: string, updates: Partial<User>) => {
        // Apply optimistic update immediately
        dispatch(updateUserOptimistic({ id: userId, updates }));

        try {
            await updateUserMutation({ id: userId, ...updates });
        } catch (error) {
            // Error handled in hook's onError
        }
    };

    return { updateUserOptimistically, state };
};
```

### Multiple Parallel Requests

```typescript
const Dashboard: React.FC = () => {
    const {
        execute: fetchUserStats,
        state: { data: userStats, loading: userStatsLoading }
    } = useApi(getUserStats);

    const {
        execute: fetchRecentActivity,
        state: { data: activity, loading: activityLoading }
    } = useApi(getRecentActivity);

    const {
        execute: fetchNotifications,
        state: { data: notifications, loading: notificationsLoading }
    } = useApi(getNotifications);

    useEffect(() => {
        // Fetch all data in parallel
        Promise.all([
            fetchUserStats(),
            fetchRecentActivity(),
            fetchNotifications()
        ]);
    }, [fetchUserStats, fetchRecentActivity, fetchNotifications]);

    const isLoading = userStatsLoading || activityLoading || notificationsLoading;

    if (isLoading) return <div>Loading dashboard...</div>;

    return (
        <div>
            <UserStatsWidget data={userStats} />
            <RecentActivityWidget data={activity} />
            <NotificationsWidget data={notifications} />
        </div>
    );
};
```

## Error Handling

### Global Error Handling

```typescript
// Create a custom hook for consistent error handling
const useApiWithErrorHandling = <T, P>(
    thunk: AsyncThunk<T, P, AsyncThunkConfig>,
    options?: UseApiOptions<T>
) => {
    const { execute, state, reset } = useApi(thunk, {
        ...options,
        onError: (error) => {
            // Global error handling
            if (error.status === 401) {
                // Redirect to login
                window.location.href = '/login';
            } else if (error.status === 403) {
                // Show permission denied message
                toast.error('You do not have permission to perform this action');
            } else if (error.status >= 500) {
                // Show server error message
                toast.error('Server error. Please try again later.');
            }

            // Call custom error handler if provided
            options?.onError?.(error);
        },
    });

    return { execute, state, reset };
};
```

### Retry Logic

```typescript
const useApiWithRetry = <T, P>(
    thunk: AsyncThunk<T, P, AsyncThunkConfig>,
    maxRetries: number = 3,
    options?: UseApiOptions<T>
) => {
    const [retryCount, setRetryCount] = useState(0);

    const { execute, state, reset } = useApi(thunk, {
        ...options,
        onError: (error) => {
            if (retryCount < maxRetries && error.status >= 500) {
                // Retry for server errors
                setTimeout(
                    () => {
                        setRetryCount((prev) => prev + 1);
                        execute(lastParams.current);
                    },
                    1000 * Math.pow(2, retryCount)
                ); // Exponential backoff
            } else {
                options?.onError?.(error);
            }
        },
    });

    const lastParams = useRef<P>();

    const executeWithRetry = (params: P) => {
        lastParams.current = params;
        setRetryCount(0);
        return execute(params);
    };

    return { execute: executeWithRetry, state, reset, retryCount };
};
```

## Best Practices

### 1. Organize Thunks by Feature

```typescript
// store/slices/userThunks.ts
export const userThunks = {
    getUserProfile,
    getUsersList,
    createUser,
    updateUser,
    deleteUser,
};

// store/slices/appointmentThunks.ts
export const appointmentThunks = {
    getAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
};
```

### 2. Use TypeScript for Type Safety

```typescript
interface UseApiReturn<T> {
    execute: (params?: any) => Promise<T>;
    state: {
        data: T | null;
        loading: boolean;
        error: Error | null;
        success: boolean;
    };
    reset: () => void;
}

// Use specific types for your data
interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
}

const { execute, state }: UseApiReturn<User> = useApi(getUserProfile);
```

### 3. Memoize Expensive Operations

```typescript
const UsersList: React.FC = () => {
    const [filters, setFilters] = useState(defaultFilters);

    // Memoize the filters to prevent unnecessary re-renders
    const memoizedFilters = useMemo(() => filters, [filters]);

    const { execute: fetchUsers, state } = useApi(getUsersList);

    useEffect(() => {
        fetchUsers(memoizedFilters);
    }, [memoizedFilters, fetchUsers]);

    // ... rest of component
};
```

### 4. Extract Custom Hooks for Reusability

```typescript
// hooks/useUserOperations.ts
export const useUserOperations = () => {
    const createUser = useApiMutation(createUserThunk, {
        onSuccess: () => toast.success('User created successfully'),
        onError: (error) => toast.error(`Failed to create user: ${error.message}`),
    });

    const updateUser = useApiMutation(updateUserThunk, {
        onSuccess: () => toast.success('User updated successfully'),
        onError: (error) => toast.error(`Failed to update user: ${error.message}`),
    });

    const deleteUser = useApiMutation(deleteUserThunk, {
        onSuccess: () => toast.success('User deleted successfully'),
        onError: (error) => toast.error(`Failed to delete user: ${error.message}`),
    });

    return { createUser, updateUser, deleteUser };
};

// Usage in component
const UserManagement: React.FC = () => {
    const { createUser, updateUser, deleteUser } = useUserOperations();

    // Use the operations...
};
```

## Testing

### Unit Testing Hooks

```typescript
// __tests__/useApi.test.ts
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { useApi } from '../hooks/useApi';
import { getUserProfile } from '../store/slices/userThunks';

const wrapper = ({ children }) => (
    <Provider store={store}>{children}</Provider>
);

describe('useApi', () => {
    it('should handle successful API call', async () => {
        const { result } = renderHook(() => useApi(getUserProfile), { wrapper });

        expect(result.current.state.loading).toBe(false);
        expect(result.current.state.data).toBe(null);

        await act(async () => {
            await result.current.execute('user-123');
        });

        expect(result.current.state.loading).toBe(false);
        expect(result.current.state.data).toBeDefined();
        expect(result.current.state.error).toBe(null);
    });

    it('should handle API error', async () => {
        // Mock API to return error
        jest.spyOn(apiClient, 'get').mockRejectedValueOnce(new Error('API Error'));

        const { result } = renderHook(() => useApi(getUserProfile), { wrapper });

        await act(async () => {
            try {
                await result.current.execute('invalid-user');
            } catch (error) {
                // Expected to throw
            }
        });

        expect(result.current.state.loading).toBe(false);
        expect(result.current.state.error).toBeDefined();
        expect(result.current.state.data).toBe(null);
    });
});
```

### Integration Testing

```typescript
// __tests__/UserProfile.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { UserProfile } from '../components/UserProfile';

const renderWithProvider = (component: React.ReactElement) => {
    return render(
        <Provider store={store}>
            {component}
        </Provider>
    );
};

describe('UserProfile', () => {
    it('should display user data when loaded', async () => {
        const mockUser = {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com'
        };

        // Mock successful API response
        jest.spyOn(apiClient, 'get').mockResolvedValueOnce({
            data: mockUser
        });

        renderWithProvider(<UserProfile userId="1" />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('John Doe')).toBeInTheDocument();
            expect(screen.getByText('john@example.com')).toBeInTheDocument();
        });
    });
});
```

## Conclusion

The custom API hooks provide a powerful and flexible way to manage API calls in React applications with Redux. By following these patterns and best practices, you can:

- Reduce boilerplate code
- Maintain consistent error handling
- Improve type safety
- Create reusable API logic
- Simplify testing

For more examples, see the complete component implementations in `/src/components/examples/UserExamples.tsx`.
