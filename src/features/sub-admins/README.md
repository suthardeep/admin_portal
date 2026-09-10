# Sub-Admins Feature

This feature has been refactored to use Zod schemas for form validation, following the patterns established in the login feature.

## Structure

```
src/features/sub-admins/
├── schemas/
│   ├── createAdmin.schema.ts    # Zod schemas for admin creation
│   └── index.ts                 # Schema exports
├── list/
│   ├── types/
│   │   └── subAdmin.d.ts        # TypeScript interfaces (updated to use Zod types)
│   └── pages/
│       └── create-admin/
│           └── CreateAdminForm.tsx  # Refactored form component
├── examples/
│   └── CreateAdminExample.tsx   # Usage example
└── README.md                    # This file
```

## Key Improvements

### 1. Zod Schema Validation
- **Comprehensive validation**: Email format, name patterns, role validation
- **Real-time validation**: Field validation on blur
- **Type safety**: Automatic TypeScript type inference from schemas

### 2. Better Error Handling
- **Detailed error messages**: Specific validation messages for each field
- **Field-level errors**: Individual field validation with immediate feedback
- **Consistent error format**: Following the same pattern as login form

### 3. Type Safety
- **Zod-inferred types**: Types automatically generated from schemas
- **No manual type definitions**: Reduces type mismatches and maintenance
- **Backward compatibility**: Existing interfaces still work

## Usage

### Basic Usage

```tsx
import { CreateAdminForm } from "./list/pages/create-admin/CreateAdminForm";
import { CreateAdminFormData } from "./schemas";

const MyComponent = () => {
  const handleSubmit = (data: CreateAdminFormData) => {
    // Data is fully validated and type-safe
    console.log(data);
  };

  return (
    <CreateAdminForm
      onSubmit={handleSubmit}
      roleOptions={[
        { label: "Finance", value: "finance" },
        { label: "HR", value: "hr" },
        { label: "Operations", value: "operations" },
        { label: "IT", value: "it" },
      ]}
    />
  );
};
```

### Schema Validation

```tsx
import { CreateAdminSchema } from "./schemas";

// Validate data manually
const result = CreateAdminSchema.safeParse(formData);
if (result.success) {
  // Data is valid
  console.log(result.data);
} else {
  // Handle validation errors
  console.log(result.error.issues);
}
```

### Individual Field Validation

```tsx
import { AdminFieldSchemas } from "./schemas";

// Validate individual fields
const emailResult = AdminFieldSchemas.email.safeParse("test@example.com");
```

## Schema Details

### CreateAdminSchema

- **profilePicture**: Required, array of media items (exactly 1)
- **firstName**: Required, 2-50 characters, letters and spaces only
- **lastName**: Required, 2-50 characters, letters and spaces only
- **email**: Required, valid email format, max 100 characters
- **role**: Required, must be one of: finance, hr, operations, it
- **allowSensitiveInfo**: Boolean, defaults to true

### Validation Rules

- **Names**: Must contain only letters and spaces, 2-50 characters
- **Email**: Standard email validation with length limit
- **Role**: Enum validation with predefined options
- **Profile Picture**: Required, exactly 1 file must be uploaded

## Migration Notes

If you're updating existing code:

1. **Import changes**: Use `CreateAdminFormData` instead of `AdminFormData`
2. **Validation**: Remove manual validation logic, Zod handles it
3. **Error handling**: Use the new error format from Zod validation
4. **Types**: Import types from `schemas` instead of defining manually

## Examples

See `examples/CreateAdminExample.tsx` for a complete working example.