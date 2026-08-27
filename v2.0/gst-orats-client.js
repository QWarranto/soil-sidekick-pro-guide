// GST ORATS Client - Rate-limited, cached data fetching
// SWR (Stale-While-Revalidate) pattern for optimal UX

(function() {
    'use strict';
    
    // Ensure GST namespace exists
    window.GST = window.GST || {};
    
    // In-memory cache
    const memoryCache = new Map();
    
    // Request queue for rate limiting
    let requestQueue = [];
    let isProcessingQueue = false;
    
    // ORATS Client
    GST.orats = {
        // Set API key (from sessionStorage or prompt)
        setApiKey(key) {
            GST.config.oratsToken = key;
            GST.state.apiKeySet = true;
            sessionStorage.setItem('orats_api_key', key);
            GST.logger.info('ORATS API key configured');
            GST.events.emit('orats:configured');
            return this;
        },
        
        // Get API key (masked for display)
        getApiKey() {
            const key = GST.config.oratsToken;
            if (!key) return null;
            return key.substring(0, 8) + '...' + key.substring(key.length - 4);
        },
        
        // Check if configured
        isConfigured() {
            return GST.state.apiKeySet && GST.config.oratsToken;
        },
        
        // Clear API key
        clearApiKey() {
            GST.config.oratsToken = null;
            GST.state.apiKeySet = false;
            sessionStorage.removeItem('orats_api_key');
            GST.logger.info('ORATS API key cleared');
            return this;
        },
        
        // Generate cache key
        _cacheKey(endpoint, params) {
            const sortedParams = Object.keys(params || {})
                .sort()
                .map(k => `${k}=${params[k]}`)
                .join('&');
            return `${endpoint}:${sortedParams}`;
        },
        
        // Check rate limit
        _checkRateLimit() {
            const now = Date.now();
            const windowStart = now - 60000; // 1 minute window
            
            // Reset if outside window
            if (GST.state.lastRequestTime < windowStart) {
                GST.state.requestCount = 0;
            }
            
            // Check if at limit
            if (GST.state.requestCount >= GST.config.maxRequestsPerMinute) {
                const waitTime = 60000 - (now - GST.state.lastRequestTime);
                return { allowed: false, waitTime };
            }
            
            return { allowed: true, waitTime: 0 };
        },
        
        // Update rate limit tracking
        _trackRequest() {
            GST.state.lastRequestTime = Date.now();
            GST.state.requestCount++;
        },
        
        // Core fetch method
        async fetch(endpoint, params = {}, options = {}) {
            const {
                ttlMs = GST.config.cacheTtlMs,
                swrMs = GST.config.swrGracePeriodMs,
                forceRefresh = false
            } = options;
            
            // Check if configured
            if (!this.isConfigured()) {
                throw new Error('ORATS API key not configured. Call GST.orats.setApiKey() first.');
            }
            
            // Generate cache key
            const cacheKey = this._cacheKey(endpoint, params);
            
            // Check cache (unless force refresh)
            if (!forceRefresh) {
                const cached = memoryCache.get(cacheKey);
                if (cached) {
                    const age = Date.now() - cached.timestamp;
                    
                    // Fresh data - return immediately
                    if (age < ttlMs) {
                        GST.logger.debug('Cache hit (fresh)', { endpoint, age: Math.round(age/1000) + 's' });
                        GST.events.emit('orats:cache:hit', { endpoint, fresh: true });
                        return cached.data;
                    }
                    
                    // Stale but within grace period - return stale, refresh in background
                    if (age < (ttlMs + swrMs)) {
                        GST.logger.debug('Cache hit (stale)', { endpoint, age: Math.round(age/1000) + 's' });
                        GST.events.emit('orats:cache:stale', { endpoint, age });
                        
                        // Trigger background refresh
                        this._fetchFresh(cacheKey, endpoint, params, ttlMs);
                        
                        return cached.data;
                    }
                }
            }
            
            // Fetch fresh data
            return this._fetchFresh(cacheKey, endpoint, params, ttlMs);
        },
        
        // Internal fetch with rate limiting
        async _fetchFresh(cacheKey, endpoint, params, ttlMs) {
            // Check rate limit
            const rateCheck = this._checkRateLimit();
            if (!rateCheck.allowed) {
                GST.state.rateLimited = true;
                GST.state.rateLimitResetTime = Date.now() + rateCheck.waitTime;
                GST.logger.warn('Rate limited', { waitTime: Math.round(rateCheck.waitTime/1000) + 's' });
                GST.events.emit('orats:ratelimited', { waitTime: rateCheck.waitTime });
                
                // Try to return stale cache if available
                const cached = memoryCache.get(cacheKey);
                if (cached) {
                    GST.logger.info('Returning stale cache due to rate limit');
                    return cached.data;
                }
                
                throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(rateCheck.waitTime/1000)} seconds.`);
            }
            
            // Build URL
            const queryParams = new URLSearchParams({
                ...params,
                token: GST.config.oratsToken
            });
            const url = `${GST.config.oratsBaseUrl}/${endpoint}?${queryParams}`;
            
            GST.logger.debug('Fetching ORATS', { endpoint, params: Object.keys(params) });
            GST.events.emit('orats:fetch:start', { endpoint });
            
            try {
                const response = await fetch(url);
                
                // Track request
                this._trackRequest();
                GST.state.rateLimited = false;
                
                if (!response.ok) {
                    if (response.status === 429) {
                        GST.state.rateLimited = true;
                        throw new Error('Rate limited by ORATS (429)');
                    }
                    throw new Error(`ORATS HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                // Cache the result
                memoryCache.set(cacheKey, {
                    data,
                    timestamp: Date.now()
                });
                
                GST.logger.debug('Fetch successful', { endpoint, records: data.data?.length });
                GST.events.emit('orats:fetch:success', { endpoint, records: data.data?.length });
                
                return data;
                
            } catch (error) {
                GST.logger.error('Fetch failed', { endpoint, error: error.message });
                GST.events.emit('orats:fetch:error', { endpoint, error });
                throw error;
            }
        },
        
        // Convenience method: Get strikes data
        async getStrikes(ticker, tradeDate = null) {
            const params = { ticker };
            if (tradeDate) params.tradeDate = tradeDate;
            
            return this.fetch('strikes.json', params);
        },
        
        // Convenience method: Get historical strikes
        async getHistoricalStrikes(ticker, tradeDate) {
            return this.fetch('strikes.json', { ticker, tradeDate });
        },
        
        // Get current status for UI badge
        getStatus() {
            const now = Date.now();
            
            // Find most recent cache entry
            let lastFetchTs = null;
            let cacheSize = 0;
            
            for (const [key, entry] of memoryCache) {
                cacheSize++;
                if (!lastFetchTs || entry.timestamp > lastFetchTs) {
                    lastFetchTs = entry.timestamp;
                }
            }
            
            return {
                configured: this.isConfigured(),
                lastFetchTs,
                cacheSize,
                inflight: false, // Could track this if needed
                rateLimited: GST.state.rateLimited,
                rateLimitResetTime: GST.state.rateLimitResetTime,
                requestsThisMinute: GST.state.requestCount
            };
        },
        
        // Clear cache
        clearCache() {
            memoryCache.clear();
            GST.logger.info('ORATS cache cleared');
            GST.events.emit('orats:cache:cleared');
            return this;
        },
        
        // Get cache stats
        getCacheStats() {
            const stats = {
                size: memoryCache.size,
                entries: []
            };
            
            for (const [key, entry] of memoryCache) {
                stats.entries.push({
                    key: key.substring(0, 50) + '...',
                    age: Date.now() - entry.timestamp,
                    fresh: (Date.now() - entry.timestamp) < GST.config.cacheTtlMs
                });
            }
            
            return stats;
        }
    };
    
    // UI Badge Component
    GST.oratsBadge = {
        element: null,
        
        create() {
            const badge = document.createElement('div');
            badge.id = 'orats-status-badge';
            badge.style.cssText = `
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 4px 10px;
                border-radius: 4px;
                font-size: 11px;
                font-family: inherit;
                cursor: pointer;
                transition: all 0.2s;
            `;
            
            badge.addEventListener('click', () => {
                // Prompt for API key on click if not set
                if (!GST.orats.isConfigured()) {
                    const key = prompt('Enter ORATS API Key:');
                    if (key) GST.orats.setApiKey(key);
                }
            });
            
            this.element = badge;
            this.update();
            
            // Auto-update every 5 seconds
            setInterval(() => this.update(), 5000);
            
            // Listen for events
            GST.events.on('orats:fetch:success', () => this.update());
            GST.events.on('orats:ratelimited', () => this.update());
            
            return badge;
        },
        
        update() {
            if (!this.element) return;
            
            const status = GST.orats.getStatus();
            const badge = this.element;
            
            if (!status.configured) {
                badge.style.background = 'rgba(255, 68, 68, 0.2)';
                badge.style.color = 'var(--accent-red)';
                badge.style.border = '1px solid var(--accent-red)';
                badge.innerHTML = '⚠️ ORATS: No API Key (click to set)';
                return;
            }
            
            if (status.rateLimited) {
                const waitSecs = Math.ceil((status.rateLimitResetTime - Date.now()) / 1000);
                badge.style.background = 'rgba(255, 136, 0, 0.2)';
                badge.style.color = 'var(--accent-orange)';
                badge.style.border = '1px solid var(--accent-orange)';
                badge.innerHTML = `⏸️ Rate Limited (${waitSecs}s)`;
                return;
            }
            
            if (status.lastFetchTs) {
                const ageMs = Date.now() - status.lastFetchTs;
                const ageMins = Math.floor(ageMs / 60000);
                
                if (ageMins < 1) {
                    badge.style.background = 'rgba(0, 255, 136, 0.2)';
                    badge.style.color = 'var(--accent-green)';
                    badge.style.border = '1px solid var(--accent-green)';
                    badge.innerHTML = `✓ Fresh (<1m)`;
                } else if (ageMins < 5) {
                    badge.style.background = 'rgba(255, 204, 0, 0.2)';
                    badge.style.color = 'var(--accent-yellow)';
                    badge.style.border = '1px solid var(--accent-yellow)';
                    badge.innerHTML = `⚡ ${ageMins}m old`;
                } else {
                    badge.style.background = 'rgba(139, 148, 158, 0.2)';
                    badge.style.color = 'var(--text-secondary)';
                    badge.style.border = '1px solid var(--text-secondary)';
                    badge.innerHTML = `🕐 ${ageMins}m old`;
                }
            } else {
                badge.style.background = 'rgba(139, 148, 158, 0.2)';
                badge.style.color = 'var(--text-secondary)';
                badge.style.border = '1px solid var(--text-secondary)';
                badge.innerHTML = '⏳ No data yet';
            }
        },
        
        mount(containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                container.appendChild(this.create());
            }
        }
    };
    
    console.log('✅ GST ORATS Client loaded');
})();
