# Employee Manager Test Suite

This directory contains a comprehensive test suite for the Employee Manager application, covering API, UI, and unit tests.

## Test Structure

```
tests/
├── api/                    # API tests
│   └── employees.api.spec.ts
├── ui/                     # UI tests
│   └── employee.spec.ts
├── fixtures/               # Test fixtures and setup
│   ├── empData.ts
│   └── log.ts
├── utils/                  # Test utilities
│   ├── apiHelpers.ts
│   ├── index.ts
│   └── testHelpers.ts
├── config/                 # Test configuration
│   └── testConfig.ts
└── README.md              # This file
```

## Test Categories

### 1. API Tests (`tests/api/`)
- **Purpose**: Test REST API endpoints
- **Coverage**: CRUD operations, error handling, validation, performance
- **Tools**: Playwright API testing
- **Key Features**:
  - Comprehensive CRUD testing
  - Error handling and edge cases
  - Data validation
  - Performance testing
  - Test isolation with cleanup

### 2. UI Tests (`tests/ui/`)
- **Purpose**: Test user interface and interactions
- **Coverage**: Form interactions, responsive design, accessibility
- **Tools**: Playwright browser testing
- **Key Features**:
  - Form validation and interactions
  - Responsive design testing
  - Accessibility testing
  - Error handling
  - Performance testing

### 3. Unit Tests (`src/App.test.tsx`)
- **Purpose**: Test React components in isolation
- **Coverage**: Component rendering, user interactions, API mocking
- **Tools**: Jest + React Testing Library
- **Key Features**:
  - Component rendering tests
  - User interaction testing
  - API mocking and error handling
  - Form validation
  - Edge cases and performance

## Running Tests

### Prerequisites
1. Install dependencies: `npm install`
2. Start the backend server: `npm run start:rest`
3. Start the frontend server: `npm run start:react`

### Commands

```bash
# Run all tests
npm test

# Run only unit tests
npm test -- --testPathPattern=src

# Run only API tests
npm run test:e2e:only -- --project=api

# Run only UI tests
npm run test:e2e:only -- --project=web

# Run tests with specific tags
npm run test:e2e:only -- --grep="@critical"

# Run tests in headless mode
npm run test:e2e:only -- --headed=false

# Run tests with specific browser
npm run test:e2e:only -- --project=web --browser=firefox
```

## Test Configuration

### Environment Variables
```bash
# API Configuration
API_BASE_URL=http://localhost:8080
API_TIMEOUT=10000

# UI Configuration
UI_BASE_URL=http://localhost:3000
UI_TIMEOUT=30000

# Test Configuration
NODE_ENV=development
CI=false
```

### Playwright Configuration
The main configuration is in `playwright.config.ts`:
- Separate projects for API and UI tests
- Custom timeouts and retry settings
- Video and screenshot capture on failure
- Custom reporter configuration

## Test Utilities

### API Helpers (`tests/utils/apiHelpers.ts`)
Provides wrapper functions for HTTP requests with error handling:
- `get()` - GET requests
- `post()` - POST requests
- `put()` - PUT requests
- `delete()` - DELETE requests

### Test Data Generator (`tests/utils/testHelpers.ts`)
Generates test data and provides assertion helpers:
- `TestDataGenerator.generateEmployee()` - Generate employee data
- `TestAssertions.expectEmployeeStructure()` - Validate employee structure
- `TestUtils.retryOperation()` - Retry failed operations

### Test Configuration (`tests/config/testConfig.ts`)
Centralized configuration for:
- Environment-specific settings
- Performance thresholds
- Test categories and tags
- Timeout configurations

## Best Practices

### 1. Test Organization
- Group related tests using `describe()` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### 2. Test Data Management
- Use faker for generating realistic test data
- Clean up test data after each test
- Use fixtures for common test data

### 3. Error Handling
- Test both success and failure scenarios
- Validate error messages and status codes
- Test edge cases and boundary conditions

### 4. Performance Testing
- Set reasonable timeouts
- Test with realistic data volumes
- Monitor test execution times

### 5. Test Isolation
- Each test should be independent
- Clean up resources after tests
- Use unique test data to avoid conflicts

## Test Categories and Tags

### Priority Tags
- `@critical` - Critical functionality tests
- `@high` - High priority tests
- `@medium` - Medium priority tests
- `@low` - Low priority tests

### Performance Tags
- `@slow` - Tests that take longer to run
- `@fast` - Quick tests for rapid feedback

### Category Tags
- `@smoke` - Basic functionality tests
- `@regression` - Comprehensive regression tests
- `@performance` - Performance and load tests
- `@accessibility` - Accessibility compliance tests

## Continuous Integration

### GitHub Actions
The test suite is configured to run in CI/CD pipelines:
- Runs on pull requests
- Separate jobs for API and UI tests
- Parallel execution for faster feedback
- Artifact collection for test reports

### Local Development
For local development:
1. Run tests in watch mode: `npm test`
2. Run specific test files: `npm test -- --testNamePattern="should create employee"`
3. Debug tests: `npm run test:e2e:only -- --headed --debug`

## Troubleshooting

### Common Issues

1. **Tests failing due to timing**
   - Increase timeouts in test configuration
   - Add explicit waits for async operations
   - Use `waitFor()` for dynamic content

2. **API tests failing**
   - Ensure backend server is running
   - Check API endpoints are accessible
   - Verify test data cleanup

3. **UI tests failing**
   - Check browser compatibility
   - Verify selectors are still valid
   - Test in different viewport sizes

4. **Performance issues**
   - Run tests in parallel where possible
   - Use headless mode for faster execution
   - Optimize test data generation

### Debugging Tips

1. **Enable debug logging**
   ```bash
   DEBUG=pw:api npm run test:e2e:only
   ```

2. **Run tests in headed mode**
   ```bash
   npm run test:e2e:only -- --headed
   ```

3. **Use test retries**
   ```bash
   npm run test:e2e:only -- --retries=3
   ```

4. **Generate test reports**
   ```bash
   npm run test:e2e:only -- --reporter=html
   ```

## Contributing

When adding new tests:

1. Follow the existing naming conventions
2. Add appropriate tags for categorization
3. Include both positive and negative test cases
4. Add proper error handling and cleanup
5. Update this documentation if needed

## Metrics and Reporting

The test suite generates various reports:
- HTML test reports with screenshots and videos
- Coverage reports for unit tests
- Performance metrics
- Accessibility compliance reports

Reports are saved in:
- `test-results/` - Playwright test results
- `coverage/` - Code coverage reports
- `reports/` - Custom test reports 