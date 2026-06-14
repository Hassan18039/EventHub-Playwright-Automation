#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Load configuration from .kanerc
const kanercPath = path.join(__dirname, '../.kanerc');
let config = {
  baseUrl: 'https://eventhub.rahulshettyacademy.com',
  credentials: { email: 'testing@gmail.com', password: 'Testing@123' },
  timeout: 600,
  maxSteps: 100
};

if (fs.existsSync(kanercPath)) {
  try {
    const fileConfig = JSON.parse(fs.readFileSync(kanercPath, 'utf-8'));
    config = { ...config, ...fileConfig };
  } catch (err) {
    console.warn(`Warning: Could not parse .kanerc: ${err.message}`);
  }
}

const BASE_URL = config.baseUrl;
const CREDS = config.credentials;
const DEFAULT_TIMEOUT = config.timeout;
const MAX_STEPS = config.maxSteps;

const FEATURES_DIR = path.join(__dirname, '../features');
const REPORTS_DIR = path.join(__dirname, '../gherkin-reports');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

/**
 * Parse Gherkin feature file
 */
function parseFeatureFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  let feature = null;
  let scenarios = [];
  let currentScenario = null;
  let currentTags = [];

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('@')) {
      currentTags.push(trimmed);
      continue;
    }

    if (trimmed.startsWith('Feature:')) {
      feature = trimmed.replace('Feature:', '').trim();
    } else if (trimmed.startsWith('Scenario:')) {
      if (currentScenario) {
        scenarios.push(currentScenario);
      }
      currentScenario = {
        name: trimmed.replace('Scenario:', '').trim(),
        steps: [],
        tags: [...currentTags]
      };
      currentTags = [];
    } else if (currentScenario && (trimmed.startsWith('Given') || trimmed.startsWith('When') || trimmed.startsWith('Then') || trimmed.startsWith('And') || trimmed.startsWith('But'))) {
      const keyword = trimmed.split(' ')[0];
      const text = trimmed.substring(keyword.length).trim();
      currentScenario.steps.push({ keyword, text });
    }
  }

  if (currentScenario) {
    scenarios.push(currentScenario);
  }

  return { feature, scenarios };
}

/**
 * Map Gherkin step to Kane-CLI objective text
 */
function stepToObjective(step) {
  const { text } = step;
  // Replace Gherkin placeholders with actual values
  let objective = text
    .replace(/testing@gmail\.com|valid email/gi, CREDS.email)
    .replace(/Testing@123|valid password/gi, CREDS.password);
  return objective;
}

/**
 * Execute scenario with Kane-CLI
 */
function executeScenario(scenario, headless = false, timeout = null) {
  timeout = timeout || DEFAULT_TIMEOUT;

  const stepsText = scenario.steps
    .map(s => stepToObjective(s))
    .join('. ');

  // Build objective with URL from config
  const objective = `Navigate to ${BASE_URL} and ${stepsText}`;

  // Build Kane-CLI command
  let cmd = `kane-cli run "${objective}"`;

  if (headless) {
    cmd += ' --headless';
  }

  cmd += ` --max-steps ${MAX_STEPS} --timeout ${timeout}`;
  cmd += ` --variables '${JSON.stringify(CREDS)}'`;

  console.log(`\n  ▶ ${scenario.name}`);

  try {
    execSync(cmd, { stdio: 'inherit', maxBuffer: 10 * 1024 * 1024 });
    return { passed: true, scenario: scenario.name, tags: scenario.tags };
  } catch (err) {
    return { passed: false, scenario: scenario.name, tags: scenario.tags, error: err.message };
  }
}

/**
 * Find and load related data files
 */
