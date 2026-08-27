// Playbook Rules Verification Script
// Validates that all 6 rules evaluate correctly against mock scenarios

console.log('═══════════════════════════════════════════════════════════');
console.log('  GAMMA STORM TRACKER - PLAYBOOK VERIFICATION');
console.log('═══════════════════════════════════════════════════════════\n');

// Test configuration
const TESTS = [
    {
        name: 'Perfect CALL Setup',
        id: 'perfect-call',
        expectedSignal: 'CALL',
        expectedConfidence: 92,
        expectedPassedRules: ['gammaRegime', 'confluence', 'flowSanity', '30mClose', 'gapRule', 'activity'],
        expectedFailedRules: []
    },
    {
        name: 'Perfect PUT Setup', 
        id: 'perfect-put',
        expectedSignal: 'PUT',
        expectedConfidence: 88,
        expectedPassedRules: ['gammaRegime', 'confluence', 'flowSanity', '30mClose', 'gapRule', 'activity'],
        expectedFailedRules: []
    },
    {
        name: 'Failed Confluence',
        id: 'failed-confluence',
        expectedSignal: 'NONE',
        expectedConfidence: 0,
        expectedPassedRules: ['gammaRegime'],
        expectedFailedRules: ['confluence', 'flowSanity', '30mClose', 'gapRule', 'activity']
    },
    {
        name: 'No Gamma Regime',
        id: 'no-gamma-regime',
        expectedSignal: 'NONE',
        expectedConfidence: 0,
        expectedPassedRules: ['confluence', 'flowSanity', '30mClose', 'gapRule', 'activity'],
        expectedFailedRules: ['gammaRegime']
    },
    {
        name: 'Illiquid Options (Setup Valid)',
        id: 'illiquid-options',
        expectedSignal: 'CALL',
        expectedConfidence: 85,
        expectedPassedRules: ['gammaRegime', 'confluence', 'flowSanity', '30mClose', 'gapRule', 'activity'],
        expectedFailedRules: []
    }
];

// Verify function
function verifyPlaybookRules() {
    let passCount = 0;
    let failCount = 0;
    
    for (const test of TESTS) {
        console.log(`\n📋 TEST: ${test.name}`);
        console.log(`   ID: ${test.id}`);
        console.log(`   Expected: ${test.expectedSignal} (${test.expectedConfidence}% confidence)`);
        
        // Get scenario from mock data
        const scenario = GST.MockData.getById(test.id);
        if (!scenario) {
            console.log('   ❌ FAIL: Scenario not found in mock data');
            failCount++;
            continue;
        }
        
        // Build context
        const context = {
            ticker: scenario.ticker,
            spotPrice: scenario.spotPrice,
            timestamp: scenario.timestamp,
            gammaMetrics: scenario.data.gammaMetrics,
            ohlcv: scenario.data.ohlcv,
            confluence: scenario.data.confluence,
            flow: scenario.data.flow,
            activity: scenario.data.activity,
            optionsChain: null,
            atr: 1.2
        };
        
        // Run evaluation
        const result = GST.playbook.evaluateV12MR(context);
        
        // Extract passed/failed rules
        const passedRules = result.trace.filter(r => r.pass).map(r => r.ruleId);
        const failedRules = result.trace.filter(r => !r.pass).map(r => r.ruleId);
        
        // Verify signal
        const signalMatch = result.signal === test.expectedSignal;
        const confidenceMatch = result.confidence === test.expectedConfidence;
        const passedMatch = test.expectedPassedRules.every(r => passedRules.includes(r));
        const failedMatch = test.expectedFailedRules.every(r => failedRules.includes(r));
        
        console.log(`   Actual: ${result.signal} (${result.confidence}% confidence)`);
        console.log(`   Passed Rules: ${passedRules.join(', ')}`);
        console.log(`   Failed Rules: ${failedRules.join(', ')}`);
        
        if (signalMatch && confidenceMatch && passedMatch && failedMatch) {
            console.log('   ✅ PASS');
            passCount++;
        } else {
            console.log('   ❌ FAIL');
            if (!signalMatch) console.log(`      - Signal mismatch: expected ${test.expectedSignal}, got ${result.signal}`);
            if (!confidenceMatch) console.log(`      - Confidence mismatch: expected ${test.expectedConfidence}, got ${result.confidence}`);
            if (!passedMatch) console.log(`      - Passed rules mismatch`);
            if (!failedMatch) console.log(`      - Failed rules mismatch`);
            failCount++;
        }
    }
    
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log(`  RESULTS: ${passCount} passed, ${failCount} failed`);
    console.log('═══════════════════════════════════════════════════════════\n');
    
    return { passCount, failCount, total: TESTS.length };
}

// Individual rule verification
function verifyIndividualRules() {
    console.log('\n🔍 INDIVIDUAL RULE VERIFICATION');
    console.log('═══════════════════════════════════════════════════════════\n');
    
    const rules = GST.playbook.getRuleDescriptions();
    
    for (const rule of rules) {
        console.log(`${rule.id}:`);
        console.log(`  Name: ${rule.name}`);
        console.log(`  Description: ${rule.description}`);
        console.log('');
    }
    
    return rules.length;
}

// Run verification when DOM is ready
function runVerification() {
    // Check if GST is loaded
    if (!window.GST || !window.GST.playbook || !window.GST.MockData) {
        console.error('❌ GST modules not loaded. Cannot run verification.');
        return;
    }
    
    console.log('✅ GST modules detected');
    console.log(`   Playbook Engine: v${GST.playbook.VERSION}`);
    console.log(`   Mock Data: ${GST.MockData.scenarios.length} scenarios available`);
    
    // Run tests
    const results = verifyPlaybookRules();
    verifyIndividualRules();
    
    // Summary
    console.log('\n📊 VERIFICATION SUMMARY');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Total Scenarios Tested: ${results.total}`);
    console.log(`Passed: ${results.passCount} ✅`);
    console.log(`Failed: ${results.failCount} ❌`);
    console.log(`Success Rate: ${Math.round((results.passCount / results.total) * 100)}%`);
    console.log('═══════════════════════════════════════════════════════════');
    
    return results;
}

// Auto-run only when explicitly called
// Don't auto-run on load - let user run via console: runVerification()

// Export for manual testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { verifyPlaybookRules, verifyIndividualRules, runVerification };
}

console.log('📋 Playbook verification script loaded');
console.log('Run verifyPlaybookRules() or runVerification() to test');
