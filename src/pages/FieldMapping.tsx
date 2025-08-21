import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldMap } from '@/components/FieldMap';
import { ArrowLeft, Map, Layers3 } from 'lucide-react';

interface Field {
  id: string;
  name: string;
  description?: string;
  boundary_coordinates: any;
  area_acres?: number;
  crop_type?: string;
  planting_date?: string;
  harvest_date?: string;
}

export const FieldMapping = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  if (!user) {
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-green-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Layers3 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Field Boundary Mapping</h1>
                <p className="text-sm text-muted-foreground">
                  Map and manage your agricultural field boundaries
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
              <p className="text-xs text-muted-foreground">Authenticated User</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Info Card */}
        <Card className="mb-6">
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
        <FieldMap onFieldSelect={setSelectedField} />

        {/* Additional Features Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Boundary Drawing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Click and drag to draw precise field boundaries on satellite imagery
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Crop Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track crop types, planting dates, and harvest schedules for each field
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Area Calculation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Automatic acreage calculation for accurate field size measurements
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};