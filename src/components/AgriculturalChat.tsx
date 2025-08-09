import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Loader2, MessageCircle, Send, Bot, User, Sparkles, Brain, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: string;
  confidence?: number;
  sources?: string[];
  enhanced?: boolean;
  model?: string;
}

interface AgriculturalChatProps {
  context?: {
    county_fips?: string;
    soil_data?: any;
    user_location?: string;
  };
}

const AgriculturalChat: React.FC<AgriculturalChatProps> = ({ context }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your SoilSidekick Pro agricultural intelligence assistant. I can help you with soil analysis, environmental assessments, planting recommendations, and more. What would you like to know about your agricultural operations?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useGPT5, setUseGPT5] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('agricultural-intelligence', {
        body: {
          query: userMessage.content,
          context: context,
          useGPT5: useGPT5
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response,
        timestamp: new Date(),
        intent: data.intent,
        confidence: data.confidence,
        sources: data.data_sources,
        enhanced: data.enhanced || useGPT5,
        model: data.model
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Error getting response:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getIntentColor = (intent?: string) => {
    switch (intent) {
      case 'soil_analysis': return 'bg-emerald-100 text-emerald-800';
      case 'environmental_assessment': return 'bg-blue-100 text-blue-800';
      case 'planting_calendar': return 'bg-green-100 text-green-800';
      case 'water_quality': return 'bg-cyan-100 text-cyan-800';
      case 'fertilizer_recommendation': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const suggestedQuestions = [
    "What's my soil contamination risk?",
    "When should I plant corn this season?",
    "How can I improve my environmental impact?",
    "What's the water quality in my area?",
    "Recommend fertilizer for my soil type"
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {useGPT5 ? (
              <Brain className="w-5 h-5 text-purple-500" />
            ) : (
              <Sparkles className="w-5 h-5 text-primary" />
            )}
            Agricultural Intelligence Assistant
            {useGPT5 && (
              <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                <Zap className="w-3 h-3 mr-1" />
                GPT-5 Enhanced
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-4">
            {context?.county_fips && (
              <Badge variant="outline">
                County: {context.county_fips}
              </Badge>
            )}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">
                {useGPT5 ? 'Enhanced' : 'Standard'}
              </span>
              <Switch
                checked={useGPT5}
                onCheckedChange={setUseGPT5}
                disabled={isLoading}
              />
              <span className="text-xs text-muted-foreground">
                GPT-5
              </span>
            </div>
          </div>
        </div>
        {useGPT5 && (
          <p className="text-xs text-muted-foreground mt-2">
            Enhanced reasoning enabled for superior agricultural insights and complex pattern analysis
          </p>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    
                    {message.type === 'assistant' && (message.intent || message.sources) && (
                      <div className="mt-2 pt-2 border-t border-border/50 space-y-1">
                        {message.intent && (
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getIntentColor(message.intent)}`}
                            >
                              {message.intent.replace('_', ' ')}
                            </Badge>
                            {message.confidence && (
                              <span className="text-xs text-muted-foreground">
                                {Math.round(message.confidence * 100)}% confidence
                              </span>
                            )}
                          </div>
                        )}
                        {message.sources && message.sources.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {message.sources.map((source, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {source}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1 opacity-70">
                      <span>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {message.type === 'assistant' && message.enhanced && (
                        <Badge variant="secondary" className="bg-purple-50 text-purple-600 border-purple-200 text-xs">
                          <Brain className="w-3 h-3 mr-1" />
                          Enhanced
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Analyzing your query...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        {messages.length === 1 && (
          <div className="p-4 border-t bg-muted/30">
            <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setInput(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your agricultural operations..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgriculturalChat;