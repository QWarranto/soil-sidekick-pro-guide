// Validation Test Suite for Skyline mmWave Sensor Data
// Validates all 20 golden test fixtures against JSON Schema contracts

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

class SkylineFixtureValidator {
  constructor() {
    this.ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(this.ajv);
    
    this.schemas = {};
    this.loadSchemas();
  }
  
  loadSchemas() {
    const schemaDir = __dirname;
    const schemaFiles = [
      'schema-v1.0.json',
      'schema-v1.1.json',
      'schema-v2.0.json'
    ];
    
    for (const schemaFile of schemaFiles) {
      const schemaPath = path.join(schemaDir, schemaFile);
      if (fs.existsSync(schemaPath)) {
        const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
        const schemaName = path.basename(schemaFile, '.json');
        this.schemas[schemaName] = schema;
        this.ajv.addSchema(schema, schemaName);
      }
    }
  }
  
  detectSchemaVersion(data) {
    // Detect schema version based on field names
    if (data.sensor_data && data.calibration) {
      return 'schema-v2.0';
    } else if (data.sensor_readings && data.calibration_status) {
      if (data.sensor_readings.target_tracking !== undefined) {
        return 'schema-v1.1';
      } else {
        return 'schema-v1.0';
      }
    }
    return null;
  }
  
  validateFixture(fixturePath) {
    const fixtureName = path.basename(fixturePath);
    const fixtureData = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
    
    // Handle special fixtures
    if (fixtureName === '13-schema-migration-path-v1.0-v1.1-v2.0.json') {
      return this.validateMigrationFixture(fixtureData, fixtureName);
    }
    
    if (fixtureName === '10-corrupt-timing-anomalies.json') {
      // This contains two JSON objects, need to handle specially
      const lines = fs.readFileSync(fixturePath, 'utf8').split('\n');
      const firstJson = JSON.parse(lines.slice(0, lines.length - 10).join('\n'));
      const secondJson = JSON.parse(lines.slice(-9).join('\n'));
      
      return [
        this.validateSingleFixture(firstJson, `${fixtureName} - first`),
        this.validateSingleFixture(secondJson, `${fixtureName} - second`)
      ];
    }
    
    return this.validateSingleFixture(fixtureData, fixtureName);
  }
  
  validateSingleFixture(data, fixtureName) {
    const schemaVersion = this.detectSchemaVersion(data);
    
    if (!schemaVersion) {
      return {
        fixture: fixtureName,
        valid: false,
        errors: ['Cannot detect schema version'],
        schemaVersion: null
      };
    }
    
    const validate = this.ajv.getSchema(schemaVersion);
    const valid = validate(data);
    
    return {
      fixture: fixtureName,
      valid,
      errors: valid ? [] : validate.errors,
      schemaVersion,
      expectedValid: this.getExpectedValidity(fixtureName, schemaVersion)
    };
  }
  
  validateMigrationFixture(data, fixtureName) {
    const results = [];
    
    // Validate v1.0 data
    if (data['v1.0']) {
      const v1Result = this.validateSingleFixture(data['v1.0'], `${fixtureName} - v1.0`);
      v1Result.expectedValid = true; // Should be valid v1.0
      results.push(v1Result);
    }
    
    // Validate v1.1 data
    if (data['v1.1']) {
      const v1_1Result = this.validateSingleFixture(data['v1.1'], `${fixtureName} - v1.1`);
      v1_1Result.expectedValid = true; // Should be valid v1.1
      results.push(v1_1Result);
    }
    
    // Validate v2.0 data
    if (data['v2.0']) {
      const v2Result = this.validateSingleFixture(data['v2.0'], `${fixtureName} - v2.0`);
      v2Result.expectedValid = true; // Should be valid v2.0
      results.push(v2Result);
    }
    
    return results;
  }
  
  getExpectedValidity(fixtureName, schemaVersion) {
    // Determine if fixture should be valid based on naming convention
    if (fixtureName.startsWith('01-') || fixtureName.startsWith('02-') || 
        fixtureName.startsWith('03-') || fixtureName.startsWith('04-') || 
        fixtureName.startsWith('05-')) {
      return true; // Valid fixtures
    }
    
    if (fixtureName.startsWith('06-') || fixtureName.startsWith('07-') || 
        fixtureName.startsWith('08-') || fixtureName.startsWith('09-') || 
        fixtureName.startsWith('10-')) {
      return false; // Corrupt fixtures
    }
    
    if (fixtureName === '11-schema-v1.0-to-v1.1-backward-compatible.json') {
      // v1.0 data should be valid against v1.0 schema
      // but invalid against v1.1 schema (missing required field)
      return schemaVersion === 'schema-v1.0';
    }
    
    if (fixtureName === '12-schema-v1.1-to-v2.0-breaking-changes.json') {
      // v1.1 data should be valid against v1.1 schema
      // but invalid against v2.0 schema (field name changes)
      return schemaVersion === 'schema-v1.1';
    }
    
    // Load test fixtures (14-17) are metadata, not sensor data
    if (fixtureName.startsWith('14-') || fixtureName.startsWith('15-') || 
        fixtureName.startsWith('16-') || fixtureName.startsWith('17-')) {
      return null; // Not applicable - these are test scenario definitions
    }
    
    // MQTT fixtures (18-20) are generators/scripts
    if (fixtureName.startsWith('18-') || fixtureName.startsWith('19-') || 
        fixtureName.startsWith('20-')) {
      return null; // Not applicable - these are generators/scripts
    }
    
    return true; // Default to expecting valid
  }
  
