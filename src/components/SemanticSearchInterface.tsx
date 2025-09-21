import React, { useState, useEffect } from 'react';
import { Search, FileText, Beaker, Sprout, BarChart3, Settings, Database, Trash2, Download, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSemanticSearch, SearchOptions } from '@/hooks/useSemanticSearch';
import { SearchResult, DocumentEmbedding } from '@/services/embeddingService';
import { useToast } from '@/components/ui/use-toast';

interface SemanticSearchInterfaceProps {
  onSearchResults?: (results: SearchResult[]) => void;
  className?: string;
}

const DOCUMENT_TYPE_LABELS = {
  soil_analysis: 'Soil Analysis',
  water_quality: 'Water Quality',
  field_data: 'Field Data',
  planting_optimization: 'Planting Calendar'
} as const;

const DOCUMENT_TYPE_ICONS = {
  soil_analysis: Beaker,
  water_quality: FileText,
  field_data: Sprout,
  planting_optimization: BarChart3
} as const;

export const SemanticSearchInterface: React.FC<SemanticSearchInterfaceProps> = ({
  onSearchResults,
  className
}) => {
  const { toast } = useToast();
  const {
    state,
    initializeSearch,
    indexDocuments,
    searchSimilar,
    getStorageInfo,
    clearUserIndex,
    isReady
  } = useSemanticSearch();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    limit: 10,
    threshold: 0.5,
    documentTypes: [],
    countyFips: '',
    cropType: ''
  });
  const [storageStats, setStorageStats] = useState<any>(null);

  // Load storage stats
  useEffect(() => {
    const loadStats = async () => {
      const stats = await getStorageInfo();
      setStorageStats(stats);
    };
    
    if (isReady) {
      loadStats();
    }
  }, [isReady, getStorageInfo, state.totalDocuments]);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: "Search Query Required",
        description: "Please enter a search query",
        variant: "destructive"
      });
      return;
    }

    try {
      const searchResults = await searchSimilar(query, searchOptions);
      setResults(searchResults);
      onSearchResults?.(searchResults);
      
      if (searchResults.length === 0) {
        toast({
          title: "No Results Found",
          description: "Try adjusting your search terms or filters",
        });
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleDocumentTypeToggle = (type: DocumentEmbedding['metadata']['type'], checked: boolean) => {
    setSearchOptions(prev => ({
      ...prev,
      documentTypes: checked
        ? [...(prev.documentTypes || []), type]
        : (prev.documentTypes || []).filter(t => t !== type)
    }));
  };

  const handleIndexSampleData = async () => {
    // Sample agricultural documents for demonstration
    const sampleDocuments = [
      {
        id: 'sample-soil-1',
        text: 'Soil analysis shows pH level of 6.8, organic matter at 3.2%, nitrogen 45 ppm, phosphorus 28 ppm, potassium 180 ppm. Good fertility for corn production in Iowa County.',
        metadata: {
          type: 'soil_analysis' as const,
          userId: '',
          countyFips: '19105',
          cropType: 'corn',
          createdAt: new Date().toISOString(),
          title: 'Iowa County Corn Field Analysis'
        }
      },
      {
        id: 'sample-water-1',
        text: 'Water quality testing reveals acceptable levels for agricultural irrigation. Nitrate concentration 8.5 mg/L, pH 7.2, minimal bacterial contamination detected.',
        metadata: {
          type: 'water_quality' as const,
          userId: '',
          countyFips: '19105',
          createdAt: new Date().toISOString(),
          title: 'Irrigation Water Quality Report'
        }
      },
      {
        id: 'sample-planting-1',
        text: 'Optimal planting window for soybeans in this region is late April to mid-May. Soil temperature should reach 60°F consistently. Consider frost risk until May 15th.',
        metadata: {
          type: 'planting_optimization' as const,
          userId: '',
          countyFips: '19105',
          cropType: 'soybeans',
          createdAt: new Date().toISOString(),
          title: 'Soybean Planting Calendar'
        }
      }
    ];

    try {
      await indexDocuments(sampleDocuments);
    } catch (error) {
      console.error('Failed to index sample data:', error);
    }
  };

  const formatSimilarityScore = (score: number) => {
    return `${(score * 100).toFixed(1)}%`;
  };

  const formatStorageSize = (bytes: number) => {
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  if (!isReady && !state.error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Initializing Semantic Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading AI models...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (state.error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Semantic Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              {state.error}
            </AlertDescription>
          </Alert>
          <Button onClick={initializeSearch} className="mt-4">
            Retry Initialization
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Agricultural Document Search
          </CardTitle>
          <CardDescription>
            Search through your soil analyses, water reports, and field data using AI-powered semantic search
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="manage">Manage</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4">
              {/* Search Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Search your agricultural documents... e.g., 'high nitrogen corn fields' or 'water quality issues'"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={state.isSearching || !query.trim()}>
                  {state.isSearching ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Document Type Filters */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Types</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(DOCUMENT_TYPE_LABELS).map(([type, label]) => {
                    const Icon = DOCUMENT_TYPE_ICONS[type as keyof typeof DOCUMENT_TYPE_ICONS];
                    const isChecked = searchOptions.documentTypes?.includes(type as any) ?? false;
                    
                    return (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={type}
                          checked={isChecked}
                          onCheckedChange={(checked) => 
                            handleDocumentTypeToggle(type as any, checked as boolean)
                          }
                        />
                        <label htmlFor={type} className="flex items-center gap-1 text-sm cursor-pointer">
                          <Icon className="h-3 w-3" />
                          {label}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Additional Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">County FIPS Code</label>
                  <Input
                    placeholder="e.g., 19105"
                    value={searchOptions.countyFips || ''}
                    onChange={(e) => setSearchOptions(prev => ({ ...prev, countyFips: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Crop Type</label>
                  <Input
                    placeholder="e.g., corn, soybeans"
                    value={searchOptions.cropType || ''}
                    onChange={(e) => setSearchOptions(prev => ({ ...prev, cropType: e.target.value }))}
                  />
                </div>
              </div>

              {/* Results */}
              {results.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Search Results ({results.length})</h3>
                  {results.map((result, index) => {
                    const Icon = DOCUMENT_TYPE_ICONS[result.document.metadata.type];
                    return (
                      <Card key={result.document.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                {result.document.metadata.title || `Document ${index + 1}`}
                              </span>
                            </div>
                            <Badge variant="secondary">
                              {formatSimilarityScore(result.similarity)} match
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {result.document.text}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline">
                              {DOCUMENT_TYPE_LABELS[result.document.metadata.type]}
                            </Badge>
                            {result.document.metadata.cropType && (
                              <Badge variant="outline">{result.document.metadata.cropType}</Badge>
                            )}
                            {result.document.metadata.countyFips && (
                              <Badge variant="outline">FIPS: {result.document.metadata.countyFips}</Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Empty State */}
              {state.totalDocuments === 0 && (
                <Card className="p-8 text-center">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Documents Indexed</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by indexing some sample agricultural documents to test the search functionality.
                  </p>
                  <Button onClick={handleIndexSampleData} disabled={state.isIndexing}>
                    {state.isIndexing ? 'Indexing...' : 'Index Sample Data'}
                  </Button>
                  {state.isIndexing && (
                    <div className="mt-4">
                      <Progress value={state.indexingProgress} className="w-full" />
                      <p className="text-sm text-muted-foreground mt-2">
                        Indexing progress: {state.indexingProgress}%
                      </p>
                    </div>
                  )}
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Similarity Threshold: {searchOptions.threshold ? (searchOptions.threshold * 100).toFixed(0) : 50}%
                  </label>
                  <Slider
                    value={[searchOptions.threshold ? searchOptions.threshold * 100 : 50]}
                    onValueChange={([value]) => 
                      setSearchOptions(prev => ({ ...prev, threshold: value / 100 }))
                    }
                    max={100}
                    min={10}
                    step={5}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Lower values show more results, higher values show only very similar documents
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Max Results: {searchOptions.limit || 10}
                  </label>
                  <Slider
                    value={[searchOptions.limit || 10]}
                    onValueChange={([value]) => 
                      setSearchOptions(prev => ({ ...prev, limit: value }))
                    }
                    max={50}
                    min={5}
                    step={5}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="manage" className="space-y-4">
              {storageStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Storage Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Documents:</span>
                        <span className="text-sm font-medium">{storageStats.totalDocuments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Storage Used:</span>
                        <span className="text-sm font-medium">{formatStorageSize(storageStats.totalSize)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Last Updated:</span>
                        <span className="text-sm font-medium">
                          {storageStats.lastUpdated.toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Management Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleIndexSampleData}
                        disabled={state.isIndexing}
                        className="w-full justify-start"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Index Sample Data
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearUserIndex}
                        className="w-full justify-start text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All Documents
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};