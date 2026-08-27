// llm-router/USAGE_EXAMPLE.ts
// Example integration in a Lovable/React component

import { llmService } from './services/llm-service';

/**
 * Example 1: Basic Soil Analysis
 */
async function analyzeSoilData(soilData: any) {
  const response = await llmService.generate({
    prompt: `Analyze this soil sensor data: ${JSON.stringify(soilData)}`,
    systemPrompt: 'You are an agricultural expert. Provide brief, actionable advice.',
    maxTokens: 100,
    maxLatencyMs: 100, // Hard requirement
  });

  console.log(`Analysis ready in ${response.latencyMs}ms`);
  
  if (response.degraded) {
    console.warn('Performance mode: Using CPU fallback');
  }

  return response.text;
}

/**
 * Example 2: Real-time Chat (with UI feedback)
 */
async function handleChatMessage(userMessage: string, setStatus: Function) {
  // Check capabilities first
  const caps = await llmService.getCapabilities();
  
  if (!caps.webgpu) {
    setStatus('⚠️ Performance mode: Responses may be slower');
  }

  try {
    const response = await llmService.generate({
      prompt: userMessage,
      maxTokens: 256,
      priority: 'real-time',
      maxLatencyMs: 100,
    });

    setStatus(`✓ Response in ${response.latencyMs}ms`);
    return response.text;

  } catch (error) {
    // Router throws if SLA cannot be met
    if (error.message.includes('Cannot meet')) {
      setStatus('❌ Real-time mode unavailable. Switching to background processing...');
      
      // Retry with relaxed constraints
      const response = await llmService.generate({
        prompt: userMessage,
        maxTokens: 256,
        priority: 'background', // Relaxed SLA
      });
      
      return response.text;
    }
    
    throw error;
  }
}

/**
 * Example 3: Batch Processing (no latency requirement)
 */
async function batchAnalyzeSoilReports(reports: string[]) {
  const results = [];
  
  for (const report of reports) {
    const response = await llmService.generate({
      prompt: report,
      maxTokens: 500,
      priority: 'background', // No strict latency requirement
    });
    
    results.push({
      text: response.text,
      latency: response.latencyMs,
      backend: response.backend,
    });
  }
  
  return results;
}

/**
 * Example 4: React Hook for SoilSidekick
 */
import { useState, useEffect } from 'react';

export function useLLM() {
  const [capabilities, setCapabilities] = useState<{
    webgpu: boolean;
    wasm: boolean;
    recommended: string;
  } | null>(null);
  
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Preload on mount
    llmService.preload().then(() => {
      setIsReady(true);
    });
    
    // Get capabilities
    llmService.getCapabilities().then(setCapabilities);
  }, []);

  const generate = async (prompt: string, options: any = {}) => {
    if (!isReady) {
      throw new Error('LLM service not ready');
    }

    return llmService.generate({
      prompt,
      ...options,
    });
  };

  return {
    generate,
    isReady,
    capabilities,
    isRealTime: capabilities?.webgpu || false,
  };
}

/**
 * Example 5: Component Usage
 */
function SoilAnalysisComponent() {
  const { generate, isReady, isRealTime } = useLLM();
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const analyze = async (sensorData: any) => {
    setLoading(true);
    
    try {
      const response = await generate(
        `Analyze soil data: ${JSON.stringify(sensorData)}`,
        { maxTokens: 150 }
      );
      
      setAnalysis(response.text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!isRealTime && (
        <div className="warning">
          ⚠️ Performance mode active
        </div>
      )}
      
      <button onClick={() => analyze({ moisture: 28, ph: 6.5 })} disabled={!isReady}>
        {loading ? 'Analyzing...' : 'Analyze Soil'}
      </button>
      
      {analysis && <div className="result">{analysis}</div>}
    </div>
  );
}

export {
  analyzeSoilData,
  handleChatMessage,
  batchAnalyzeSoilReports,
  useLLM,
  SoilAnalysisComponent,
};
