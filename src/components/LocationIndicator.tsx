import React, { useState, useEffect } from 'react';
import { MapPin, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CountyLookup } from '@/components/CountyLookup';
import { useToast } from '@/hooks/use-toast';

interface County {
  id: string;
  county_name: string;
  state_name: string;
  state_code: string;
  fips_code: string;
}

interface LocationIndicatorProps {
  onLocationChange?: (county: County | null) => void;
}

export const LocationIndicator: React.FC<LocationIndicatorProps> = ({ onLocationChange }) => {
  const [selectedCounty, setSelectedCounty] = useState<County | null>(null);
  const [showLookup, setShowLookup] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved location from localStorage on mount
    const savedLocation = localStorage.getItem('selectedCounty');
    if (savedLocation) {
      try {
        const county = JSON.parse(savedLocation);
        setSelectedCounty(county);
        setIsValidated(true);
        onLocationChange?.(county);
      } catch (error) {
        console.error('Error loading saved location:', error);
      }
    }
  }, [onLocationChange]);

  const handleCountySelect = (county: County) => {
    setSelectedCounty(county);
    setIsValidated(true);
    setShowLookup(false);
    
    // Save to localStorage for persistence
    localStorage.setItem('selectedCounty', JSON.stringify(county));
    
    onLocationChange?.(county);
    
    toast({
      title: "Location Set",
      description: `Agricultural data will be specific to ${county.county_name}, ${county.state_code}`,
    });
  };

  const handleClearLocation = () => {
    setSelectedCounty(null);
    setIsValidated(false);
    localStorage.removeItem('selectedCounty');
    onLocationChange?.(null);
    
    toast({
      title: "Location Cleared",
      description: "Please select a location to get accurate agricultural data",
      variant: "destructive",
    });
  };

  const getLocationStatus = () => {
    if (!selectedCounty) {
      return {
        status: 'error',
        icon: AlertTriangle,
        message: 'No location selected',
        description: 'Select a county to get accurate agricultural data',
        variant: 'destructive' as const
      };
    }
    
    if (isValidated) {
      return {
        status: 'success',
        icon: CheckCircle,
        message: 'Location validated',
        description: `Data specific to ${selectedCounty.county_name}, ${selectedCounty.state_code}`,
        variant: 'default' as const
      };
    }
    
    return {
      status: 'warning',
      icon: AlertTriangle,
      message: 'Location needs validation',
      description: 'Please verify your location selection',
      variant: 'secondary' as const
    };
  };

  const locationStatus = getLocationStatus();
  const StatusIcon = locationStatus.icon;

  if (showLookup) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Set Location</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowLookup(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CountyLookup onCountySelect={handleCountySelect} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border ${
      locationStatus.status === 'error' ? 'border-destructive/20 bg-destructive/5' :
      locationStatus.status === 'success' ? 'border-green-500/20 bg-green-50/50' :
      'border-yellow-500/20 bg-yellow-50/50'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${
              locationStatus.status === 'error' ? 'bg-destructive/10' :
              locationStatus.status === 'success' ? 'bg-green-100' :
              'bg-yellow-100'
            }`}>
              <StatusIcon className={`h-4 w-4 ${
                locationStatus.status === 'error' ? 'text-destructive' :
                locationStatus.status === 'success' ? 'text-green-600' :
                'text-yellow-600'
              }`} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="font-medium">{locationStatus.message}</h4>
                {selectedCounty && (
                  <Badge variant={locationStatus.variant}>
                    FIPS: {selectedCounty.fips_code}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{locationStatus.description}</p>
              {selectedCounty && (
                <div className="flex items-center space-x-1 mt-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {selectedCounty.county_name} County, {selectedCounty.state_name}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {selectedCounty ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowLookup(true)}
                >
                  Change
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleClearLocation}
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button 
                variant="default" 
                size="sm"
                onClick={() => setShowLookup(true)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Set Location
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};