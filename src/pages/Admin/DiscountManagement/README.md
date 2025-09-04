# Discount Management Component

A comprehensive React component for managing discount codes in the booking care system. This component integrates with Redux for state management and provides a full CRUD interface for discount operations.

## Features

- ✅ **CRUD Operations**: Create, read, update, and delete discount codes
- ✅ **Redux Integration**: Full integration with Redux store using RTK Query
- ✅ **Real-time Filtering**: Search by code/name, filter by status and type
- ✅ **Form Validation**: Client-side validation with error handling
- ✅ **Responsive Design**: Mobile-friendly interface with Bootstrap styling
- ✅ **Loading States**: Proper loading indicators for all async operations
- ✅ **Error Handling**: Comprehensive error handling with user feedback
- ✅ **TypeScript Support**: Full TypeScript implementation with proper typing

## File Structure

```
src/pages/Admin/DiscountManagement/
├── DiscountManagement.tsx        # Main component file
├── DiscountManagement.module.scss # Styling
└── index.ts                      # Export file
```

## Usage

### Basic Usage

```tsx
import { DiscountManagement } from '@/pages/Admin';

function AdminPage() {
    return (
        <div>
            <DiscountManagement />
        </div>
    );
}
```

### Routes Setup

The component is accessible via the following routes:

- Admin Dashboard: `/admin`
- Discount Management: `/admin/discount-management`

## Redux Integration

### Actions Used

- `fetchDiscounts()` - Load all discounts with pagination
- `createDiscount(data)` - Create a new discount
- `updateDiscount(data)` - Update existing discount
- `deleteDiscount(id)` - Delete a discount
- `clearError()` - Clear error state
- `setFilters(filters)` - Set filter criteria

### State Structure

```typescript
interface DiscountState {
    discounts: Discount[];
    currentDiscount: Discount | null;
    loading: {
        discounts: boolean;
        create: boolean;
        update: boolean;
        delete: boolean;
    };
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
```

## API Integration

The component integrates with the following backend endpoints:

- `GET /discounts` - Fetch discounts with filtering
- `POST /discounts` - Create new discount
- `PUT /discounts/:id` - Update discount
- `DELETE /discounts/:id` - Delete discount

### Expected API Response Format

```typescript
// List Response
{
    success: true,
    data: {
        discounts: Discount[],
        pagination: {
            page: number,
            limit: number,
            total: number,
            totalPages: number
        }
    }
}

// Single Item Response
{
    success: true,
    data: Discount
}
```

## Form Fields

### Required Fields

- **Code**: Unique discount code (e.g., "SAVE20")
- **Name**: Display name for the discount
- **Discount Type**: Percentage or Fixed Amount
- **Amount**: Discount value
- **Start Date**: When discount becomes active
- **End Date**: When discount expires
- **Clinic ID**: Associated clinic identifier

### Optional Fields

- **Description**: Detailed description
- **Specialty ID**: For specialty-specific discounts
- **Doctor ID**: For doctor-specific discounts
- **Max Uses**: Usage limit (unlimited if not specified)

## Discount Types

- **Percentage**: Discount as percentage (0-100%)
- **Fixed Amount**: Discount as fixed dollar amount

## Applicable To Options

- **All Services**: Apply to all bookings
- **Specific Specialty**: Apply only to specific specialty
- **Specific Doctor**: Apply only to specific doctor

## Status Types

- **Active**: Currently usable
- **Inactive**: Temporarily disabled
- **Expired**: Past end date
- **Scheduled**: Not yet started

## Features in Detail

### 1. Search and Filtering

```tsx
// Real-time search
const filteredDiscounts = useMemo(() => {
    return discounts.filter((discount) => {
        const matchesSearch =
            discount.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            discount.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !statusFilter || discount.status === statusFilter;
        const matchesType = !typeFilter || discount.discountType === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });
}, [discounts, searchTerm, statusFilter, typeFilter]);
```

### 2. Form Validation

- Required field validation
- Date range validation (end date must be after start date)
- Amount validation (percentage must be 0-100%)
- Unique code validation (handled by backend)

### 3. Error Handling

```tsx
// Error display
{
    error && (
        <div className="alert alert-danger alert-dismissible">
            {error}
            <button
                type="button"
                className="btn-close"
                onClick={() => dispatch(clearError())}
            ></button>
        </div>
    );
}
```

### 4. Loading States

All async operations show proper loading indicators:

- Table loading spinner
- Button loading states with spinner
- Form submission loading

## Styling

The component uses SCSS modules for styling with the following features:

- **Responsive Design**: Mobile-first approach
- **Bootstrap Integration**: Leverages Bootstrap classes
- **Custom Theme**: Consistent color scheme
- **Animations**: Smooth transitions and hover effects
- **Dark Header**: Professional table styling

### Key CSS Classes

```scss
.discountManagement {
    // Main container styles

    .table {
        // Enhanced table styling
    }

    .badge {
        // Status badge styling
    }

    .modal-content {
        // Enhanced modal appearance
    }
}
```

## Best Practices Implemented

1. **TypeScript**: Full type safety with interfaces
2. **Error Boundaries**: Graceful error handling
3. **Loading States**: Better UX with loading indicators
4. **Memoization**: Performance optimization with useMemo
5. **Accessibility**: Proper ARIA labels and keyboard navigation
6. **Responsive**: Mobile-friendly design
7. **Clean Code**: Separation of concerns and reusable components

## Customization

### Adding New Fields

1. Update the `DiscountFormData` interface
2. Add form field to the modal
3. Update form validation
4. Modify the submit handler

### Styling Customization

Modify the SCSS variables in `DiscountManagement.module.scss`:

```scss
$primary-color: #007bff;
$success-color: #28a745;
$danger-color: #dc3545;
```

## Testing

The component can be tested by:

1. Starting the development server: `npm run dev`
2. Navigate to: `http://localhost:5173/admin/discount-management`
3. Test CRUD operations with the interface

## Dependencies

- React 18+
- Redux Toolkit
- React Router DOM
- Bootstrap 5
- SCSS support
- Font Awesome (for icons)

## Future Enhancements

- [ ] Bulk operations (select multiple discounts)
- [ ] Export functionality (CSV/Excel)
- [ ] Advanced filtering (date ranges, usage statistics)
- [ ] Discount templates
- [ ] Usage analytics dashboard
- [ ] Duplicate discount functionality
- [ ] Audit log for discount changes

## Contributing

When contributing to this component:

1. Follow TypeScript best practices
2. Maintain responsive design
3. Add proper error handling
4. Include loading states
5. Update documentation
6. Add appropriate tests

## License

This component is part of the Booking Care System and follows the project's licensing terms.
