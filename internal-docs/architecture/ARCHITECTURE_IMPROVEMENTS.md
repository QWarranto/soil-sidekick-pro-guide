# Architecture Improvements & Technical Debt

> **⚠️ SUPERSEDED**: This document has been consolidated into [COMPREHENSIVE_IMPLEMENTATION_GUIDE.md](./COMPREHENSIVE_IMPLEMENTATION_GUIDE.md)  
> **Action Required**: Use the comprehensive guide for all implementation planning  
> **Status**: This file is kept for historical reference only

---

## Overview

This document tracks identified weaknesses and areas for improvement in the SoilSidekick Pro architecture. All content has been reorganized, prioritized, and merged into the comprehensive implementation guide.

**For implementation planning, see:** [COMPREHENSIVE_IMPLEMENTATION_GUIDE.md](./COMPREHENSIVE_IMPLEMENTATION_GUIDE.md)

---

## Original Content (Historical Reference)

The following sections are preserved for reference but should not be used for planning:

---

## Backend Architecture Weaknesses

### 1. Database Complexity (High Priority)

**Issue**: Excessive number of overlapping tables for similar purposes increases maintenance burden and API surface area.

**Specific Concerns**:
- Multiple audit/logging tables serve overlapping purposes:
  - `auth_security_log`
  - `security_audit_log`
  - `comprehensive_audit_log`
  - `compliance_audit_log`
  - `api_key_access_log`
- Usage tracking is fragmented across:
  - `usage_analytics`
  - `subscription_usages`
  - `geo_consumption_analytics`
  - `cost_tracking`

**Impact**: 
- Increased complexity for MVP
- Higher maintenance costs
- More API endpoints to secure and test
- Potential for inconsistent logging across tables

**Recommended Future Action**:
- Consolidate audit tables into 2-3 focused tables based on distinct use cases
- Merge usage tracking tables where data models overlap
- Consider a single unified event log with discriminator columns

---

### 2. Data Integrity & JSON Column Validation (High Priority)

**Issue**: Heavy reliance on `jsonb` columns shifts validation responsibility entirely to application layer, creating risk of corrupt data states.

**Specific Concerns**:
- Critical data stored in JSON columns lacks database-level validation:
  - `usage_pattern` in `geo_consumption_analytics`
  - `metadata` in multiple tables
  - `permissions` in `api_keys`
  - `zones` in `prescription_maps`
  - `boundary_coordinates` in `fields`
- No schema enforcement at database level
- Application-layer validation can be bypassed or have bugs

**Impact**:
- Risk of corrupt/malformed data in production
- Difficult to query and aggregate JSON data efficiently
- Schema evolution requires application updates rather than migrations
- Cannot leverage Postgres constraints for data quality

**Recommended Future Action**:
- Add Postgres JSON Schema validation using check constraints
- Create database triggers to validate JSON structure on insert/update
- Convert predictable JSON structures to typed columns (normalize where appropriate)
- Document required JSON schemas in migration comments
- Consider using Postgres generated columns to extract commonly-queried JSON fields

---

## Frontend Architecture Weaknesses

### 3. Routing Architecture (High Priority)

**Issue**: Manual state-based routing in `App.tsx` instead of proper routing library (React Router is installed but not fully utilized).

**Specific Concerns**:
- Current implementation: `const [currentRoute, setCurrentRoute] = useState(...)`
- Browser "Back" button is broken - doesn't navigate between pages
- Deep-linking is impossible - can't share URLs to specific pages/tasks
- Page state resets on browser refresh
- No URL parameters support (e.g., `/tasks/123`)

**Impact**:
- Poor user experience with broken browser navigation
- Can't bookmark or share specific pages
- SEO implications - all pages appear as single route
- State management complexity increases
- Analytics can't track page views accurately

**Recommended Future Action**:
- Migrate to React Router's `BrowserRouter` with proper `<Route>` components
- Replace all `setCurrentRoute()` calls with `navigate()` from React Router
- Add route parameters for resource IDs (`/tasks/:id`, `/fields/:id`)
- Implement proper 404 handling
- Add route guards for authentication-required pages

---

### 4. Feature Utilization Gap (Medium Priority)

**Issue**: Frontend only implements a fraction of backend capabilities, leaving robust features unused.

