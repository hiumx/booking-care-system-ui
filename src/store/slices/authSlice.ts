import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthService } from '@/services/auth.service';
import {
    AuthState,
    LoginRequest,
    RegisterRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
    GoogleLoginRequest,
    FacebookLoginRequest,
} from '@/types/auth.types';
import { getAllJwtInfo } from '@/utils/jwt';

// Helper function to validate roles for patient front-end
const validateRoles = (response: any, rejectWithValue: any) => {
    const token = response.data?.token;
    if (token) {
        // Get all JWT information (roles, confirmEmail, confirmPhone, hasExternalProvider)
        const jwtInfo = getAllJwtInfo(token);
        const roles = jwtInfo.roles.map((r) => r.toUpperCase());

        // For patient front-end, we only allow PATIENT role
        const hasPatientRole = roles.includes('PATIENT');
        if (!hasPatientRole) {
            return rejectWithValue(
                'Tài khoản của bạn không có quyền truy cập vào hệ thống bệnh nhân.'
            );
        }

        // Return all JWT information including token (Redux will persist automatically)
        return {
            roles,
            emailConfirmed: jwtInfo.emailConfirmed,
            phoneConfirmed: jwtInfo.phoneConfirmed,
            hasExternalProvider: jwtInfo.hasExternalProvider,
            accessToken: token,
        };
    }
    return null; // No error
};

// Helper function to handle validation result (DRY principle)
const handleValidationResult = (validationResult: any) => {
    if (validationResult?.roles) {
        return {
            roles: validationResult.roles,
            emailConfirmed: validationResult.emailConfirmed,
            phoneConfirmed: validationResult.phoneConfirmed,
            hasExternalProvider: validationResult.hasExternalProvider,
            accessToken: validationResult.accessToken || null,
        };
    }
    if (validationResult === null) {
        // No token found, return empty roles
        return {
            roles: [],
            emailConfirmed: false,
            phoneConfirmed: false,
            hasExternalProvider: false,
            accessToken: null,
        };
    }
    return validationResult; // This is the error case
};

// Initial state - Redux Persist will automatically restore roles and confirmation statuses
const initialState: AuthState = {
    roles: [],
    isAuthenticated: false,
    isLoading: false,
    error: null,
    emailConfirmed: false,
    phoneConfirmed: false,
    hasExternalProvider: false,
    accessToken: null,
};

// Async thunks
export const loginAsync = createAsyncThunk(
    'auth/login',
    async (credentials: LoginRequest, { rejectWithValue }) => {
        try {
            const response = await AuthService.login(credentials);

            // Validate roles using helper function
            const validationResult = validateRoles(response, rejectWithValue);
            return handleValidationResult(validationResult);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Login failed');
        }
    }
);

export const registerAsync = createAsyncThunk(
    'auth/register',
    async (request: RegisterRequest, { rejectWithValue }) => {
        try {
            const response = await AuthService.register(request);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Registration failed');
        }
    }
);

export const forgotPasswordAsync = createAsyncThunk(
    'auth/forgotPassword',
    async (request: ForgotPasswordRequest, { rejectWithValue }) => {
        try {
            const response = await AuthService.forgotPassword(request);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Forgot password request failed');
        }
    }
);

export const resetPasswordAsync = createAsyncThunk(
    'auth/resetPassword',
    async (request: ResetPasswordRequest, { rejectWithValue }) => {
        try {
            const response = await AuthService.resetPassword(request);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Password reset failed');
        }
    }
);

export const changePasswordAsync = createAsyncThunk(
    'auth/changePassword',
    async (request: ChangePasswordRequest, { rejectWithValue }) => {
        try {
            const response = await AuthService.changePassword(request);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Password change failed');
        }
    }
);

export const logoutAsync = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        await AuthService.logout();
        AuthService.clearAuthData();
        return true;
    } catch (error: any) {
        // Clear auth data even if API call fails
        AuthService.clearAuthData();
        return rejectWithValue(error.message || 'Logout failed');
    }
});

export const googleLoginAsync = createAsyncThunk(
    'auth/googleLogin',
    async (request: GoogleLoginRequest, { rejectWithValue }) => {
        try {
            const response = await AuthService.googleLogin(request);

            // Validate roles using helper function
            const validationResult = validateRoles(response, rejectWithValue);
            return handleValidationResult(validationResult);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Google login failed');
        }
    }
);

export const facebookLoginAsync = createAsyncThunk(
    'auth/facebookLogin',
    async (request: FacebookLoginRequest, { rejectWithValue }) => {
        try {
            const response = await AuthService.facebookLogin(request);

            // Validate roles using helper function
            const validationResult = validateRoles(response, rejectWithValue);
            return handleValidationResult(validationResult);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Facebook login failed');
        }
    }
);

// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetAuthState: (state) => {
            // Reset to initial state (used for force logout)
            state.roles = [];
            state.isAuthenticated = false;
            state.isLoading = false;
            state.error = null;
            state.emailConfirmed = false;
            state.phoneConfirmed = false;
            state.hasExternalProvider = false;
            state.accessToken = null;
        },
        updateAccessToken: (state, action) => {
            // Update access token after refresh (used by axios interceptor)
            state.accessToken = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.roles = action.payload?.roles || [];
                state.emailConfirmed = action.payload?.emailConfirmed || false;
                state.phoneConfirmed = action.payload?.phoneConfirmed || false;
                state.hasExternalProvider = action.payload?.hasExternalProvider || false;
                state.accessToken = action.payload?.accessToken || null;
                state.isAuthenticated = state.roles.length > 0;
                state.error = null;
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Register cases
            .addCase(registerAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerAsync.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(registerAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Forgot password cases
            .addCase(forgotPasswordAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(forgotPasswordAsync.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(forgotPasswordAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Reset password cases
            .addCase(resetPasswordAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(resetPasswordAsync.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(resetPasswordAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Change password cases
            .addCase(changePasswordAsync.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(changePasswordAsync.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(changePasswordAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Logout cases
            .addCase(logoutAsync.fulfilled, (state) => {
                state.roles = [];
                state.isAuthenticated = false;
                state.error = null;
                state.isLoading = false;
                state.accessToken = null;
            })
            // Google login cases
            .addCase(googleLoginAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(googleLoginAsync.fulfilled, (state, action) => {
                state.roles = action.payload?.roles || [];
                state.emailConfirmed = action.payload?.emailConfirmed || false;
                state.phoneConfirmed = action.payload?.phoneConfirmed || false;
                state.hasExternalProvider = action.payload?.hasExternalProvider || false;
                state.accessToken = action.payload?.accessToken || null;
                state.isAuthenticated = state.roles.length > 0;
                state.error = null;
            })
            .addCase(googleLoginAsync.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            // Facebook login cases
            .addCase(facebookLoginAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(facebookLoginAsync.fulfilled, (state, action) => {
                state.roles = action.payload?.roles || [];
                state.emailConfirmed = action.payload?.emailConfirmed || false;
                state.phoneConfirmed = action.payload?.phoneConfirmed || false;
                state.hasExternalProvider = action.payload?.hasExternalProvider || false;
                state.accessToken = action.payload?.accessToken || null;
                state.isAuthenticated = state.roles.length > 0;
                state.error = null;
            })
            .addCase(facebookLoginAsync.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { clearError, resetAuthState, updateAccessToken } = authSlice.actions;

export default authSlice.reducer;
