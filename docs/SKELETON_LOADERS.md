# Skeleton Loaders

## Overview
Skeleton loaders improve perceived performance by showing placeholder content while actual data is loading. This creates a smoother user experience and reduces perceived wait times.

## Available Skeleton Components

### Dashboard Skeletons
Located in `src/components/skeletons/DashboardSkeleton.tsx`

- **`DashboardMetricSkeleton`**: For metric cards with icon, title, value, and description
- **`DashboardChartSkeleton`**: For chart cards with header and chart area
- **`FieldCardSkeleton`**: For field management cards

```tsx
import { DashboardMetricSkeleton, DashboardChartSkeleton } from '@/components/skeletons/DashboardSkeleton';

// Usage
<div className="grid grid-cols-4 gap-4">
  {[1, 2, 3, 4].map((i) => (
    <DashboardMetricSkeleton key={i} />
  ))}
</div>
```

### Task List Skeletons
Located in `src/components/skeletons/TaskListSkeleton.tsx`

- **`TaskCardSkeleton`**: Single task card placeholder
- **`TaskListSkeleton`**: Complete task list with multiple cards

```tsx
import { TaskListSkeleton } from '@/components/skeletons/TaskListSkeleton';

// Usage
{isLoading ? <TaskListSkeleton /> : <TaskList tasks={tasks} />}
```

### Table Skeletons
Located in `src/components/skeletons/TableSkeleton.tsx`

- **`TableSkeleton`**: Customizable table skeleton with rows/columns
- **`CardTableSkeleton`**: Table wrapped in a card with header

```tsx
import { CardTableSkeleton, TableSkeleton } from '@/components/skeletons/TableSkeleton';

// Usage with custom props
<CardTableSkeleton rows={5} />
<TableSkeleton rows={10} columns={5} showHeader={true} />
```

### Form Skeletons
Located in `src/components/skeletons/FormSkeleton.tsx`

- **`FormFieldSkeleton`**: Single form field placeholder
- **`FormSkeleton`**: Complete form with multiple fields and buttons

```tsx
import { FormSkeleton } from '@/components/skeletons/FormSkeleton';

// Usage
<FormSkeleton fields={6} showHeader={true} />
```

### List Skeletons
Located in `src/components/skeletons/ListSkeleton.tsx`

- **`ListItemSkeleton`**: Single list item with optional avatar
- **`ListSkeleton`**: Complete list with multiple items

```tsx
import { ListSkeleton } from '@/components/skeletons/ListSkeleton';

// Usage
<ListSkeleton items={5} showAvatar={true} />
```

## Implementation Pattern

### Basic Pattern
```tsx
import { SomeDataSkeleton } from '@/components/skeletons';

const MyComponent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  if (isLoading) {
    return <SomeDataSkeleton />;
  }

  return <ActualDataComponent data={data} />;
};
```

### With Multiple Skeletons
```tsx
if (isLoading) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <DashboardMetricSkeleton key={i} />
        ))}
      </div>
      <CardTableSkeleton rows={5} />
    </div>
  );
}
```

## Components Using Skeleton Loaders

### Currently Implemented
- ✅ `CarbonCreditDashboard` - Dashboard metrics and table
- ✅ `UsageDashboard` - Form and table skeletons
- ✅ `SmartReportSummary` - Content skeletons
- ✅ `AICropRecommendations` - Recommendation cards
- ✅ `TaskManager` - Task list skeleton

### Lazy Loading Fallbacks
The following components already have specialized loading fallbacks in `src/utils/lazyLoad.tsx`:
- `MapLoadingFallback` - For map components
- `ChartLoadingFallback` - For chart components
- `CardLoadingFallback` - Generic card loading
- `DashboardLoadingFallback` - Full dashboard layout

## Best Practices

### 1. Match Content Structure
Skeleton loaders should closely match the structure of the actual content:
```tsx
// Good - matches actual content structure
<div className="space-y-3">
  <Skeleton className="h-6 w-32" />  {/* Title */}
  <Skeleton className="h-4 w-full" /> {/* Description */}
</div>
```

### 2. Use Appropriate Sizes
Match skeleton dimensions to actual content:
- Headers: `h-6` to `h-8`
- Body text: `h-4`
- Buttons: `h-10`
- Icons: `h-4 w-4` or `h-5 w-5`

### 3. Provide Visual Hierarchy
Use varying widths to create realistic content patterns:
```tsx
<Skeleton className="h-4 w-full" />
<Skeleton className="h-4 w-5/6" />
<Skeleton className="h-4 w-4/6" />
```

### 4. Reasonable Loading Time
Show skeletons for at least 200ms to avoid flashing content:
```tsx
useEffect(() => {
  const timer = setTimeout(() => {
    setMinLoadTime(true);
  }, 200);
  
  return () => clearTimeout(timer);
}, []);

if (!minLoadTime || isLoading) {
  return <Skeleton />;
}
```

### 5. Accessibility
Skeletons are visual indicators only. Ensure screen readers get appropriate loading states:
```tsx
<div role="status" aria-live="polite" aria-label="Loading content">
  <SkeletonComponent />
</div>
```

## Design System Integration

All skeleton components use the design system's semantic tokens:
- Background: `bg-muted` (from design system)
- Animation: `animate-pulse` (built-in Tailwind)
- Border radius: Matches actual components (`rounded-md`, `rounded-lg`)

## Performance Impact

### Before Skeleton Loaders
- Empty states or spinners during data fetch
- Sudden content appearance (layout shift)
- Poor perceived performance

### After Skeleton Loaders  
- Smooth content transitions
- Reduced perceived wait time
- Better user experience
- Minimal layout shift

## Creating New Skeletons

When creating a new skeleton component:

1. **Analyze the component structure**
   ```tsx
   // Original component
   <Card>
     <CardHeader>
       <CardTitle>Title</CardTitle>
       <CardDescription>Description</CardDescription>
     </CardHeader>
     <CardContent>
       {/* Content */}
     </CardContent>
   </Card>
   ```

2. **Create matching skeleton**
   ```tsx
   export const MyComponentSkeleton = () => (
     <Card>
       <CardHeader>
         <Skeleton className="h-6 w-48" />
         <Skeleton className="h-4 w-64 mt-2" />
       </CardHeader>
       <CardContent>
         <Skeleton className="h-32 w-full" />
       </CardContent>
     </Card>
   );
   ```

3. **Export from index**
   ```tsx
   // src/components/skeletons/index.ts
   export * from './MyComponentSkeleton';
   ```

## Future Enhancements

- [ ] Add shimmer effect option for more visual feedback
- [ ] Create skeleton variants for different content densities
- [ ] Add dark mode optimized skeletons
- [ ] Implement progressive loading (load different sections at different times)
- [ ] Add skeleton presets for common patterns
