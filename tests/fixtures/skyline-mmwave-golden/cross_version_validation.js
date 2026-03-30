/**
 * I-04: Cross-Version Validation for Skyline mmWave Golden Fixtures
 * 
 * Validates that numbered golden fixture files (01-xx) maintain
 * backward-compatible schema structure across versions.
 * Ensures field presence, type consistency, and value ranges.
 */

import { readFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';

const FIXTURE_DIR = join(import.meta.dirname ?? __dirname, '.');
const NUMBERED_FIXTURE_PATTERN = /^\d{2}-.*\.json$/;

// Required top-level fields across all fixture versions
const REQUIRED_FIELDS = [
  'id',
  'version',
  'timestamp',
  'sensor_type',
  'frequency_ghz',
  'measurements',
];

// Type expectations for top-level fields
const FIELD_TYPES = {
  id: 'string',
  version: 'string',
  timestamp: 'string',
  sensor_type: 'string',
  frequency_ghz: 'number',
  measurements: 'object', // array
};

// Acceptable version format
const VERSION_PATTERN = /^\d+\.\d+(\.\d+)?$/;

function getNumberedFixtures() {
  return readdirSync(FIXTURE_DIR)
    .filter(f => NUMBERED_FIXTURE_PATTERN.test(f))
    .sort();
}

function validateFixture(filePath) {
  const errors = [];
  const fileName = basename(filePath);

  let data;
  try {
    const raw = readFileSync(filePath, 'utf-8');
    data = JSON.parse(raw);
  } catch (e) {
    errors.push(`${fileName}: Failed to parse JSON — ${e.message}`);
    return { fileName, errors, valid: false };
  }

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!(field in data)) {
      errors.push(`${fileName}: Missing required field '${field}'`);
    }
  }

  // Check field types
  for (const [field, expectedType] of Object.entries(FIELD_TYPES)) {
    if (field in data) {
      const actualType = Array.isArray(data[field]) ? 'object' : typeof data[field];
      if (actualType !== expectedType) {
        errors.push(`${fileName}: Field '${field}' expected ${expectedType}, got ${actualType}`);
      }
    }
  }

  // Validate version format
  if (data.version && !VERSION_PATTERN.test(data.version)) {
    errors.push(`${fileName}: Invalid version format '${data.version}' (expected semver)`);
  }

  // Validate frequency range (mmWave: 24–100 GHz typical)
  if (typeof data.frequency_ghz === 'number') {
    if (data.frequency_ghz < 1 || data.frequency_ghz > 300) {
      errors.push(`${fileName}: frequency_ghz ${data.frequency_ghz} out of plausible range [1, 300]`);
    }
  }

  // Validate measurements array
  if (Array.isArray(data.measurements)) {
    if (data.measurements.length === 0) {
      errors.push(`${fileName}: measurements array is empty`);
    }
  }

  // Validate ISO timestamp
  if (data.timestamp) {
    const d = new Date(data.timestamp);
    if (isNaN(d.getTime())) {
      errors.push(`${fileName}: Invalid ISO timestamp '${data.timestamp}'`);
    }
  }

  return { fileName, errors, valid: errors.length === 0 };
}

function crossVersionConsistencyCheck(results) {
  const errors = [];
  const versions = results
    .filter(r => r.data?.version)
    .map(r => ({ file: r.fileName, version: r.data.version }));

  // Check that sensor_type is consistent across all fixtures
  const sensorTypes = new Set(
    results.filter(r => r.data?.sensor_type).map(r => r.data.sensor_type)
  );
  if (sensorTypes.size > 1) {
    errors.push(
      `Inconsistent sensor_type across fixtures: ${[...sensorTypes].join(', ')}`
    );
  }

  return errors;
}

// Main execution
export function runValidation() {
  const fixtures = getNumberedFixtures();
  console.log(`Found ${fixtures.length} numbered fixture(s) to validate.\n`);

  if (fixtures.length === 0) {
    console.log('⚠  No numbered fixtures found. Populate the directory with 01-xx.json files.');
    return { passed: true, total: 0, failed: 0 };
  }

  const results = [];
  let failCount = 0;

  for (const file of fixtures) {
    const filePath = join(FIXTURE_DIR, file);
    const result = validateFixture(filePath);

    // Attach parsed data for cross-version checks
    try {
      result.data = JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch { /* already reported */ }

    results.push(result);

    if (!result.valid) {
      failCount++;
      console.log(`✗ ${result.fileName}`);
      result.errors.forEach(e => console.log(`    ${e}`));
    } else {
      console.log(`✓ ${result.fileName}`);
    }
  }

  // Cross-version consistency
  const crossErrors = crossVersionConsistencyCheck(results);
  if (crossErrors.length > 0) {
    failCount++;
    console.log('\n✗ Cross-version consistency:');
    crossErrors.forEach(e => console.log(`    ${e}`));
  } else if (fixtures.length > 1) {
    console.log('\n✓ Cross-version consistency check passed');
  }

  console.log(`\n${fixtures.length - failCount}/${fixtures.length} fixtures passed.`);

  return {
    passed: failCount === 0,
    total: fixtures.length,
    failed: failCount,
  };
}

// Auto-run when executed directly
const isMainModule =
  typeof process !== 'undefined' && process.argv[1]?.endsWith('cross_version_validation.js');

if (isMainModule) {
  const { passed } = runValidation();
  process.exit(passed ? 0 : 1);
}
