/**
 * 20-validation-test-suite.js
 * 
 * Semantic validator for Skyline mmWave golden fixtures.
 * IMPORTANT: Only scans numbered fixture files (01-xx.json through 99-xx.json).
 * Non-numbered files (e.g., cross_version_validation.js, README.md) are excluded.
 */

import { readFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';

const FIXTURE_DIR = join(import.meta.dirname ?? __dirname, '.');

// Only match files that start with two digits followed by a dash
const NUMBERED_FIXTURE_FILTER = /^\d{2}-.*\.json$/;

/**
 * Semantic validation rules for individual fixture files.
 */
const SEMANTIC_RULES = [
  {
    name: 'has-valid-id',
    description: 'Each fixture must have a non-empty string id',
    validate: (data, fileName) => {
      if (!data.id || typeof data.id !== 'string' || data.id.trim().length === 0) {
        return `${fileName}: 'id' is missing or empty`;
      }
      return null;
    },
  },
  {
    name: 'version-semver',
    description: 'Version field must be valid semver',
    validate: (data, fileName) => {
      if (!data.version) return `${fileName}: missing 'version'`;
      if (!/^\d+\.\d+(\.\d+)?$/.test(data.version)) {
        return `${fileName}: invalid version format '${data.version}'`;
      }
      return null;
    },
  },
  {
    name: 'timestamp-iso8601',
    description: 'Timestamp must be valid ISO 8601',
    validate: (data, fileName) => {
      if (!data.timestamp) return `${fileName}: missing 'timestamp'`;
      if (isNaN(new Date(data.timestamp).getTime())) {
        return `${fileName}: invalid timestamp '${data.timestamp}'`;
      }
      return null;
    },
  },
  {
    name: 'measurements-non-empty',
    description: 'Measurements array must exist and be non-empty',
    validate: (data, fileName) => {
      if (!Array.isArray(data.measurements)) {
        return `${fileName}: 'measurements' is not an array`;
      }
      if (data.measurements.length === 0) {
        return `${fileName}: 'measurements' array is empty`;
      }
      return null;
    },
  },
  {
    name: 'frequency-in-range',
    description: 'frequency_ghz must be within plausible mmWave range',
    validate: (data, fileName) => {
      if (typeof data.frequency_ghz !== 'number') {
        return `${fileName}: 'frequency_ghz' is not a number`;
      }
      if (data.frequency_ghz < 1 || data.frequency_ghz > 300) {
        return `${fileName}: frequency_ghz ${data.frequency_ghz} outside [1, 300] GHz`;
      }
      return null;
    },
  },
  {
    name: 'sensor-type-present',
    description: 'sensor_type must be a non-empty string',
    validate: (data, fileName) => {
      if (!data.sensor_type || typeof data.sensor_type !== 'string') {
        return `${fileName}: 'sensor_type' is missing or invalid`;
      }
      return null;
    },
  },
];

export function runSemanticValidation() {
  const allFiles = readdirSync(FIXTURE_DIR);
  const fixtures = allFiles.filter(f => NUMBERED_FIXTURE_FILTER.test(f)).sort();
  const skipped = allFiles.filter(f => f.endsWith('.json') && !NUMBERED_FIXTURE_FILTER.test(f));

  console.log(`Scanning ${fixtures.length} numbered fixtures (skipping ${skipped.length} non-numbered JSON files)`);
  if (skipped.length > 0) {
    console.log(`  Skipped: ${skipped.join(', ')}\n`);
  }

  if (fixtures.length === 0) {
    console.log('⚠  No numbered fixtures found.');
    return { passed: true, total: 0, errors: [] };
  }

  const allErrors = [];

  for (const file of fixtures) {
    const filePath = join(FIXTURE_DIR, file);
    let data;
    try {
      data = JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch (e) {
      allErrors.push(`${file}: Failed to parse — ${e.message}`);
      continue;
    }

    for (const rule of SEMANTIC_RULES) {
      const error = rule.validate(data, file);
      if (error) {
        allErrors.push(error);
      }
    }
  }

  if (allErrors.length === 0) {
    console.log(`✓ All ${fixtures.length} fixtures passed ${SEMANTIC_RULES.length} semantic rules.\n`);
  } else {
    console.log(`\n✗ ${allErrors.length} semantic error(s) found:\n`);
    allErrors.forEach(e => console.log(`  - ${e}`));
  }

  return {
    passed: allErrors.length === 0,
    total: fixtures.length,
    errors: allErrors,
  };
}

// Auto-run
const isMainModule =
  typeof process !== 'undefined' && process.argv[1]?.endsWith('20-validation-test-suite.js');

if (isMainModule) {
  const { passed } = runSemanticValidation();
  process.exit(passed ? 0 : 1);
}
