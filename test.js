const axios = require('axios');

// Test configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m'
};

// Test helper function
async function runTest(name, testFn) {
  try {
    console.log(`\n${colors.blue}Testing: ${name}${colors.reset}`);
    await testFn();
    console.log(`${colors.green}✓ PASSED${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}✗ FAILED${colors.reset}`);
    console.error(`Error: ${error.message}`);
    return false;
  }
}

// Test suite
async function runTests() {
  console.log('\n=================================');
  console.log('📸 Screenshot API Test Suite');
  console.log('=================================');
  console.log(`API Base URL: ${API_BASE_URL}`);
  
  const results = [];

  // Test 1: Health check
  results.push(await runTest('Health Check', async () => {
    const response = await axios.get(`${API_BASE_URL}/health`);
    if (response.status !== 200 || response.data.status !== 'healthy') {
      throw new Error('Health check failed');
    }
  }));

  // Test 2: Root endpoint
  results.push(await runTest('Root Endpoint', async () => {
    const response = await axios.get(`${API_BASE_URL}/`);
    if (response.status !== 200 || !response.data.service) {
      throw new Error('Root endpoint failed');
    }
  }));

  // Test 3: Screenshot without URL (should fail)
  results.push(await runTest('Screenshot without URL (Error Handling)', async () => {
    try {
      await axios.get(`${API_BASE_URL}/screenshot`);
      throw new Error('Should have returned 400 error');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return; // Expected error
      }
      throw error;
    }
  }));

  // Test 4: Screenshot with invalid URL
  results.push(await runTest('Screenshot with Invalid URL', async () => {
    try {
      await axios.get(`${API_BASE_URL}/screenshot?url=not-a-valid-url`);
      throw new Error('Should have returned 400 error');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        return; // Expected error
      }
      throw error;
    }
  }));

  // Test 5: Valid screenshot request
  results.push(await runTest('Valid Screenshot Request (example.com)', async () => {
    const response = await axios.get(
      `${API_BASE_URL}/screenshot?url=https://example.com&width=800&height=600`,
      { timeout: 60000 }
    );
    
    if (response.status !== 200) {
      throw new Error(`Unexpected status: ${response.status}`);
    }
    
    if (!response.data.success || !response.data.data.image) {
      throw new Error('Screenshot data missing');
    }

    // Verify Base64 string
    if (!response.data.data.image.match(/^[A-Za-z0-9+/]+=*$/)) {
      throw new Error('Invalid Base64 format');
    }

    console.log(`  Image size: ${(response.data.data.size / 1024).toFixed(2)} KB`);
    console.log(`  Processing time: ${response.data.metadata.processingTime}`);
  }));

  // Test 6: Full page screenshot
  results.push(await runTest('Full Page Screenshot', async () => {
    const response = await axios.get(
      `${API_BASE_URL}/screenshot?url=https://example.com&fullPage=true`,
      { timeout: 60000 }
    );
    
    if (response.status !== 200 || !response.data.success) {
      throw new Error('Full page screenshot failed');
    }

    console.log(`  Full page size: ${(response.data.data.size / 1024).toFixed(2)} KB`);
  }));

  // Test 7: JPEG format
  results.push(await runTest('JPEG Format Screenshot', async () => {
    const response = await axios.get(
      `${API_BASE_URL}/screenshot?url=https://example.com&format=jpeg&quality=90`,
      { timeout: 60000 }
    );
    
    if (response.status !== 200 || response.data.data.format !== 'jpeg') {
      throw new Error('JPEG format not applied');
    }

    console.log(`  JPEG size: ${(response.data.data.size / 1024).toFixed(2)} KB`);
  }));

  // Test 8: Custom dimensions
  results.push(await runTest('Custom Dimensions (1366x768)', async () => {
    const response = await axios.get(
      `${API_BASE_URL}/screenshot?url=https://example.com&width=1366&height=768`,
      { timeout: 60000 }
    );
    
    if (response.data.data.dimensions.width !== 1366 || 
        response.data.data.dimensions.height !== 768) {
      throw new Error('Dimensions not applied correctly');
    }
  }));

  // Print summary
  console.log('\n=================================');
  console.log('Test Summary');
  console.log('=================================');
  
  const passed = results.filter(r => r).length;
  const failed = results.filter(r => !r).length;
  
  console.log(`Total: ${results.length}`);
  console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
  console.log('=================================\n');

  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
if (require.main === module) {
  runTests().catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
  });
}

module.exports = { runTests };
