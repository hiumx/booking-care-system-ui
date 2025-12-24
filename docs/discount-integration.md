# Discount Service & Redux Integration Documentation

## Overview

This documentation provides a comprehensive guide on using the discount service and Redux state management for handling discount-related operations in the booking care system.

## Setup Complete ✅

The following components have been successfully implemented:

1. **Discount Types** (`src/types/discount.types.ts`)
2. **Discount Service** (`src/services/discount.service.tsx`)
3. **Redux Discount Slice** (`src/store/slices/discountSlice.ts`)
4. **Redux Discount Selectors** (`src/store/selectors/discountSelectors.ts`)
5. **Store Integration** (updated `src/store/index.ts`)

## Core Features

### 1. Discount Service Operations

```typescript
import { DiscountService } from '../services/discount.service';

// Get all discounts with filtering
const discounts = await DiscountService.getDiscounts({
    status: 'ACTIVE',
    clinicId: 1,
    page: 1,
    limit: 10,
});

// Get discount by ID
const discount = await DiscountService.getDiscountById(123);

// Get discount by code
const discount = await DiscountService.getDiscountByCode('SAVE20');

// Create new discount
const newDiscount = await DiscountService.createDiscount({
    code: 'WELCOME10',
    name: 'Welcome Discount',
    description: '10% off for new patients',
    discountType: 'PERCENTAGE',
    amount: 10,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    clinicId: 1,
});

// Update discount
const updatedDiscount = await DiscountService.updateDiscount({
    id: 123,
    amount: 15, // Update to 15%
});

// Delete discount
await DiscountService.deleteDiscount(123);

// Validate discount code
const validation = await DiscountService.validateDiscount('SAVE20', {
    clinicId: 1,
    amount: 100000,
});

// Apply discount
const result = await DiscountService.applyDiscount({
    code: 'SAVE20',
    originalAmount: 100000,
    clinicId: 1,
});
```

### 2. Redux Integration

```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  fetchDiscounts,
  validateDiscountCode,
  applyDiscountCode,
  createDiscount
} from '../store/slices/discountSlice';
import {
  selectDiscounts,
  selectDiscountLoading,
  selectValidDiscounts,
  selectAppliedDiscount
} from '../store/selectors/discountSelectors';

function DiscountComponent() {
  const dispatch = useAppDispatch();

  // Select data from store
  const discounts = useAppSelector(selectDiscounts);
  const loading = useAppSelector(selectDiscountLoading);
  const validDiscounts = useAppSelector(selectValidDiscounts);
  const appliedDiscount = useAppSelector(selectAppliedDiscount);

  // Load discounts
  useEffect(() => {
    dispatch(fetchDiscounts({ status: 'ACTIVE' }));
  }, [dispatch]);

  // Validate discount code
  const handleValidate = async (code: string) => {
    await dispatch(validateDiscountCode({
      code,
      context: {
        clinicId: 1,
        amount: 100000
      }
    }));
  };

  // Apply discount
  const handleApply = async (code: string) => {
    await dispatch(applyDiscountCode({
      code,
      originalAmount: 100000,
      clinicId: 1
    }));
  };

  return (
    <div>
      {loading.discounts && <div>Loading...</div>}
      {discounts.map(discount => (
        <div key={discount.id}>
          <h3>{discount.name}</h3>
          <p>{discount.description}</p>
          <button onClick={() => handleApply(discount.code)}>
            Apply Discount
          </button>
        </div>
      ))}
      {appliedDiscount && (
        <div>
          Applied: {appliedDiscount.code} -
          Savings: {appliedDiscount.validationResult.appliedAmount}
        </div>
      )}
    </div>
  );
}
```

### 3. Available Selectors

```typescript
// Basic selectors
selectDiscounts; // All discounts
selectCurrentDiscount; // Currently selected discount
selectDiscountLoading; // Loading states
selectDiscountError; // Error state
selectAppliedDiscount; // Currently applied discount

// Filtered selectors
selectActiveDiscounts; // Only active discounts
selectValidDiscounts; // Valid and active discounts
selectExpiredDiscounts; // Expired discounts

// Context-specific selectors
selectDiscountsByClinic(clinicId);
selectDiscountsBySpecialty(specialtyId);
selectDiscountsByDoctor(doctorId);
selectAvailableDiscountsForContext({
    clinicId: 1,
    specialtyId: 2,
    doctorId: 3,
});

// Utility selectors
selectDiscountByCode(code);
selectDiscountById(id);
selectHighValueDiscounts; // High-value discounts
selectSortedDiscounts(sortBy, sortOrder);
selectDiscountStatsCalculated;
```

### 4. Async Actions

```typescript
// Available async thunks
fetchDiscounts(params?)
fetchDiscountById(id)
fetchDiscountByCode(code)
createDiscount(discountData)
updateDiscount(discountData)
deleteDiscount(id)
validateDiscountCode({ code, context })
applyDiscountCode(request)
fetchDiscountStats(filters?)
bulkUpdateDiscountStatus({ discountIds, status })
bulkDeleteDiscounts(discountIds)
fetchActiveDiscounts(context)
checkDiscountAvailability(code)
```

### 5. State Management Actions

