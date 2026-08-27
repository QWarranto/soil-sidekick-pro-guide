#!/usr/bin/env node
/**
 * SDK Documentation Generator
 * Action 3.1: Automatically generate and update SDK documentation
 * Created: March 2, 2026 for Phase 1 QA Acceleration
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=========================================');
console.log('SDK Documentation Automation');
console.log('Action 3.1: Phase 1 QA Acceleration');
console.log('Date:', new Date().toISOString());
console.log('=========================================');

// Configuration
const CONFIG = {
  sdkPath: __dirname,
  docsOutput: path.join(__dirname, 'docs'),
  apiDocsOutput: path.join(__dirname, 'docs-api'),
  readmePath: path.join(__dirname, 'README.md'),
  packageJsonPath: path.join(__dirname, 'package.json'),
  timestamp: new Date().toISOString()
};

// Ensure output directories exist
function ensureDirectories() {
  console.log('📁 Creating documentation directories...');
  
  [CONFIG.docsOutput, CONFIG.apiDocsOutput].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`  Created: ${dir}`);
    }
  });
}

// Install documentation dependencies if needed
function installDependencies() {
  console.log('📦 Checking documentation dependencies...');
  
  const packageJson = JSON.parse(fs.readFileSync(CONFIG.packageJsonPath, 'utf8'));
  const neededDeps = ['typedoc', 'typedoc-plugin-markdown'];
  const missingDeps = neededDeps.filter(dep => !packageJson.devDependencies?.[dep]);
  
  if (missingDeps.length > 0) {
    console.log(`  Installing missing dependencies: ${missingDeps.join(', ')}`);
    try {
      execSync(`npm install --save-dev ${missingDeps.join(' ')}`, {
        cwd: CONFIG.sdkPath,
        stdio: 'inherit'
      });
      console.log('  ✅ Dependencies installed');
    } catch (error) {
      console.warn('  ⚠️  Could not install dependencies, continuing with basic docs');
    }
  } else {
    console.log('  ✅ All documentation dependencies available');
  }
}

// Generate TypeDoc documentation
function generateTypeDoc() {
  console.log('📚 Generating TypeDoc documentation...');
  
  try {
    // Check if typedoc is available
    execSync('npx typedoc --version', { cwd: CONFIG.sdkPath, stdio: 'pipe' });
    
    // Generate API documentation
    const typedocCommand = `npx typedoc \
      --name "LeafEngines SDK v${require(CONFIG.packageJsonPath).version}" \
      --out "${CONFIG.apiDocsOutput}" \
      --entryPoints "./client.ts" "./sensors/index.ts" "./types.ts" \
      --excludeExternals \
      --excludePrivate \
      --readme "${CONFIG.readmePath}" \
      --includeVersion \
      --theme default`;
    
    console.log('  Running TypeDoc...');
    execSync(typedocCommand, { cwd: CONFIG.sdkPath, stdio: 'inherit' });
    
    console.log(`  ✅ TypeDoc generated at: ${CONFIG.apiDocsOutput}`);
    return true;
  } catch (error) {
    console.warn('  ⚠️  TypeDoc generation failed, creating basic documentation');
    return false;
  }
}

// Generate basic documentation as fallback
function generateBasicDocs() {
  console.log('📝 Generating basic documentation...');
  
  const packageJson = JSON.parse(fs.readFileSync(CONFIG.packageJsonPath, 'utf8'));
  const readmeContent = fs.readFileSync(CONFIG.readmePath, 'utf8');
  
  const basicDocs = {
    metadata: {
      generated: CONFIG.timestamp,
      sdkVersion: packageJson.version,
      phase: 'Phase 1 - Action 3.1'
    },
    overview: {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      entryPoints: ['client.ts', 'sensors/index.ts', 'types.ts']
    },
    quickStart: extractSection(readmeContent, 'Quick Start'),
    apiReference: generateApiReference(),
    examples: extractExamples(),
    changelog: generateChangelog()
  };
  
  const docsPath = path.join(CONFIG.docsOutput, 'index.json');
  fs.writeFileSync(docsPath, JSON.stringify(basicDocs, null, 2));
  
  // Also create HTML version
  const htmlPath = path.join(CONFIG.docsOutput, 'index.html');
  fs.writeFileSync(htmlPath, generateHtmlDocs(basicDocs));
  
  console.log(`  ✅ Basic documentation generated at: ${docsPath}`);
  console.log(`  ✅ HTML documentation generated at: ${htmlPath}`);
}

// Helper: Extract section from README
function extractSection(content, sectionTitle) {
  const lines = content.split('\n');
  const startIndex = lines.findIndex(line => line.includes(`## ${sectionTitle}`));
  
  if (startIndex === -1) return '';
  
  let endIndex = startIndex + 1;
  while (endIndex < lines.length && !lines[endIndex].startsWith('## ')) {
    endIndex++;
  }
  
  return lines.slice(startIndex, endIndex).join('\n');
}

// Helper: Generate API reference from source files
function generateApiReference() {
  console.log('  Analyzing source files for API reference...');
  
  const apiRef = {
    client: analyzeFile(path.join(CONFIG.sdkPath, 'client.ts')),
    sensors: analyzeDirectory(path.join(CONFIG.sdkPath, 'sensors')),
    types: analyzeFile(path.join(CONFIG.sdkPath, 'types.ts'))
  };
  
  return apiRef;
}

// Helper: Analyze TypeScript file for exports
function analyzeFile(filePath) {
  if (!fs.existsSync(filePath)) return { error: 'File not found' };
  
  const content = fs.readFileSync(filePath, 'utf8');
  const exports = [];
  
  // Simple regex for class and function exports
  const classMatches = content.match(/export class (\w+)/g) || [];
  const functionMatches = content.match(/export function (\w+)/g) || [];
  const interfaceMatches = content.match(/export interface (\w+)/g) || [];
  const typeMatches = content.match(/export type (\w+)/g) || [];
  
  return {
    fileName: path.basename(filePath),
    classes: classMatches.map(m => m.replace('export class ', '')),
    functions: functionMatches.map(m => m.replace('export function ', '')),
    interfaces: interfaceMatches.map(m => m.replace('export interface ', '')),
    types: typeMatches.map(m => m.replace('export type ', '')),
    lineCount: content.split('\n').length
  };
}

// Helper: Analyze directory
function analyzeDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return { error: 'Directory not found' };
  
  const files = fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.ts') && !f.endsWith('.d.ts'))
    .map(f => analyzeFile(path.join(dirPath, f)));
  
  return {
    directory: path.basename(dirPath),
    fileCount: files.length,
    files: files
  };
}

// Helper: Extract examples from test-sdk.ts
function extractExamples() {
  const exampleFile = path.join(CONFIG.sdkPath, 'test-sdk.ts');
  
  if (!fs.existsSync(exampleFile)) {
    return { note: 'Example file not found' };
  }
  
  const content = fs.readFileSync(exampleFile, 'utf8');
  const examples = [];
  
  // Extract example blocks (simplified)
  const lines = content.split('\n');
  let currentExample = null;
  
  lines.forEach((line, index) => {
    if (line.includes('// Example:')) {
      if (currentExample) examples.push(currentExample);
      currentExample = {
        title: line.replace('// Example:', '').trim(),
        code: ''
      };
    } else if (currentExample && line.trim() && !line.startsWith('//')) {
      currentExample.code += line + '\n';
    }
  });
  
  if (currentExample) examples.push(currentExample);
  
  return {
    sourceFile: 'test-sdk.ts',
    exampleCount: examples.length,
    examples: examples.slice(0, 5) // Limit to 5 examples
  };
}

// Helper: Generate changelog
function generateChangelog() {
  return {
    currentVersion: require(CONFIG.packageJsonPath).version,
    recentChanges: [
      {
        date: '2026-03-02',
        change: 'Phase 1 QA Acceleration - Documentation automation implemented',
        type: 'improvement'
      },
      {
        date: '2026-02-28',
        change: 'SDK v2.0 released with Skyline integration',
        type: 'major'
      }
    ]
  };
}

// Helper: Generate HTML documentation
function generateHtmlDocs(data) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LeafEngines SDK Documentation</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        header { border-bottom: 2px solid #4CAF50; padding-bottom: 20px; margin-bottom: 30px; }
        h1 { color: #2E7D32; margin: 0; }
        .subtitle { color: #666; margin: 5px 0 20px; }
        .badge { background: #4CAF50; color: white; padding: 3px 8px; border-radius: 4px; font-size: 12px; margin-left: 10px; }
        .section { margin: 30px 0; }
        h2 { color: #388E3C; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
        .card { background: #f9f9f9; border-left: 4px solid #4CAF50; padding: 15px; margin: 15px 0; border-radius: 4px; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 4px; overflow-x: auto; }
        code { font-family: 'Courier New', monospace; }
        .metadata { background: #e8f5e9; padding: 15px; border-radius: 4px; margin: 20px 0; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>LeafEngines SDK <span class="badge">v${data.overview.version}</span></h1>
            <div class="subtitle">${data.overview.description}</div>
            <div class="metadata">
                <strong>Generated:</strong> ${data.metadata.generated}<br>
                <strong>Phase:</strong> ${data.metadata.phase}
            </div>
        </header>
        
        <div class="section">
            <h2>Quick Start</h2>
            <div class="card">
                <pre><code>${data.quickStart || 'Quick start section not found'}</code></pre>
            </div>
        </div>
        
        <div class="section">
            <h2>API Reference</h2>
            <div class="card">
                <h3>Client Module</h3>
                <p><strong>File:</strong> ${data.apiReference.client.fileName}</p>
                <p><strong>Classes:</strong> ${data.apiReference.client.classes?.join(', ') || 'None'}</p>
                <p><strong>Functions:</strong> ${data.apiReference.client.functions?.join(', ') || 'None'}</p>
            </div>
            
            <div class="card">
                <h3>Sensors Module</h3>
                <p><strong>Directory:</strong> ${data.apiReference.sensors.directory}</p>
                <p><strong>Files:</strong> ${data.apiReference.sensors.fileCount}</p>
            </div>
        </div>
        
        <div class="section">
            <h2>Examples</h2>
            <p><strong>Total examples found:</strong> ${data.examples.exampleCount}</p>
            ${data.examples.examples?.map(example => `
            <div class="card">
                <h3>${example.title}</h3>
                <pre><code>${example.code}</code></pre>
            </div>
            `).join('') || '<p>No examples found</p>'}
        </div>
        
        <div class="section">
            <h2>Changelog</h2>
            <div class="card">
                <p><strong>Current Version:</strong> ${data.changelog.currentVersion}</p>
                <ul>
                    ${data.changelog.recentChanges.map(change => `
                    <li><strong>${change.date}</strong> (${change.type}): ${change.change}</li>
                    `).join('')}
                </ul>
            </div>
        </div>
        
        <div class="footer">
            <p>Documentation automatically generated as part of Phase 1 QA Acceleration.</p>
            <p>Action 3.1: SDK Documentation Automation - Completed ${new Date().toLocaleDateString()}</p>
        </div>
    </div>
</body>
</html>`;
}

// Main execution
async function main() {
  console.log('\n🚀 Starting SDK documentation automation...\n');
  
  try {
    // Step 1: Prepare directories
    ensureDirectories();
    
    // Step 2: Install dependencies if needed
    installDependencies();
    
    // Step 3: Try to generate TypeDoc documentation
    const typedocSuccess = generateTypeDoc();
    
    // Step 4: Generate basic docs (always)
    generateBasicDocs();
    
    // Step 5: Create documentation report
    createReport(typedocSuccess);
    
    console.log('\n=========================================');
    console.log('✅ SDK Documentation Automation Complete');
    console.log('=========================================');
    console.log('\n📁 Generated documentation:');
    console.log(`  - ${CONFIG.docsOutput}/index.json (Basic docs)`);
    console.log(`  - ${CONFIG.docsOutput}/index.html (HTML view)`);
    if (typedocSuccess) {
      console.log(`  - ${CONFIG.apiDocsOutput}/ (TypeDoc API docs)`);
    }
    console.log('\n📈 March 9 Integration:');
    console.log('  "Our Phase 1 documentation automation ensures SDK docs');
    console.log('   are always up-to-date with comprehensive API reference."');
    
  } catch (error) {
    console.error('❌ Documentation generation failed:', error.message);
    process.exit(1);
  }
}

// Create documentation report
function createReport(typedocSuccess) {
  const report = {
    action: '3.1',
    name: 'SDK Documentation Automation',
    timestamp: CONFIG.timestamp,
    status: 'completed',
    outputs: {
      basicDocs: `${CONFIG.docsOutput}/index.json`,
      htmlDocs: `${CONFIG.docsOutput}/index.html`,
      typedocGenerated: typedocSuccess,
      typedocPath: typedocSuccess ? CONFIG.apiDocsOutput : null
    },
    metrics: {
      filesAnalyzed: 3, // client.ts, sensors/, types.ts
      examplesExtracted: extractExamples().exampleCount,
      generationTime: new Date().toISOString()
    },
    march9Integration: {
      narrative: 'Automated SDK documentation ensures developer experience consistency',
      value: 'Professional documentation practices demonstrate software maturity'
    }
  };
  
  const reportPath = path.join(CONFIG.docsOutput, 'generation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`\n📋 Generation report: ${reportPath}`);
}

// Run the main function
main().catch(console.error);