**Specific Concerns**:
- No UI for security features:
  - Account security settings (`account_security` table)
  - Security audit logs (`auth_security_log`, `security_audit_log`)
  - API key management (`api_keys` table)
- No compliance monitoring interface:
  - Compliance audit log viewing (`compliance_audit_log`)
  - SOC2 compliance checks (`soc2_compliance_checks`)
- No cost management dashboard:
  - Cost tracking analytics (`cost_tracking`)
  - Cost alerts configuration (`cost_alerts`)
  - Usage analytics visualization (`usage_analytics`)
- Missing admin interfaces for monitoring and management

**Impact**:
- Wasted backend development effort
- Users can't leverage advanced features they're paying for
- Admin team lacks visibility into system health
- Security monitoring capabilities unused
- Cost overruns go unnoticed without alerts interface

**Recommended Future Action**:
- Build admin dashboard for security/compliance monitoring
- Create user-facing settings page for account security
- Implement cost tracking dashboard with alerts
- Add API key management interface for Enterprise users
- Prioritize features based on subscription tier value

---

### 5. CRUD Operation Gaps (High Priority)

**Issue**: Current UI is largely read-only, missing create/update/delete operations despite backend support.

**Specific Concerns**:
- No forms for creating resources:
  - Add new fields (`fields` table has Insert types defined)
  - Create task templates
  - Add soil analyses
  - Configure integrations
- No update operations:
  - Edit field boundaries
  - Update task statuses
  - Modify user preferences
  - Change subscription settings
- No delete functionality for user-created resources
- Backend Insert/Update types in `types.ts` are unused

**Impact**:
- Users cannot fully manage their data
- Requires manual database operations for basic tasks
- Poor user experience - feels incomplete
- Backend validation logic untested
- Type safety benefits of Supabase schema wasted

**Recommended Future Action**:
- Audit all tables with user-owned data
- Build CRUD forms using React Hook Form + Zod validation
- Implement optimistic updates with TanStack Query
- Add confirmation dialogs for destructive operations
- Create reusable form components for common patterns
- Test Insert/Update type validation end-to-end

---

## Additional Weaknesses

_[Reserved for additional architectural concerns to be documented]_

---

## Recommended Implementation Roadmap

To align the frontend with the sophisticated backend architecture, the following implementation sequence is recommended:

### Phase 1: Foundation (High Priority - 🔴)

#### 1.1 Adopt Proper Routing Architecture
**Current State**: Manual state-based routing in `App.tsx` with `useState`  
**Target State**: Full React Router implementation with `BrowserRouter`

**Implementation Steps**:
```typescript
// Replace manual routing in App.tsx with:
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Define routes with proper nesting and parameters
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/tasks" element={<TaskManager />} />
    <Route path="/tasks/:id" element={<TaskDetail />} />
    <Route path="/fields/:id" element={<FieldDetail />} />
    <Route path="/pricing" element={<Pricing />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

**Benefits**:
- Fixes browser back button
- Enables deep linking and bookmarking
- Preserves state across refreshes
- Improves SEO with proper URLs
- Better analytics tracking

---

#### 1.2 Implement Real Data Fetching Layer
**Current State**: Mock data in `mockData.ts`  
**Target State**: Supabase client with React Query for data management

**Implementation Steps**:
```typescript
// 1. Set up React Query provider in main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

// 2. Create data fetching hooks
// src/hooks/useFields.tsx
export const useFields = () => {
  return useQuery({
    queryKey: ['fields'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

// 3. Create mutation hooks for CRUD operations
export const useCreateField = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newField: FieldInsert) => {
      const { data, error } = await supabase
        .from('fields')
        .insert(newField)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
      toast.success('Field created successfully');
    },
  });
};
```

**Benefits**:
- Real-time data from database
- Automatic caching and revalidation
- Optimistic updates
- Error handling and retry logic
- Offline support with stale data

---

#### 1.3 Build CRUD Forms for Core Entities
**Current State**: Read-only UI with no data modification capabilities  
**Target State**: Full CRUD operations for user-owned resources

**Priority Forms to Build**:

**1. Field Management Forms**
```typescript
// src/components/forms/AddFieldForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const fieldSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
  area_acres: z.number().positive().optional(),
  crop_type: z.string().max(50).optional(),
  boundary_coordinates: z.object({
    type: z.literal('Polygon'),
    coordinates: z.array(z.array(z.array(z.number()))),
  }),
});