```typescript
// Synchronous actions
clearError(); // Clear error state
setFilters(filters); // Set query filters
clearFilters(); // Clear all filters
setCurrentDiscount(discount); // Set current discount
clearCurrentDiscount(); // Clear current discount
clearValidationResult(); // Clear validation result
setAppliedDiscount(data); // Set applied discount
clearAppliedDiscount(); // Clear applied discount
updateDiscountInList(discount); // Update discount in list
removeDiscountFromList(id); // Remove discount from list
addDiscountToList(discount); // Add discount to list
```

## Usage Examples

### Basic Discount Listing

```typescript
function DiscountList() {
  const dispatch = useAppDispatch();
  const discounts = useAppSelector(selectDiscounts);
  const loading = useAppSelector(state => state.discount.loading.discounts);

  useEffect(() => {
    dispatch(fetchDiscounts());
  }, [dispatch]);

  if (loading) return <div>Loading discounts...</div>;

  return (
    <div>
      {discounts.map(discount => (
        <div key={discount.id}>
          <h3>{discount.code} - {discount.name}</h3>
          <p>
            {discount.discountType === 'PERCENTAGE'
              ? `${discount.amount}%`
              : `${discount.amount.toLocaleString()} VND`
            }
          </p>
          <span>Status: {discount.status}</span>
        </div>
      ))}
    </div>
  );
}
```

### Discount Validation Form

```typescript
function DiscountValidator() {
  const dispatch = useAppDispatch();
  const [code, setCode] = useState('');
  const validationResult = useAppSelector(selectDiscountValidationResult);
  const loading = useAppSelector(state => state.discount.loading.validation);

  const handleValidate = async () => {
    await dispatch(validateDiscountCode({
      code,
      context: {
        clinicId: 1,
        amount: 100000 // Example amount
      }
    }));
  };

  return (
    <div>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter discount code"
      />
      <button onClick={handleValidate} disabled={loading}>
        {loading ? 'Validating...' : 'Validate'}
      </button>

      {validationResult && (
        <div>
          <p>Valid: {validationResult.isValid ? 'Yes' : 'No'}</p>
          {validationResult.isValid && (
            <div>
              <p>Applied Amount: {validationResult.appliedAmount}</p>
              <p>Final Amount: {validationResult.finalAmount}</p>
            </div>
          )}
          {validationResult.message && <p>{validationResult.message}</p>}
        </div>
      )}
    </div>
  );
}
```

### Context-Aware Discount Selection

```typescript
function ContextDiscounts({ clinicId, specialtyId, doctorId }) {
  const availableDiscounts = useAppSelector(state =>
    selectAvailableDiscountsForContext(state, {
      clinicId,
      specialtyId,
      doctorId
    })
  );

  return (
    <div>
      <h3>Available Discounts</h3>
      {availableDiscounts.map(discount => (
        <div key={discount.id}>
          <strong>{discount.code}</strong> - {discount.name}
          <p>
            Save {discount.discountType === 'PERCENTAGE'
              ? `${discount.amount}%`
              : `${discount.amount.toLocaleString()} VND`
            }
          </p>
        </div>
      ))}
    </div>
  );
}
```

## Error Handling

```typescript
function ErrorHandlingExample() {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectDiscountError);

  const handleCreateDiscount = async (discountData) => {
    try {
      await dispatch(createDiscount(discountData)).unwrap();
      // Success handling
    } catch (error) {
      // Error is automatically stored in Redux state
      console.error('Failed to create discount:', error);
    }
  };

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <div>
      {error && (
        <div className="error">
          {error}
          <button onClick={() => dispatch(clearError())}>
            Dismiss
          </button>
        </div>
      )}
      {/* Rest of component */}
    </div>
  );
}
```

## TypeScript Integration

All types are fully typed for TypeScript support:

```typescript
import type {
    Discount,
    CreateDiscountRequest,
    UpdateDiscountRequest,
    DiscountQueryParams,
    DiscountValidationResult,
    DiscountResponse,
    DiscountListResponse,
    DiscountUsageStats,
    ApplyDiscountRequest,
} from '../types/discount.types';

// All Redux actions and selectors are fully typed
// No need for manual type assertions
```

## Performance Optimizations

1. **Memoized Selectors**: All selectors use `createSelector` for memoization
2. **Selective Persistence**: Discount state is not persisted to localStorage (fresh data on reload)
3. **Efficient Updates**: Redux Toolkit handles immutable updates efficiently
4. **Request Deduplication**: Axios interceptors handle request deduplication

## API Integration

The service integrates with the backend API endpoints:

- `GET /discounts` - List discounts with filtering
- `GET /discounts/:id` - Get discount by ID
- `GET /discounts/code/:code` - Get discount by code
- `POST /discounts` - Create discount
- `PUT /discounts/:id` - Update discount
- `DELETE /discounts/:id` - Delete discount
- `POST /discounts/validate` - Validate discount code
- `POST /discounts/apply` - Apply discount
- `GET /discounts/stats` - Get usage statistics
- `PATCH /discounts/bulk/status` - Bulk update status
- `DELETE /discounts/bulk/delete` - Bulk delete

## Summary

✅ **Complete discount management system implemented**:

- Type-safe service layer with comprehensive API operations
- Full Redux integration with async actions and selectors
- Error handling and loading states
- Filtering, pagination, and search capabilities
- Validation and application of discount codes
- Bulk operations support
- Context-aware discount selection
- Usage statistics and analytics

The system is ready for production use and provides a solid foundation for discount management in the booking care application.
