# SoilSidekick Pro: Comprehensive Implementation Guide
## From MVP to Production-Ready Platform

> **🚨 CRITICAL**: Read [SECURITY_CRITICAL_CORRECTIONS.md](./SECURITY_CRITICAL_CORRECTIONS.md) BEFORE implementing this guide  
> **Status**: Implementation Roadmap (WITH SECURITY CORRECTIONS REQUIRED)  
> **Last Updated**: 2025-11-19  
> **Purpose**: Consolidated guide bridging current MVP state to production-ready architecture

---

## ⚠️ SECURITY WARNING

This guide contains **7 critical security flaws** that have been documented and corrected in:

### [SECURITY_CRITICAL_CORRECTIONS.md](./SECURITY_CRITICAL_CORRECTIONS.md)

**YOU MUST READ THE SECURITY CORRECTIONS BEFORE PROCEEDING.**

Critical issues include:
- ❌ Incorrect user_id handling (lines 979-986)
- ❌ Missing admin role security implementation
- ❌ No server-side input validation guidance
- ❌ Nullable user_id columns in RLS policies
- ❌ Missing XSS/injection prevention
- ❌ Incomplete error handling
- ❌ Migration vs data operations confusion

**The corrections document supersedes any conflicting guidance in this file.**

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Assessment](#current-state-assessment)
3. [Critical Implementation Priorities](#critical-implementation-priorities)
4. [Phase 1: Foundation Layer](#phase-1-foundation-layer)
5. [Phase 2: Feature Parity](#phase-2-feature-parity)
6. [Phase 3: Production Hardening](#phase-3-production-hardening)
7. [Success Metrics](#success-metrics)
8. [Migration Strategy](#migration-strategy)

---

## Executive Summary

### The Gap

SoilSidekick Pro has a **sophisticated backend** with robust security, compliance logging, and data management capabilities, but the **frontend MVP** only utilizes ~20% of this infrastructure. The current state creates:

- ❌ **Broken user experience** - Browser navigation doesn't work
- ❌ **Feature underutilization** - Advanced backend features invisible to users
- ❌ **Data integrity risk** - No runtime validation for JSON fields
- ❌ **Incomplete CRUD** - Read-only UI despite full backend support
- ❌ **Architectural debt** - Manual routing, mock data, scattered state

### The Solution

This guide provides a **structured 3-phase approach** to align frontend with backend, transforming the MVP into a production-ready platform while maintaining backward compatibility.

**Estimated Timeline**: 6-8 weeks  
**Priority**: High (blocking scale and production launch)

---

## Current State Assessment

### Backend Strengths ✅

The backend is production-ready with:
- ✅ 40+ database tables with proper RLS policies
- ✅ Comprehensive audit logging across security/compliance domains
- ✅ Cost tracking and usage analytics infrastructure
- ✅ Multi-tier subscription system with quota enforcement
- ✅ Advanced features: carbon credits, VRT prescriptions, field boundaries
- ✅ Security monitoring with threat detection
- ✅ Integration framework (ADAPT, external APIs)

### Backend Weaknesses ⚠️

Despite strengths, there are structural issues:

#### 1. Database Complexity (Priority: Medium)
**Problem**: 5+ overlapping audit/logging tables create maintenance burden
- `auth_security_log`, `security_audit_log`, `comprehensive_audit_log`, `compliance_audit_log`, `api_key_access_log`
- Usage tracking fragmented across 4 tables: `usage_analytics`, `subscription_usages`, `geo_consumption_analytics`, `cost_tracking`

**Impact**: Increased API surface area, inconsistent logging patterns

**Future Consideration**: Consolidate to 2-3 focused tables with discriminator columns

#### 2. JSON Column Validation (Priority: High)
**Problem**: Heavy reliance on `jsonb` columns without database-level validation
- Critical data in JSON: `boundary_coordinates`, `zones`, `usage_pattern`, `analysis_data`, `permissions`
- No schema enforcement - relies entirely on application-layer validation
- TypeScript `Json` type too loose for runtime safety

**Impact**: Risk of corrupt data crashing components

**Immediate Action Required**: Add runtime Zod validation (see Phase 1.3)

---

### Frontend Weaknesses 🔴

Critical architectural gaps blocking production:

#### 1. Broken Routing (Priority: CRITICAL)
**Current State**: 
```typescript
const [currentRoute, setCurrentRoute] = useState('dashboard');
```

**Problems**:
- ❌ Browser back button broken
- ❌ No deep linking - can't share `/tasks/123`
- ❌ State resets on refresh
- ❌ No URL parameters
- ❌ SEO impossible - all routes appear as `/`

**Impact**: Poor UX, can't track analytics, not bookmarkable

**Required Fix**: Migrate to React Router (see Phase 1.1)

---

#### 2. Missing Backend Feature Utilization (Priority: High)
**Current State**: Frontend implements ~20% of backend capabilities

**Unused Features**:
- ❌ Security settings UI (`account_security` table)
- ❌ Audit log viewer (`auth_security_log`, `security_audit_log`)
- ❌ Cost management dashboard (`cost_tracking`, `cost_alerts`)
- ❌ API key management for Enterprise users
- ❌ Compliance dashboard (`soc2_compliance_checks`)
- ❌ Admin monitoring tools

**Impact**: Wasted backend development, users can't access paid features

**Required Fix**: Build admin + user-facing dashboards (see Phase 2)

---

#### 3. Mock Data vs. Real Data (Priority: CRITICAL)
**Current State**: `mockData.ts` with hardcoded `user_id: 'u1'`

**Problems**:
- ❌ No actual database queries
- ❌ No authentication integration
- ❌ No real-time updates
- ❌ Can't test backend validation
- ❌ Supabase client unused

**Impact**: Not production-ready, can't test RLS policies

**Required Fix**: Implement Supabase + React Query data layer (see Phase 1.2)

---

#### 4. CRUD Operations Gap (Priority: CRITICAL)
**Current State**: Read-only UI

**Missing Operations**:
- ❌ Create: No forms to add fields, tasks, analyses
- ❌ Update: Can't edit field boundaries, task statuses
- ❌ Delete: No deletion functionality
- ❌ Backend `Insert`/`Update` types unused

**Impact**: Users must manually edit database for basic operations

**Required Fix**: Build CRUD forms with React Hook Form + Zod (see Phase 1.4)

---

## Critical Implementation Priorities

Based on impact and dependencies:

### 🔴 Phase 1: Foundation (Weeks 1-3)
**Blocking Production Launch**
1. Migrate to React Router (fixes navigation)
2. Implement Supabase + React Query data layer (enables real data)
3. Add Zod runtime validation (prevents crashes)
4. Build core CRUD forms (enables user data management)
5. Implement authentication context (secures app)

### 🟡 Phase 2: Feature Parity (Weeks 4-5)
**Enables Paid Features**
1. Build admin dashboards (security, compliance, cost)
2. User security settings page
3. API key management interface
4. Complete task management UI
5. Field boundary editor

### 🟢 Phase 3: Production Hardening (Weeks 6-8)
**Optimizes for Scale**
1. Error boundaries for graceful degradation
2. Performance optimization (lazy loading, code splitting)
3. Monitoring and analytics integration
4. Advanced UX patterns (optimistic updates, skeletons)
5. SDK/API client integration support (see [SDK_CLIENT_ONBOARDING_PLAN.md](./SDK_CLIENT_ONBOARDING_PLAN.md))
6. Documentation and testing

---

## Phase 1: Foundation Layer

### 1.1 Adopt React Router Architecture

**Objective**: Fix broken browser navigation and enable deep linking

#### Current Problem
```typescript
// App.tsx - BROKEN
const [currentRoute, setCurrentRoute] = useState('dashboard');

const navigate = (route: string) => {
  setCurrentRoute(route); // ❌ Doesn't update URL
  window.scrollTo(0, 0);
};

return (
  <div>
    <Sidebar onNavigate={navigate} />
    {currentRoute === 'dashboard' && <Dashboard />}
    {currentRoute === 'tasks' && <TaskManager />}
  </div>
);
```

#### Solution: React Router v6

```typescript
// src/App.tsx - FIXED
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { AuthLayout } from '@/components/layouts/AuthLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Index />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/auth" element={<Auth />} />
        </Route>

        {/* Protected routes with dashboard layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<TaskManager />} />
          <Route path="/tasks/:taskId" element={<TaskDetail />} />
          <Route path="/fields" element={<FieldMapping />} />
          <Route path="/fields/:fieldId" element={<FieldDetail />} />
          <Route path="/soil-analysis" element={<SoilAnalysis />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

#### Create Layout Components

```typescript
// src/components/layouts/DashboardLayout.tsx
import { Outlet, useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';

export const DashboardLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      <Sidebar onNavigate={(route) => navigate(route)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">
          <Outlet /> {/* Child routes render here */}
        </main>
      </div>
    </div>
  );
};

// src/components/layouts/AuthLayout.tsx
export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
};
```

#### Update Navigation Calls

```typescript
// Before (BROKEN)
<Button onClick={() => navigate('tasks')}>View Tasks</Button>

// After (WORKS)
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  return (
    <Button onClick={() => navigate('/tasks')}>View Tasks</Button>
  );
}
```

#### Benefits
- ✅ Browser back/forward buttons work
- ✅ Deep linking: share `https://app.com/tasks/abc-123`
- ✅ State persists across refreshes (via URL params)
- ✅ SEO-friendly URLs
- ✅ Analytics can track page views

---

### 1.2 Implement Real Data Fetching Layer

**Objective**: Replace mock data with Supabase + React Query

#### Setup React Query Provider

```typescript
// src/main.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
```

#### Create Domain-Specific Hooks

```typescript
// src/features/fields/api/useFields.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
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
      return data as Field[];
    },
  });
};

// Query: Fetch single field
export const useField = (fieldId: string) => {
  return useQuery({
    queryKey: ['fields', fieldId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fields')
        .select('*')
        .eq('id', fieldId)
        .single();
      
      if (error) throw error;
      return data as Field;
    },
    enabled: !!fieldId,
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
      return data as Field;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
    },
  });
};

// Mutation: Update field
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
      return data as Field;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
      queryClient.invalidateQueries({ queryKey: ['fields', data.id] });
    },
  });
};

// Mutation: Delete field
export const useDeleteField = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fieldId: string) => {
      const { error } = await supabase
        .from('fields')
        .delete()
        .eq('id', fieldId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
    },
  });
};
```

#### Use in Components

```typescript
// src/pages/FieldMapping.tsx
import { useFields, useCreateField, useDeleteField } from '@/features/fields/api/useFields';

export const FieldMapping = () => {
  const { data: fields, isLoading, error } = useFields();
  const createField = useCreateField();
  const deleteField = useDeleteField();

  const handleCreateField = async (fieldData: FieldInsert) => {
    try {
      await createField.mutateAsync(fieldData);
      toast.success('Field created successfully');
    } catch (err) {
      toast.error('Failed to create field');
    }
  };

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h1>Your Fields ({fields?.length})</h1>
      {fields?.map(field => (
        <FieldCard
          key={field.id}
          field={field}
          onDelete={() => deleteField.mutate(field.id)}
        />
      ))}
      <AddFieldDialog onSubmit={handleCreateField} />
    </div>
  );
};
```

#### Benefits
- ✅ Real database queries replace mock data
- ✅ Automatic caching and background refetching
- ✅ Optimistic updates built-in
- ✅ Loading/error states handled
- ✅ RLS policies enforced

---

### 1.3 Add Runtime Data Validation (Zod)

**Objective**: Prevent corrupt JSON data from crashing components

#### Problem: Loose TypeScript Types

```typescript
// TypeScript allows this, but runtime will crash
type Field = {
  id: string;
  boundary_coordinates: Json; // ❌ Could be anything!
};

// Runtime: boundary_coordinates = "invalid string"
// Component crashes trying to map coordinates
```

#### Solution: Zod Schemas

```typescript
// src/lib/schemas/field.schema.ts
import { z } from 'zod';

// Validate GeoJSON structure
export const BoundaryCoordinatesSchema = z.object({
  type: z.literal('Polygon'),
  coordinates: z.array(
    z.array(
      z.tuple([z.number(), z.number()]) // [lng, lat]
    )
  ).min(1),
});

export const FieldSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name required").max(100),
  description: z.string().max(500).optional(),
  area_acres: z.number().positive().optional(),
  crop_type: z.string().max(50).optional(),
  boundary_coordinates: BoundaryCoordinatesSchema,
  planting_date: z.string().date().optional(),
  harvest_date: z.string().date().optional(),
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
  test_date: z.string().date(),
  lab_name: z.string().optional(),
});

export type SoilAnalysisData = z.infer<typeof SoilAnalysisDataSchema>;
```

#### Use in Data Fetching

```typescript
// src/features/fields/api/useFields.ts (updated)
import { FieldSchema } from '@/lib/schemas/field.schema';

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
        const validation = FieldSchema.safeParse(record);
        
        if (!validation.success) {
          console.error('Invalid field data:', validation.error);
          // Option 1: Filter out invalid records
          return null;
          // Option 2: Return with safe defaults
          // Option 3: Throw and show error to user
        }
        
        return validation.data;
      }).filter(Boolean) as Field[];
    },
  });
};
```

#### Use in Forms

```typescript
// src/components/forms/AddFieldForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldSchema } from '@/lib/schemas/field.schema';

export const AddFieldForm = ({ onSubmit }) => {
  const form = useForm({
    resolver: zodResolver(FieldSchema.omit({ 
      id: true, 
      created_at: true, 
      updated_at: true,
      user_id: true 
    })),
    defaultValues: {
      name: '',
      description: '',
      area_acres: undefined,
      crop_type: '',
      boundary_coordinates: {
        type: 'Polygon',
        coordinates: []
      }
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Field Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* More fields... */}
        <Button type="submit">Create Field</Button>
      </form>
    </Form>
  );
};
```

#### Benefits
- ✅ Catches corrupt data before it reaches components
- ✅ Type-safe JSON access
- ✅ Self-documenting data structures
- ✅ Form validation built-in
- ✅ Can generate TypeScript types from schemas

---

### 1.4 Build Core CRUD Forms

**Objective**: Enable users to create, update, and delete their own data

#### Required Forms (Priority Order)

1. **Add/Edit Field Form** (Fields table)
2. **Add/Edit Task Form** (User_tasks table)
3. **Soil Analysis Form** (Soil_analyses table)
4. **Task Template Selection** (Seasonal_task_templates)

#### Example: Add Field Dialog

```typescript
// src/components/dialogs/AddFieldDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateField } from '@/features/fields/api/useFields';
import { toast } from 'sonner';

const AddFieldFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  area_acres: z.coerce.number().positive("Must be positive").optional(),
  crop_type: z.string().max(50).optional(),
  boundary_coordinates: z.object({
    type: z.literal('Polygon'),
    coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
  }),
});

type AddFieldFormValues = z.infer<typeof AddFieldFormSchema>;

interface AddFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddFieldDialog = ({ open, onOpenChange }: AddFieldDialogProps) => {
  const createField = useCreateField();
  
  const form = useForm<AddFieldFormValues>({
    resolver: zodResolver(AddFieldFormSchema),
    defaultValues: {
      name: '',
      description: '',
      area_acres: undefined,
      crop_type: '',
      boundary_coordinates: {
        type: 'Polygon',
        coordinates: [[]]
      }
    }
  });

  const onSubmit = async (values: AddFieldFormValues) => {
    try {
      await createField.mutateAsync(values);
      toast.success('Field created successfully');
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to create field');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Field</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Name *</FormLabel>
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
                      placeholder="Additional notes about this field..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="area_acres"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Area (acres)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="crop_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Corn, Soybeans, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Map component for drawing boundaries */}
            <FormField
              control={form.control}
              name="boundary_coordinates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Boundary</FormLabel>
                  <FormControl>
                    <FieldBoundaryMap
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createField.isPending}
              >
                {createField.isPending ? 'Creating...' : 'Create Field'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
```

#### Benefits
- ✅ Users can manage their own data
- ✅ Validation prevents bad data entry
- ✅ Type-safe forms with Zod + React Hook Form
- ✅ Backend Insert/Update types utilized
- ✅ Optimistic updates provide instant feedback

---

### 1.5 Implement Authentication Context

**Objective**: Secure app with proper authentication and prevent user ID spoofing

#### Create Auth Provider

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

#### Protected Route Wrapper

```typescript
// src/components/ProtectedRoute.tsx
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};
```

#### Update App.tsx

```typescript
// src/App.tsx (updated)
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<TaskManager />} />
            {/* ... */}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

#### Use Auth in Data Hooks

```typescript
// src/features/fields/api/useFields.ts (updated)
import { useAuth } from '@/contexts/AuthContext';

export const useCreateField = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newField: Omit<FieldInsert, 'user_id'>) => {
      if (!user) throw new Error('Not authenticated');

      // ✅ SECURE: Server-side user_id from auth.uid()
      // ❌ NEVER pass user_id from client - prevents ID spoofing
      const { data, error } = await supabase
        .from('fields')
        .insert({
          ...newField,
          // user_id is set by RLS policy using auth.uid()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fields'] });
    },
  });
};
```

#### Benefits
- ✅ Prevents user ID spoofing
- ✅ RLS policies enforced properly
- ✅ Protected routes redirect to login
- ✅ Auth state managed globally
- ✅ Sign out clears user data

---

## Phase 2: Feature Parity

### 2.1 Build Admin Dashboard

**Objective**: Surface backend security/compliance features to admin users

#### Admin Route Structure

```
/admin
  ├── /security       # Auth logs, security monitoring
  ├── /compliance     # SOC2 checks, audit logs
  ├── /costs          # Cost tracking, alerts
  ├── /users          # User management
  └── /api-keys       # API key management
```

#### Security Dashboard

```typescript
// src/pages/admin/SecurityDashboard.tsx
export const SecurityDashboard = () => {
  const { data: securityLogs } = useQuery({
    queryKey: ['admin', 'security-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('auth_security_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: incidents } = useQuery({
    queryKey: ['admin', 'security-incidents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('security_incidents')
        .select('*')
        .eq('resolved_at', null)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <h1>Security Monitoring</h1>
      
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Logins (24h)"
          value={securityLogs?.filter(log => log.event_type === 'login').length}
        />
        <StatCard
          title="Failed Attempts"
          value={securityLogs?.filter(log => !log.success).length}
          variant="danger"
        />
        <StatCard
          title="Active Incidents"
          value={incidents?.length}
          variant="warning"
        />
        <StatCard
          title="High Risk Events"
          value={securityLogs?.filter(log => log.risk_score > 75).length}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {securityLogs?.map(log => (
                <TableRow key={log.id}>
                  <TableCell>{formatDate(log.created_at)}</TableCell>
                  <TableCell>{log.event_type}</TableCell>
                  <TableCell>{log.email}</TableCell>
                  <TableCell>{log.ip_address}</TableCell>
                  <TableCell>
                    <Badge variant={log.risk_score > 75 ? 'destructive' : 'default'}>
                      {log.risk_score}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {log.success ? (
                      <Badge variant="success">Success</Badge>
                    ) : (
                      <Badge variant="destructive">Failed</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
```

---

### 2.2 User Security Settings Page

**Objective**: Allow users to manage their own security settings

```typescript
// src/pages/SecuritySettings.tsx
export const SecuritySettings = () => {
  const { user } = useAuth();
  
  const { data: securitySettings } = useQuery({
    queryKey: ['security-settings', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('account_security')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="max-w-2xl space-y-6">
      <h1>Security Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Switch
            checked={securitySettings?.two_factor_enabled}
            onCheckedChange={handleToggle2FA}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Login Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentLoginsTable userId={user?.id} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trusted Devices</CardTitle>
        </CardHeader>
        <CardContent>
          <TrustedDevicesList 
            devices={securitySettings?.trusted_devices}
            onRemove={handleRemoveDevice}
          />
        </CardContent>
      </Card>
    </div>
  );
};
```

---

### 2.3 Cost Management Dashboard

**Objective**: Show cost tracking and configure alerts

```typescript
// src/pages/admin/CostDashboard.tsx
export const CostDashboard = () => {
  const { data: costSummary } = useQuery({
    queryKey: ['admin', 'cost-summary'],
    queryFn: async () => {
      // Call RPC function for aggregated cost data
      const { data, error } = await supabase.rpc('get_cost_summary', {
        p_start_date: subDays(new Date(), 30).toISOString(),
        p_end_date: new Date().toISOString(),
      });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <h1>Cost Monitoring</h1>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Total Costs (30d)"
          value={`$${costSummary?.total_cost.toFixed(2)}`}
        />
        <StatCard
          title="Avg Cost per Request"
          value={`$${costSummary?.avg_cost_per_request.toFixed(4)}`}
        />
        <StatCard
          title="Active Alerts"
          value={costSummary?.active_alerts}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cost Breakdown by Service</CardTitle>
        </CardHeader>
        <CardContent>
          <CostBreakdownChart data={costSummary?.by_service} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configure Cost Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <CostAlertsForm />
        </CardContent>
      </Card>
    </div>
  );
};
```

---

## Phase 3: Production Hardening

### 3.1 Error Boundaries

**Objective**: Prevent single component failures from crashing entire app

```typescript
// src/components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
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

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error tracking service (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Alert variant="destructive">
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription>
            {this.state.error?.message || 'An unexpected error occurred'}
          </AlertDescription>
          <Button
            variant="outline"
            onClick={() => this.setState({ hasError: false })}
            className="mt-4"
          >
            Try Again
          </Button>
        </Alert>
      );
    }

    return this.props.children;
  }
}
```

#### Wrap Risky Components

```typescript
// Wrap charts, maps, complex widgets
<ErrorBoundary fallback={<ChartErrorFallback />}>
  <CarbonCreditsChart data={data} />
</ErrorBoundary>

<ErrorBoundary fallback={<MapErrorFallback />}>
  <FieldMap fields={fields} />
</ErrorBoundary>
```

---

### 3.2 Performance Optimization

#### Lazy Loading Routes

```typescript
// src/App.tsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const TaskManager = lazy(() => import('@/pages/TaskManager'));
const FieldMapping = lazy(() => import('@/pages/FieldMapping'));

<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/tasks" element={<TaskManager />} />
    <Route path="/fields" element={<FieldMapping />} />
  </Routes>
</Suspense>
```

#### Code Splitting by Feature

```typescript
// src/features/fields/index.ts
export { useFields, useCreateField } from './api/useFields';
export { FieldCard } from './components/FieldCard';
export { AddFieldDialog } from './components/AddFieldDialog';

// Import only what you need
import { useFields } from '@/features/fields';
```

---

### 3.3 Optimistic Updates

**Objective**: Make UI feel instant while syncing with server

```typescript
// src/features/tasks/api/useTasks.ts
export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('user_tasks')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    // Optimistic update
    onMutate: async ({ id, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot current value
      const previousTasks = queryClient.getQueryData(['tasks']);

      // Optimistically update UI
      queryClient.setQueryData(['tasks'], (old: Task[]) => {
        return old.map(task => 
          task.id === id ? { ...task, status } : task
        );
      });

      // Return context for rollback
      return { previousTasks };
    },
    // Rollback on error
    onError: (_err, _variables, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
      toast.error('Failed to update task');
    },
    // Always refetch after success or error
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
};

// Usage in component
const updateStatus = useUpdateTaskStatus();

<Checkbox
  checked={task.status === 'completed'}
  onCheckedChange={(checked) => {
    // UI updates instantly!
    updateStatus.mutate({
      id: task.id,
      status: checked ? 'completed' : 'pending'
    });
  }}
/>
```

---

## Success Metrics

### Phase 1 (Foundation)
- ✅ Browser back button works on 100% of pages
- ✅ All mock data replaced with real Supabase queries
- ✅ Zero runtime crashes from malformed JSON
- ✅ Users can create, update, delete fields and tasks
- ✅ RLS policies prevent user ID spoofing

### Phase 2 (Feature Parity)
- ✅ Admin dashboard shows security logs in real-time
- ✅ Users can enable 2FA and view login history
- ✅ Cost tracking dashboard shows spend by service
- ✅ All backend features accessible via UI

### Phase 3 (Production)
- ✅ Page load time < 2 seconds
- ✅ Time to Interactive < 3 seconds
- ✅ Zero full-page crashes (error boundaries contain failures)
- ✅ Optimistic updates provide instant feedback
- ✅ Code splitting reduces initial bundle by 40%

---

## Migration Strategy

### Week 1-2: Foundation Setup
1. Create `DashboardLayout` and `AuthLayout` components
2. Migrate App.tsx to React Router
3. Set up QueryClientProvider and AuthProvider
4. Test navigation thoroughly

### Week 3: Data Layer
1. Create Zod schemas for all JSON fields
2. Build data hooks for fields, tasks, analyses
3. Replace all mock data imports
4. Test RLS policies with real users

### Week 4: Forms
1. Build AddFieldDialog, EditFieldDialog
2. Build AddTaskDialog, EditTaskDialog
3. Implement form validation with Zod
4. Add confirmation dialogs for deletions

### Week 5-6: Admin Features
1. Build admin security dashboard
2. Build cost monitoring dashboard
3. Add user security settings page
4. Test with admin role

### Week 7-8: Production Hardening
1. Add error boundaries to critical components
2. Implement lazy loading for routes
3. Add optimistic updates to mutations
4. Performance testing and optimization
5. Final QA and bug fixes

---

## Conclusion

This comprehensive guide provides a structured path from the current MVP state to a production-ready platform. By following the phased approach:

1. **Phase 1** fixes critical UX issues and enables real data management
2. **Phase 2** surfaces advanced features users are paying for
3. **Phase 3** hardens the application for scale and reliability

The roadmap is designed to maintain backward compatibility while systematically eliminating architectural debt. Each phase delivers incremental value and can be validated independently.

**Next Steps**: Review this guide with the development team, adjust timelines based on resources, and begin Phase 1 implementation.
