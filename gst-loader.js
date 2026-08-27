// GST Loader - Loads all v2.0 components in dependency order
// Classic script pattern - no ES modules

(function() {
    'use strict';
    
    // Script loading order (dependencies first)
    const scripts = [
        // 1. Core namespace and utilities
        'v2.0/gst-core.js',
        
        // 2. Data layer
        'v2.0/gst-orats-client.js',
        'v2.0/gst-snapshot-store.js',
        
        // 3. Strategy layer
        'v2.0/gst-playbook-engine.js',
        
        // 4. UI layer
        'v2.0/gst-decision-trace.js'
    ];
    
    // Load scripts sequentially to ensure dependency order
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = false; // Maintain order
            
            script.onload = () => {
                console.log(`✅ Loaded: ${src}`);
                resolve();
            };
            
            script.onerror = () => {
                console.error(`❌ Failed to load: ${src}`);
                reject(new Error(`Failed to load ${src}`));
            };
            
            document.head.appendChild(script);
        });
    }
    
    // Load all scripts
    async function loadAll() {
        console.log('🚀 Loading GST v2.0 components...');
        
        for (const script of scripts) {
            try {
                await loadScript(script);
            } catch (error) {
                console.error('Script load error:', error);
                // Continue loading other scripts even if one fails
            }
        }
        
        console.log('✅ GST v2.0 components loaded');
        
        // Emit ready event
        if (window.GST && window.GST.events) {
            window.GST.events.emit('gst:v2:ready');
        }
    }
    
    // Start loading
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAll);
    } else {
        loadAll();
    }
})();
