import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LazyFieldMap } from '@/components/lazy/LazyFieldMap';
import { useFields, Field } from '@/hooks/useFields';
import { FieldsList } from '@/components/FieldsList';
import { ArrowLeft, Map, Layers3, List } from 'lucide-react';

export const FieldMapping = () => {
  const { user, trialUser } = useAuth();
  const navigate = useNavigate();
  const { fields } = useFields();
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  if (!user && !trialUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Map className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Please sign in to access field boundary mapping features.
            </p>
            <Button onClick={() => navigate('/auth')} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero parallax-scroll">
      {/* Header */}
      <header className="glass-effect border-b border-primary/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="glass"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="hover:shadow-glow-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3 floating-animation">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center pulse-glow">
                <Layers3 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Field Boundary Mapping</h1>
                <p className="text-sm text-muted-foreground">
                  Map and manage your agricultural field boundaries
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium">{(user?.email || trialUser?.email) ?? 'Trial Access'}</p>
              <p className="text-xs text-muted-foreground">{user ? 'Authenticated User' : 'Trial User'}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 slide-in-up">
        {/* Info Card */}
        <Card className="mb-6 card-elevated animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Map className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle>Interactive Field Mapping</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Draw field boundaries, add crop information, and manage your agricultural land data
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Field Map Component */}
        <LazyFieldMap 
          onFieldSelect={(field) => setSelectedField(field as Field | null)}
        />

        {/* Fields List */}
        {fields.length > 0 && (
          <Card className="mt-6 card-elevated animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <List className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base">Your Fields ({fields.length})</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Select a field to view its soil analysis or map boundary
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <FieldsList
                fields={fields}
                onFieldSelect={(field) => setSelectedField(field as Field | null)}
              />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};