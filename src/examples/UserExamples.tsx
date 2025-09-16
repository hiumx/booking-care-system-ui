import React, { useEffect, useMemo, useState } from 'react';
import { useApi, useApiMutation } from '../hooks/useApi';
import {
    getUserProfile,
    getUsersList,
    createUser,
    updateUser,
    deleteUser,
    CreateUserRequest,
    UpdateUserRequest,
    GetUsersRequest,
} from '../store/slices/userThunks';
import { User } from '@/types/user.type';

// Example 1: Simple GET request with useApi (for thunks with parameters)
const UserProfile: React.FC<{ userId: string }> = ({ userId }) => {
    const options = useMemo(
        () => ({
            onSuccess: (userData: User) => {
                console.log('User profile loaded:', userData);
            },
            onError: (error: any) => {
                console.error('Failed to load profile:', error);
            },
        }),
        []
    );
    const {
        execute: fetchProfile,
        state: { data: user, loading, error },
        reset,
    } = useApi(getUserProfile, options);

    useEffect(() => {
        if (userId) {
            fetchProfile(userId);
        }
    }, [userId]);

    const handleRefresh = () => {
        reset();
        fetchProfile(userId);
    };

    if (loading) return <div>Loading user profile...</div>;
    if (error) return <div>Error: {error.toString()}</div>;
    if (!user) return <div>No user data</div>;

    return (
        <div className="user-profile">
            <h2>User Profile</h2>
            <p>
                Name: {user.firstName} {user.lastName}
            </p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <button onClick={handleRefresh}>Refresh</button>
        </div>
    );
};

export default UserProfile;

// Example 2: List with pagination using useApi
const UsersList: React.FC = () => {
    const [searchParams, setSearchParams] = useState<GetUsersRequest>({
        page: 1,
        limit: 10,
        search: '',
        role: '',
    });

    const {
        execute: fetchUsers,
        state: { data: usersData, loading, error },
    } = useApi(
        getUsersList,
        useMemo(
            () => ({
                onSuccess: (data) => {
                    console.log(`Loaded ${data.users.length} users`);
                },
            }),
            []
        )
    );

    useEffect(() => {
        fetchUsers(searchParams);
    }, [searchParams, fetchUsers]);

    const handleSearch = (search: string) => {
        setSearchParams((prev) => ({ ...prev, search, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setSearchParams((prev) => ({ ...prev, page }));
    };

    const handleRoleFilter = (role: string) => {
        setSearchParams((prev) => ({ ...prev, role, page: 1 }));
    };

    return (
        <div className="users-list">
            <h2>Users Management</h2>

            {/* Search and filters */}
            <div className="filters">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchParams.search}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <select
                    value={searchParams.role}
                    onChange={(e) => handleRoleFilter(e.target.value)}
                >
                    <option value="">All Roles</option>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            {loading && <div>Loading users...</div>}
            {error && <div>Error: {error.toString()}</div>}

            {usersData && (
                <>
                    <div className="users-grid">
                        {usersData.users.map((user) => (
                            <div key={user.id} className="user-card">
                                <h4>
                                    {user.firstName} {user.lastName}
                                </h4>
                                <p>{user.email}</p>
                                <span className="role-badge">{user.role}</span>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="pagination">
                        <button
                            disabled={searchParams.page === 1}
                            onClick={() => handlePageChange(searchParams.page! - 1)}
                        >
                            Previous
                        </button>
                        <span>
                            Page {searchParams.page} of{' '}
                            {Math.ceil(usersData.total / usersData.limit)}
                        </span>
                        <button
                            disabled={
                                searchParams.page! >= Math.ceil(usersData.total / usersData.limit)
                            }
                            onClick={() => handlePageChange(searchParams.page! + 1)}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

// Example 3: Create/Update form using useApiMutation
const UserForm: React.FC<{
    user?: User;
    onSuccess?: () => void;
    onCancel?: () => void;
}> = ({ user, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState<CreateUserRequest>({
        email: user?.email || '',
        password: '',
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
    });

    const isEditing = !!user;

    const { mutate: createUserMutation, state: createState } = useApiMutation(createUser, {
        onSuccess: () => {
            console.log('User created successfully');
            onSuccess?.();
        },
        onError: (error) => {
            console.error('Create user failed:', error);
        },
    });

    const { mutate: updateUserMutation, state: updateState } = useApiMutation(updateUser, {
        onSuccess: () => {
            console.log('User updated successfully');
            onSuccess?.();
        },
        onError: (error) => {
            console.error('Update user failed:', error);
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isEditing && user) {
                const updateData: UpdateUserRequest = {
                    id: user.id,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                };
                await updateUserMutation(updateData);
            } else {
                await createUserMutation(formData);
            }
        } catch (error) {
            console.error(error);
            // Error is already handled in the hook's onError callback
        }
    };

    const handleInputChange = (field: keyof CreateUserRequest, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const isLoading = createState.loading || updateState.loading;
    const error = createState.error || updateState.error;

    return (
        <div className="user-form">
            <h2>{isEditing ? 'Edit User' : 'Create User'}</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={isEditing} // Don't allow email change on edit
                        required
                    />
                </div>

                {!isEditing && (
                    <div className="form-group">
                        <label>Password:</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            required
                        />
                    </div>
                )}

                <div className="form-group">
                    <label>First Name:</label>
                    <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Phone:</label>
                    <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                </div>

                {error && <div className="error-message">Error: {error.toString()}</div>}

                <div className="form-actions">
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Processing...' : isEditing ? 'Update' : 'Create'}
                    </button>
                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

// Example 4: Delete confirmation with useApiMutation
const DeleteUserButton: React.FC<{
    user: User;
    onSuccess?: () => void;
}> = ({ user, onSuccess }) => {
    const [showConfirm, setShowConfirm] = useState(false);

    const {
        mutate: deleteUserMutation,
        state: { loading, error },
    } = useApiMutation(deleteUser, {
        onSuccess: () => {
            console.log('User deleted successfully');
            setShowConfirm(false);
            onSuccess?.();
        },
        onError: (error) => {
            console.error('Delete user failed:', error);
        },
    });

    const handleDelete = async () => {
        try {
            await deleteUserMutation(user.id);
        } catch (error) {
            console.error(error);
            // Error handled in hook
        }
    };

    if (showConfirm) {
        return (
            <div className="delete-confirmation">
                <p>
                    Are you sure you want to delete {user.firstName} {user.lastName}?
                </p>
                {error && <div className="error">Error: {error.toString()}</div>}
                <button onClick={handleDelete} disabled={loading} className="btn-danger">
                    {loading ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button onClick={() => setShowConfirm(false)} disabled={loading}>
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <button onClick={() => setShowConfirm(true)} className="btn-danger">
            Delete User
        </button>
    );
};

export { UserProfile, UsersList, UserForm, DeleteUserButton };
