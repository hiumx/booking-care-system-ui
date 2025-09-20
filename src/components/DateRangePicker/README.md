# DateRangePicker Component

A comprehensive date range picker component built with `react-date-range` library, designed to integrate seamlessly with the Booking Care System UI.

## Features

- 📅 **Intuitive Date Range Selection**: Easy-to-use interface for selecting date ranges
- 🎨 **Customizable Appearance**: Supports custom colors, themes, and styling
- 📱 **Responsive Design**: Mobile-friendly with adaptive layout
- ♿ **Accessibility**: Full keyboard navigation and screen reader support
- 🌙 **Dark Mode**: Built-in dark theme support
- 🔧 **Highly Configurable**: Multiple options for customization
- 🎯 **TypeScript Support**: Full type safety with comprehensive prop types

## Installation

The component requires `react-date-range` and `@types/react-date-range`:

```bash
npm install react-date-range @types/react-date-range
```

## Basic Usage

```tsx
import React, { useState } from 'react';
import { RangeKeyDict } from 'react-date-range';
import DateRangePicker from '@/components/DateRangePicker';

const MyComponet: React.FC = () => {
    const [ranges, setRanges] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        },
    ]);

    const handleRangeChange = (rangesByKey: RangeKeyDict) => {
        const selection = rangesByKey.selection;
        if (selection && selection.startDate && selection.endDate && selection.key) {
            setRanges([
                {
                    startDate: selection.startDate,
                    endDate: selection.endDate,
                    key: selection.key,
                },
            ]);
        }
    };

    return (
        <DateRangePicker
            ranges={ranges}
            onChange={handleRangeChange}
            placeholder="Select your date range"
        />
    );
};
```

## Props

| Prop                      | Type                             | Default                                                              | Description                                  |
| ------------------------- | -------------------------------- | -------------------------------------------------------------------- | -------------------------------------------- |
| `ranges`                  | `Range[]`                        | `[{ startDate: new Date(), endDate: new Date(), key: 'selection' }]` | Initial date range selection                 |
| `onChange`                | `(ranges: RangeKeyDict) => void` | `undefined`                                                          | Callback when date range changes             |
| `isOpen`                  | `boolean`                        | `false`                                                              | Show/hide the date range picker (controlled) |
| `onToggle`                | `(isOpen: boolean) => void`      | `undefined`                                                          | Callback when picker is opened/closed        |
| `placeholder`             | `string`                         | `'Select date range'`                                                | Placeholder text for the trigger input       |
| `className`               | `string`                         | `undefined`                                                          | Additional CSS classes                       |
| `disabled`                | `boolean`                        | `false`                                                              | Disable the date range picker                |
| `showMonthAndYearPickers` | `boolean`                        | `true`                                                               | Show month and year dropdown pickers         |
| `months`                  | `number`                         | `2`                                                                  | Number of months to display                  |
| `direction`               | `'vertical' \| 'horizontal'`     | `'horizontal'`                                                       | Direction of calendar display                |
| `minDate`                 | `Date`                           | `undefined`                                                          | Minimum selectable date                      |
| `maxDate`                 | `Date`                           | `undefined`                                                          | Maximum selectable date                      |
| `rangeColors`             | `string[]`                       | `['#3d91ff']`                                                        | Color for selected date range                |
| `showDateDisplay`         | `boolean`                        | `true`                                                               | Show date display row                        |

## Examples

### Controlled Component

```tsx
const [isOpen, setIsOpen] = useState(false);

<DateRangePicker
    ranges={ranges}
    onChange={handleRangeChange}
    isOpen={isOpen}
    onToggle={setIsOpen}
    placeholder="Controlled date range picker"
/>;
```

### Custom Configuration

```tsx
<DateRangePicker
    ranges={ranges}
    onChange={handleRangeChange}
    months={1}
    direction="vertical"
    rangeColors={['#00b894']}
    placeholder="Custom configured picker"
/>
```

### With Date Limits

```tsx
<DateRangePicker
    ranges={ranges}
    onChange={handleRangeChange}
    minDate={new Date()}
    maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)} // 90 days from now
    placeholder="Pick dates within 90 days"
/>
```

### Disabled State

```tsx
<DateRangePicker
    ranges={ranges}
    onChange={handleRangeChange}
    disabled={true}
    placeholder="This picker is disabled"
/>
```

## Styling

The component uses SCSS modules for styling. You can customize the appearance by:

1. **Using CSS custom properties**:

    ```css
    .dateRangePicker {
        --primary-color: #your-color;
        --border-color: #your-border-color;
    }
    ```

2. **Overriding SCSS variables**:

    ```scss
    .dateRangePicker {
        .trigger {
            border-color: your-color;
        }
    }
    ```

3. **Using className prop**:
    ```tsx
    <DateRangePicker
        className="my-custom-picker"
        // ... other props
    />
    ```

## Responsive Behavior

- **Desktop**: Full-width dropdown with side-by-side months
- **Tablet**: Adapted layout with smaller spacing
- **Mobile**: Full-screen modal with vertical month layout

## Accessibility

The component includes comprehensive accessibility features:

- **Keyboard Navigation**: Full keyboard support with Tab, Enter, and Space keys
- **ARIA Labels**: Proper ARIA attributes for screen readers
- **Focus Management**: Clear focus indicators and logical tab order
- **Screen Reader Support**: Descriptive labels and state announcements

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- `react-date-range`: ^2.0.1
- `@types/react-date-range`: For TypeScript support
- `date-fns`: ^4.1.0 (peer dependency)

## Notes

- The component automatically imports required CSS from `react-date-range`
- Date operations use `date-fns` for consistency with the project
- Component follows the project's naming conventions and file structure
- Supports both controlled and uncontrolled usage patterns