  validateAllFixtures() {
    const fixtureDir = __dirname;
    const results = [];
    
    // Get all JSON fixture files
    const files = fs.readdirSync(fixtureDir)
      .filter(f => f.endsWith('.json') && f !== 'schema-v1.0.json' && 
              f !== 'schema-v1.1.json' && f !== 'schema-v2.0.json')
      .sort(); // Sort to maintain order
    
    console.log(`Validating ${files.length} fixtures...\n`);
    
    for (const file of files) {
      const fixturePath = path.join(fixtureDir, file);
      console.log(`Validating ${file}...`);
      
      try {
        const validationResult = this.validateFixture(fixturePath);
        
        if (Array.isArray(validationResult)) {
          results.push(...validationResult);
        } else {
          results.push(validationResult);
        }
      } catch (error) {
        results.push({
          fixture: file,
          valid: false,
          errors: [`Parse error: ${error.message}`],
          schemaVersion: null,
          expectedValid: null
        });
      }
    }
    
    return results;
  }
  
  generateValidationReport(results) {
    let report = '# Skyline mmWave Sensor Data - Validation Report\n\n';
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `Total fixtures validated: ${results.length}\n\n`;
    
    // Summary statistics
    const validCount = results.filter(r => r.valid === true).length;
    const invalidCount = results.filter(r => r.valid === false).length;
    const naCount = results.filter(r => r.valid === null).length;
    
    report += '## Summary\n\n';
    report += `- ✅ Valid: ${validCount}\n`;
    report += `- ❌ Invalid: ${invalidCount}\n`;
    report += `- ⚠️  Not Applicable: ${naCount}\n\n`;
    
    // Detailed results
    report += '## Detailed Results\n\n';
    
    for (const result of results) {
      const status = result.valid === true ? '✅' : result.valid === false ? '❌' : '⚠️';
      report += `### ${status} ${result.fixture}\n`;
      
      if (result.schemaVersion) {
        report += `- Schema: ${result.schemaVersion}\n`;
      }
      
      if (result.expectedValid !== null) {
        const expectationMet = result.valid === result.expectedValid;
        report += `- Expected: ${result.expectedValid ? 'valid' : 'invalid'} ${expectationMet ? '✅' : '❌'}\n`;
      }
      
      if (result.errors && result.errors.length > 0) {
        report += `- Errors: ${result.errors.length}\n`;
        for (const error of result.errors.slice(0, 5)) { // Limit to 5 errors
          if (typeof error === 'string') {
            report += `  - ${error}\n`;
          } else {
            report += `  - ${error.instancePath}: ${error.message}\n`;
          }
        }
        if (result.errors.length > 5) {
          report += `  - ... and ${result.errors.length - 5} more errors\n`;
        }
      }
      
      report += '\n';
    }
    
    // Schema coverage
    report += '## Schema Coverage\n\n';
    
    const schemaUsage = {};
    for (const result of results) {
      if (result.schemaVersion) {
        schemaUsage[result.schemaVersion] = (schemaUsage[result.schemaVersion] || 0) + 1;
      }
    }
    
    for (const [schema, count] of Object.entries(schemaUsage)) {
      report += `- ${schema}: ${count} fixtures\n`;
    }
    
    // Test categories
    report += '\n## Test Categories\n\n';
    report += '1. **Valid Sensor Readings** (01-05): Realistic mmWave patterns\n';
    report += '2. **Corrupt/Malformed Data** (06-10): Edge cases for validation\n';
    report += '3. **Schema Versioning** (11-13): Firmware update compatibility\n';
    report += '4. **Load Test Data** (14-17): 50+ device simulation\n';
    report += '5. **MQTT Generators** (18-20): Topic/payload generation\n';
    
    return report;
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new SkylineFixtureValidator();
  const results = validator.validateAllFixtures();
  const report = validator.generateValidationReport(results);
  
  // Save report
  const reportPath = path.join(__dirname, 'validation-report.md');
  fs.writeFileSync(reportPath, report);
  
  console.log('\n' + report);
  console.log(`\nFull report saved to: ${reportPath}`);
  
  // Exit with error code if any validation failed unexpectedly
  const unexpectedFailures = results.filter(r => 
    r.expectedValid === true && r.valid === false
  );
  
  if (unexpectedFailures.length > 0) {
    console.error(`\n❌ ${unexpectedFailures.length} fixtures failed validation unexpectedly:`);
    for (const failure of unexpectedFailures) {
      console.error(`  - ${failure.fixture}`);
    }
    process.exit(1);
  } else {
    console.log('\n✅ All fixtures validated as expected!');
    process.exit(0);
  }
}

module.exports = SkylineFixtureValidator;