function loadRelatedData(featureName) {
  const dataMap = {
    'user-authentication': ['data/auth/user.json', 'data/auth/register.json'],
    'event-browsing': ['data/admin/manage-events.json'],
    'event-booking': ['data/Book-Event/book-event.json', 'data/auth/user.json'],
    'form-validation': ['data/Book-Event/book-event.json'],
    'my-bookings': ['data/auth/user.json']
  };

  const relevantFiles = dataMap[featureName] || [];

  for (const filePath of relevantFiles) {
    const fullPath = path.join(__dirname, '..', filePath);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ Loaded: ${filePath}`);
    }
  }
}

/**
 * Main execution
 */
async function runGherkinFeatures(featureName, headless = false, timeout = null) {
  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║   GHERKIN EXECUTOR - EventHub with Kane-CLI      ║');
  console.log('╚════════════════════════════════════════════════════╝\n');

  const featureFile = path.join(FEATURES_DIR, `${featureName}.feature`);

  if (!fs.existsSync(featureFile)) {
    console.error(`❌ Feature file not found: ${featureFile}`);
    console.log('\nAvailable features:');
    fs.readdirSync(FEATURES_DIR)
      .filter(f => f.endsWith('.feature'))
      .forEach(f => console.log(`  - ${f.replace('.feature', '')}`));
    process.exit(1);
  }

  console.log(`📂 Feature: ${featureName}`);
  console.log(`📄 File: ${featureFile}`);

  const { feature, scenarios } = parseFeatureFile(featureFile);
  console.log(`✅ Parsed feature: ${feature}\n`);

  console.log('📦 Loading test data...');
  loadRelatedData(featureName);
  console.log();

  console.log(`📋 Scenarios found: ${scenarios.length}`);
  scenarios.forEach((s, i) => {
    const tags = s.tags.length > 0 ? ` ${s.tags.join(' ')}` : '';
    console.log(`  ${i + 1}. ${s.name}${tags}`);
  });

  const mode = headless ? 'headless' : 'headed';
  timeout = timeout || DEFAULT_TIMEOUT;
  console.log(`\n⚙️  Mode: ${mode}`);
  console.log(`⏱️  Timeout: ${timeout}s`);
  console.log(`🔧 URL: ${BASE_URL}`);
  console.log(`👤 User: ${CREDS.email}`);
  console.log(`🚀 Executing...\n`);

  const results = [];
  for (const scenario of scenarios) {
    const result = executeScenario(scenario, headless, timeout);
    results.push(result);
  }

  generateReport(featureName, feature, scenarios, results);

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  console.log('\n╔════════════════════════════════════════════════════╗');
  console.log('║                  EXECUTION SUMMARY                 ║');
  console.log('╚════════════════════════════════════════════════════╝');
  console.log(`\n✅ Passed:  ${passed}`);
  console.log(`❌ Failed:  ${failed}`);
  console.log(`📊 Total:   ${results.length}`);

  if (failed > 0) {
    console.log('\n❌ Failed Scenarios:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  • ${r.scenario}`);
    });
  }

  console.log(`\n📁 Report: ${path.join(REPORTS_DIR, 'index.html')}\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

/**
 * Generate HTML report
 */
function generateReport(featureName, featureTitle, scenarios, results) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Gherkin Execution Report - ${featureTitle}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .header { background: #2c3e50; color: white; padding: 20px; border-radius: 5px; }
    .summary { display: flex; gap: 20px; margin: 20px 0; }
    .summary-card { background: white; padding: 15px; border-radius: 5px; flex: 1; }
    .passed { border-left: 5px solid #27ae60; }
    .failed { border-left: 5px solid #e74c3c; }
    .scenario { background: white; margin: 10px 0; padding: 15px; border-radius: 5px; }
    .scenario.passed { border-left: 4px solid #27ae60; }
    .scenario.failed { border-left: 4px solid #e74c3c; }
    .tags { margin: 5px 0; font-size: 12px; }
    .tag { display: inline-block; background: #3498db; color: white; padding: 2px 8px; border-radius: 3px; margin-right: 5px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Gherkin Execution Report</h1>
    <p>Feature: ${featureTitle}</p>
    <p>Executed with Kane-CLI on ${new Date().toLocaleString()}</p>
  </div>

  <div class="summary">
    <div class="summary-card passed">
      <h3>✅ Passed</h3>
      <p style="font-size: 24px; margin: 0;">${results.filter(r => r.passed).length}</p>
    </div>
    <div class="summary-card failed">
      <h3>❌ Failed</h3>
      <p style="font-size: 24px; margin: 0;">${results.filter(r => !r.passed).length}</p>
    </div>
  </div>

  <h2>Scenarios</h2>
  ${results.map(r => `
    <div class="scenario ${r.passed ? 'passed' : 'failed'}">
      <h4>${r.passed ? '✅' : '❌'} ${r.scenario}</h4>
      ${r.tags && r.tags.length > 0 ? `
        <div class="tags">
          ${r.tags.map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
      ` : ''}
    </div>
  `).join('')}
</body>
</html>
  `;

  const reportPath = path.join(REPORTS_DIR, `${featureName}-report.html`);
  fs.writeFileSync(reportPath, html);
  fs.writeFileSync(path.join(REPORTS_DIR, 'index.html'), html);

  fs.writeFileSync(path.join(REPORTS_DIR, `${featureName}-results.json`), JSON.stringify({
    feature: featureTitle,
    timestamp: new Date().toISOString(),
    passed: results.filter(r => r.passed).length,
    failed: results.filter(r => !r.passed).length,
    total: results.length,
    results
  }, null, 2));
}

const args = process.argv.slice(2);
const featureName = args[0];
const headless = args.includes('--headless');

let timeout = null;
const timeoutIndex = args.findIndex(arg => arg === '--timeout');
if (timeoutIndex !== -1 && args[timeoutIndex + 1]) {
  timeout = parseInt(args[timeoutIndex + 1], 10);
}

if (!featureName) {
  console.log('Usage: node scripts/gherkin-executor.js <feature-name> [options]');
  console.log('\nOptions:');
  console.log('  --headless          Run without browser window');
  console.log('  --timeout <seconds> Set timeout (default from .kanerc)');
  console.log('\nConfiguration from .kanerc:');
  console.log(`  URL: ${BASE_URL}`);
  console.log(`  User: ${CREDS.email}`);
  console.log(`  Timeout: ${DEFAULT_TIMEOUT}s`);
  console.log('\nAvailable features:');
  fs.readdirSync(FEATURES_DIR)
    .filter(f => f.endswith('.feature'))
    .forEach(f => console.log(`  - ${f.replace('.feature', '')}`));
  process.exit(1);
}

runGherkinFeatures(featureName, headless, timeout).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
