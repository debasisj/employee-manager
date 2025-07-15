export const TestConfig = {
  // API Configuration
  API: {
    BASE_URL: process.env.API_BASE_URL || 'http://localhost:8080',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
  },

  // UI Configuration
  UI: {
    BASE_URL: process.env.UI_BASE_URL || 'http://localhost:3000',
    TIMEOUT: 30000,
    VIEWPORT: {
      MOBILE: { width: 375, height: 667 },
      TABLET: { width: 768, height: 1024 },
      DESKTOP: { width: 1920, height: 1080 }
    }
  },

  // Test Data Configuration
  DATA: {
    EMPLOYEE_COUNT: {
      MIN: 1,
      MAX: 10,
      DEFAULT: 3
    },
    STRING_LENGTHS: {
      SHORT: 10,
      MEDIUM: 50,
      LONG: 1000
    }
  },

  // Performance Thresholds
  PERFORMANCE: {
    PAGE_LOAD_TIME: 10000, // 10 seconds
    API_RESPONSE_TIME: 5000, // 5 seconds
    FORM_SUBMISSION_TIME: 3000 // 3 seconds
  },

  // Test Categories
  CATEGORIES: {
    SMOKE: 'smoke',
    REGRESSION: 'regression',
    PERFORMANCE: 'performance',
    ACCESSIBILITY: 'accessibility',
    SECURITY: 'security'
  },

  // Environment-specific settings
  ENVIRONMENT: {
    DEV: {
      API_BASE_URL: 'http://localhost:8080',
      UI_BASE_URL: 'http://localhost:3000'
    },
    STAGING: {
      API_BASE_URL: process.env.STAGING_API_URL,
      UI_BASE_URL: process.env.STAGING_UI_URL
    },
    PRODUCTION: {
      API_BASE_URL: process.env.PROD_API_URL,
      UI_BASE_URL: process.env.PROD_UI_URL
    }
  },

  // Test Tags
  TAGS: {
    CRITICAL: '@critical',
    HIGH: '@high',
    MEDIUM: '@medium',
    LOW: '@low',
    SLOW: '@slow',
    FAST: '@fast'
  }
}

export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development'
  switch (env) {
    case 'production':
      return TestConfig.ENVIRONMENT.PRODUCTION
    case 'staging':
      return TestConfig.ENVIRONMENT.STAGING
    default:
      return TestConfig.ENVIRONMENT.DEV
  }
}

export const isCI = () => {
  return process.env.CI === 'true' || process.env.CONTINUOUS_INTEGRATION === 'true'
}

export const getTestTimeout = (category: string = 'default') => {
  const timeouts = {
    smoke: 30000,
    regression: 60000,
    performance: 120000,
    accessibility: 45000,
    default: 30000
  }
  return timeouts[category] || timeouts.default
} 