type FieldFormData = z.infer<typeof fieldSchema>;

export const AddFieldForm = () => {
  const createField = useCreateField();
  const form = useForm<FieldFormData>({
    resolver: zodResolver(fieldSchema),
  });

  const onSubmit = (data: FieldFormData) => {
    createField.mutate({
      ...data,
      user_id: user.id,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
};
```

**2. Task Management Forms**
- Create Task Form (with template selection)
- Edit Task Form (status updates, notes)
- Complete Task Form (with outcome tracking)

**3. Soil Analysis Forms**
- Upload Analysis Results
- Edit Analysis Metadata
- Link Analysis to Fields

**4. Integration Configuration**
- ADAPT Integration Setup
- API Key Management
- Sync Settings

**Validation Strategy**:
- Use Zod schemas matching Supabase types
- Client-side validation with React Hook Form
- Server-side validation via RLS policies
- Input sanitization for all user inputs

---

### Phase 2: Advanced Features (Medium Priority - 🟡)

#### 2.1 Admin Dashboard Implementation
**Features to Build**:
- Security monitoring dashboard
- Cost tracking analytics
- Compliance monitoring interface
- User management panel
- System health metrics

#### 2.2 User Security Settings
**Features to Build**:
- Account security page (2FA, password strength)
- API key management interface
- Session management
- Security audit log viewer
- Trusted device management

#### 2.3 Cost Management Interface
**Features to Build**:
- Cost tracking dashboard
- Alert configuration interface
- Usage analytics visualization
- Budget management tools
- Cost optimization recommendations

---

### Phase 3: Polish & Optimization (Low Priority - 🟢)

#### 3.1 Performance Optimization
- Implement code splitting
- Add skeleton loaders
- Optimize bundle size
- Add service worker for offline support

#### 3.2 Enhanced User Experience
- Add confirmation dialogs for destructive actions
- Implement undo/redo functionality
- Add bulk operations
- Improve error messages

#### 3.3 Analytics & Monitoring
- Add user behavior tracking
- Implement feature usage analytics
- Add performance monitoring
- Create user feedback mechanisms

---

## Review & Prioritization

**Status**: Documentation Phase  
**Last Updated**: 2026-02-10  
**Next Review**: Before any major refactoring or scaling efforts

**Priority Levels**:
- 🔴 **High**: Should be addressed before production scaling
- 🟡 **Medium**: Address during next major refactor
- 🟢 **Low**: Nice-to-have improvements

**Estimated Timeline**:
- Phase 1: 2-3 weeks (Foundation)
- Phase 2: 3-4 weeks (Advanced Features)
- Phase 3: 2-3 weeks (Polish)

**Success Metrics**:
- 100% of core CRUD operations functional
- Browser navigation works correctly
- Zero mock data remaining
- All Insert/Update types utilized
- Performance metrics within targets

---

## Production-Ready Architecture Patterns

### 6. Layout Pattern & Code Organization (Critical - 🔴)

**Issue**: Current `App.tsx` handles state, routing, and layout simultaneously, creating tight coupling and poor separation of concerns.

**Current Anti-Pattern**:
```typescript
// App.tsx doing too much
const [currentRoute, setCurrentRoute] = useState('/');
const [user, setUser] = useState(mockUser);

return (
  <div>
    <Header />
    <Sidebar />
    {currentRoute === '/' && <Dashboard />}
    {currentRoute === '/tasks' && <TaskManager />}
  </div>
);
```

**Recommended Pattern: Layout Components with Outlet**

```typescript
// src/components/layouts/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { AppHeader } from '@/components/AppHeader';

export const DashboardLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <main className="flex-1 p-6">
            <Outlet /> {/* Child routes render here */}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

// src/components/layouts/AuthLayout.tsx
export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Outlet /> {/* Login/Signup pages */}
    </div>
  );
};

// App.tsx - Simplified to routing only
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { AuthLayout } from '@/components/layouts/AuthLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/auth" element={<Auth />} />
        </Route>
        
        {/* Protected routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<TaskManager />} />
          <Route path="/fields" element={<FieldMapping />} />
          <Route path="/fields/:id" element={<FieldDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

**Benefits**:
- Clear separation of layout vs. content
- Easy to add new layouts (public, admin, mobile)
- Sidebar/header logic encapsulated
- Layout-specific providers stay scoped

---

### 7. Runtime Data Validation with Zod (Critical - 🔴)

**Issue**: Database returns `Json` types (e.g., `boundary_coordinates`, `analysis_data`, `usage_pattern`) with no runtime validation. TypeScript's `Json` type is too loose and won't catch malformed data.

**Risk**: Malformed JSON from database can crash components at runtime.

**Solution: Zod Schemas for JSON Fields**

```typescript
// src/lib/schemas/field.schema.ts
import { z } from 'zod';

// Validate GeoJSON structure
export const BoundaryCoordinatesSchema = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(
    z.array(
      z.array(z.number()).length(2) // [lng, lat]
    )
  ).min(1),
});

export const FieldSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  area_acres: z.number().positive().optional(),
  crop_type: z.string().max(50).optional(),
  boundary_coordinates: BoundaryCoordinatesSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  user_id: z.string().uuid(),
});

export type Field = z.infer<typeof FieldSchema>;

// src/lib/schemas/analysis.schema.ts
export const SoilAnalysisDataSchema = z.object({
  ph_level: z.number().min(0).max(14),
  nitrogen_level: z.enum(['low', 'medium', 'high']),
  phosphorus_level: z.enum(['low', 'medium', 'high']),
  potassium_level: z.enum(['low', 'medium', 'high']),
  organic_matter: z.number().min(0).max(100),
  recommendations: z.array(z.string()),
});

// Usage in data fetching hook
export const useFields = () => {
  return useQuery({
    queryKey: ['fields'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Validate each record
      return data.map(record => {
        try {
          return FieldSchema.parse(record);
        } catch (validationError) {
          console.error('Invalid field data:', validationError);
          // Option 1: Filter out invalid records
          return null;
          // Option 2: Return with safe defaults
          // Option 3: Throw and handle in UI
        }
      }).filter(Boolean);
    },
  });
};
```

**Benefits**:
- Catch data corruption early
- Type-safe JSON access in components
- Self-documenting data structures
- Can generate TypeScript types from schemas

---

### 8. Domain-Driven Data Layer with TanStack Query (Critical - 🔴)

**Issue**: Direct Supabase client usage scattered across components creates tight coupling and makes testing difficult.

**Solution: Custom Hooks per Domain Entity**

```typescript
// src/features/fields/api/useFields.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FieldSchema } from '@/lib/schemas/field.schema';
import type { Database } from '@/integrations/supabase/types';

type Field = Database['public']['Tables']['fields']['Row'];
type FieldInsert = Database['public']['Tables']['fields']['Insert'];
type FieldUpdate = Database['public']['Tables']['fields']['Update'];

// Query: Fetch all fields
export const useFields = () => {
  return useQuery({
    queryKey: ['fields'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data.map(d => FieldSchema.parse(d));
    },
  });
};

// Query: Fetch single field
export const useField = (id: string) => {
  return useQuery({
    queryKey: ['fields', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return FieldSchema.parse(data);
    },
    enabled: !!id,
  });
};

// Mutation: Create field
export const useCreateField = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newField: FieldInsert) => {
      const { data, error } = await supabase
        .from('fields')
        .insert(newField)
        .select()
        .single();
      
      if (error) throw error;
      return FieldSchema.parse(data);
    },
    onSuccess: (newField) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['fields'] });
      
      // Or: Optimistically update cache
      queryClient.setQueryData(['fields'], (old: Field[] = []) => 
        [newField, ...old]
      );
      
      toast.success('Field created successfully');
    },
    onError: (error) => {
      console.error('Failed to create field:', error);
      toast.error('Failed to create field');
    },
  });
};

// Mutation: Update field with optimistic updates
export const useUpdateField = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: FieldUpdate }) => {
      const { data, error } = await supabase
        .from('fields')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return FieldSchema.parse(data);
    },
    // Optimistic update
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['fields'] });
      
      // Snapshot previous value
      const previousFields = queryClient.getQueryData<Field[]>(['fields']);
      
      // Optimistically update cache
      if (previousFields) {
        queryClient.setQueryData<Field[]>(['fields'], 
          previousFields.map(field => 
            field.id === id ? { ...field, ...updates } : field
          )
        );
      }
      
      return { previousFields };
    },
    // Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousFields) {
        queryClient.setQueryData(['fields'], context.previousFields);
      }
      toast.error('Failed to update field');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
      toast.success('Field updated');
    },
  });
};

// Mutation: Delete field
export const useDeleteField = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('fields')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.setQueryData<Field[]>(['fields'], (old = []) =>
        old.filter(field => field.id !== deletedId)
      );
      toast.success('Field deleted');
    },
  });
};

// Component usage - clean and testable
function FieldList() {
  const { data: fields, isLoading, error } = useFields();
  const deleteField = useDeleteField();
  
  if (isLoading) return <Skeleton />;
  if (error) return <ErrorState error={error} />;
  
  return (
    <div>
      {fields?.map(field => (
        <FieldCard 
          key={field.id} 
          field={field}
          onDelete={() => deleteField.mutate(field.id)}
        />
      ))}
    </div>
  );
}
```

**Benefits**:
- UI components don't know about Supabase
- Easy to mock for testing
- Consistent error handling
- Automatic caching and revalidation
- Optimistic updates for snappy UX

---

### 9. Authentication Context & RLS Security (Critical - 🔴)

**Issue**: Mock data uses hardcoded `user_id: 'u1'`. No auth context means components can't access current user.

**Security Risk**: Passing user IDs from client allows ID spoofing.

**Solution: Global AuthProvider Context**

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Protected Route Component
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

// Usage in App.tsx
function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            
            {/* All protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/tasks" element={<TaskManager />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  );
}
```

**CRITICAL: Never pass user_id from client**

```typescript
// ❌ WRONG - Client can spoof user_id
const createField = async (fieldData: FieldInsert) => {
  const { data } = await supabase
    .from('fields')
    .insert({ ...fieldData, user_id: user.id }); // Spoofable!
};

// ✅ CORRECT - RLS policy automatically injects user_id
const createField = async (fieldData: Omit<FieldInsert, 'user_id'>) => {
  const { data } = await supabase
    .from('fields')
    .insert(fieldData); // RLS policy adds user_id server-side
};

// RLS Policy in database ensures security:
CREATE POLICY "Users can create their own fields"
ON fields FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

---

### 10. Form Management with React Hook Form (High Priority - 🔴)

**Issue**: Manual form state management causes excessive re-renders and boilerplate code.

**Solution: React Hook Form + Zod Integration**

```typescript
// src/components/forms/AddFieldForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useCreateField } from '@/features/fields/api/useFields';

// Form validation schema
const fieldFormSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  area_acres: z.number()
    .positive('Area must be positive')
    .optional()
    .or(z.string().transform(val => val === '' ? undefined : parseFloat(val))),
  crop_type: z.string()
    .max(50)
    .optional(),
  boundary_coordinates: z.object({
    type: z.literal('Polygon'),
    coordinates: z.array(z.array(z.array(z.number()))),
  }),
});

type FieldFormValues = z.infer<typeof fieldFormSchema>;

export const AddFieldForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const createField = useCreateField();
  
  const form = useForm<FieldFormValues>({
    resolver: zodResolver(fieldFormSchema),
    defaultValues: {
      name: '',
      description: '',
      area_acres: undefined,
      crop_type: '',
      boundary_coordinates: {
        type: 'Polygon',
        coordinates: [],
      },
    },
  });

  const onSubmit = async (data: FieldFormValues) => {
    createField.mutate(data, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Name</FormLabel>
              <FormControl>
                <Input placeholder="North Field" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional details about this field..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="area_acres"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Area (acres)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01"
                  placeholder="25.5"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          disabled={createField.isPending}
        >
          {createField.isPending ? 'Creating...' : 'Create Field'}
        </Button>
      </form>
    </Form>
  );
};
```

**Benefits**:
- Automatic validation with Zod
- Minimal re-renders (only changed fields)
- Built-in error handling
- Accessibility features
- Form state management

---

### 11. Error Boundaries for Resilience (Medium Priority - 🟡)

**Issue**: If a chart component crashes due to malformed data, it takes down the entire page.

**Solution: Granular Error Boundaries**

```typescript
// src/components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Send to error tracking service (Sentry, etc.)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Alert variant="destructive" className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {this.props.componentName || 'Component'} Error
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-2">
              {this.state.error?.message || 'Something went wrong'}
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={this.handleReset}
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    return this.props.children;
  }
}

// Usage: Wrap individual widgets
function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ErrorBoundary componentName="Carbon Credits Chart">
        <CarbonCreditsChart />
      </ErrorBoundary>
      
      <ErrorBoundary componentName="Task List">
        <TaskList />
      </ErrorBoundary>
      
      <ErrorBoundary componentName="Field Map">
        <FieldMap />
      </ErrorBoundary>
      
      <ErrorBoundary componentName="Weather Widget">
        <WeatherWidget />
      </ErrorBoundary>
    </div>
  );
}
```

**Benefits**:
- Isolated failures don't crash entire app
- Better user experience
- Easier debugging
- Graceful degradation

---

## Recommended Production Folder Structure

```
/src
  /components
    /ui              # shadcn/ui components (Button, Card, etc.)
    /layouts         # DashboardLayout, AuthLayout, etc.
    /shared          # Shared domain components (LoadingSpinner, ErrorState)
    ErrorBoundary.tsx
    NavLink.tsx
    
  /features          # Feature-based grouping (domain-driven design)
    /fields
      /api           # useFields, useCreateField, useUpdateField
      /components    # FieldCard, FieldForm, FieldMap
      /routes        # FieldList, FieldDetail pages
      /schemas       # field.schema.ts (Zod)
      
    /tasks
      /api           # useTasks, useUpdateTask
      /components    # TaskCard, TaskForm
      /routes        # TaskManager, TaskDetail
      /schemas       # task.schema.ts
      
    /soil-analysis
      /api
      /components
      /routes
      /schemas
      
    /auth
      /api           # useAuth context and hooks
      /components    # LoginForm, SignupForm
      /routes        # Auth page
      
  /hooks            # Global hooks
    useMobile.tsx
    useDebounce.tsx
    
  /lib
    /schemas        # Shared Zod schemas
    supabase.ts     # Supabase client singleton (read-only)
    utils.ts        # Class name mergers, formatters
    constants.ts    # Global constants
    
  /integrations
    /supabase
      client.ts     # Auto-generated (read-only)
      types.ts      # Auto-generated (read-only)
      
  /pages           # Page entry points (can be lazy loaded)
    Index.tsx
    Dashboard.tsx
    NotFound.tsx
    
  App.tsx          # Providers and Routes only
  main.tsx         # Root entry point
  index.css        # Global styles
```

**Folder Structure Benefits**:
- Features are self-contained (easier to delete/refactor)
- Clear separation of concerns
- Easy to find related code
- Scales to large teams
- Supports code splitting by feature

**File Naming Conventions**:
- Components: `PascalCase.tsx` (FieldCard.tsx)
- Hooks: `camelCase.tsx` with `use` prefix (useFields.tsx)
- Utilities: `camelCase.ts` (formatDate.ts)
- Schemas: `camelCase.schema.ts` (field.schema.ts)
- Types: `camelCase.types.ts` (field.types.ts)

---

## Critical Implementation Order

1. **Week 1: Foundation**
   - ✅ Set up React Router with layout components
   - ✅ Create AuthProvider and ProtectedRoute
   - ✅ Add TanStack Query with first domain hooks
   - ✅ Implement error boundaries

2. **Week 2-3: Core Features**
   - ✅ Build field management (full CRUD)
   - ✅ Add Zod validation for all JSON fields
   - ✅ Implement task management forms
   - ✅ Create soil analysis upload

3. **Week 4: Polish & Testing**
   - ✅ Add optimistic updates
   - ✅ Implement proper error handling
   - ✅ Add loading states and skeletons
   - ✅ Write integration tests

---

## Additional Resources

- **React Router**: https://reactrouter.com/docs
- **TanStack Query**: https://tanstack.com/query/latest
- **React Hook Form**: https://react-hook-form.com/
- **Zod**: https://zod.dev/
- **Supabase RLS**: https://supabase.com/docs/guides/auth/row-level-security

