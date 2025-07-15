import { fakerEN_AU as faker } from '@faker-js/faker'

export interface Employee {
  id: string
  name: string
  role: string
  _links?: {
    self: {
      href: string
    }
  }
}

export interface ApiResponse {
  data: {
    _embedded: {
      employeeList: Employee[]
    }
  }
}

export class TestDataGenerator {
  static generateEmployee(overrides: Partial<Employee> = {}): Employee {
    return {
      id: faker.string.uuid(),
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
      role: faker.helpers.arrayElement(['Developer', 'Manager', 'Designer', 'QA Engineer', 'DevOps']),
      _links: {
        self: {
          href: `/employees/${faker.string.uuid()}`
        }
      },
      ...overrides
    }
  }

  static generateEmployees(count: number): Employee[] {
    return Array.from({ length: count }, () => this.generateEmployee())
  }

  static generateApiResponse(employees: Employee[] = []): ApiResponse {
    return {
      data: {
        _embedded: {
          employeeList: employees
        }
      }
    }
  }

  static generateEmptyApiResponse(): ApiResponse {
    return this.generateApiResponse([])
  }
}

export class TestAssertions {
  static expectEmployeeStructure(employee: any) {
    expect(employee).toHaveProperty('id')
    expect(employee).toHaveProperty('name')
    expect(employee).toHaveProperty('role')
    expect(typeof employee.id).toBe('string')
    expect(typeof employee.name).toBe('string')
    expect(typeof employee.role).toBe('string')
  }

  static expectEmployeeData(employee: any, expectedData: Partial<Employee>) {
    if (expectedData.id) {
      expect(employee.id).toEqual(expectedData.id)
    }
    if (expectedData.name) {
      expect(employee.name).toEqual(expectedData.name)
    }
    if (expectedData.role) {
      expect(employee.role).toEqual(expectedData.role)
    }
  }

  static expectApiError(error: any, expectedStatus?: number) {
    expect(error).toBeDefined()
    expect(error.message).toContain('failed')
    if (expectedStatus) {
      expect(error.message).toContain(expectedStatus.toString())
    }
  }
}

export class TestUtils {
  static async waitForCondition(condition: () => boolean, timeout = 5000): Promise<void> {
    const startTime = Date.now()
    while (Date.now() - startTime < timeout) {
      if (condition()) {
        return
      }
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    throw new Error('Condition not met within timeout')
  }

  static async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
  ): Promise<T> {
    let lastError: Error
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    throw lastError!
  }

  static generateRandomString(length: number): string {
    return faker.string.alphanumeric(length)
  }

  static generateLongString(length: number): string {
    return 'A'.repeat(length)
  }

  static generateSpecialCharacters(): string {
    return '!@#$%^&*()_+-=[]{}|;:,.<>?'
  }

  static generateUnicodeString(): string {
    return 'José María García López'
  }
}

export const testConstants = {
  VALID_ROLES: ['Developer', 'Manager', 'Designer', 'QA Engineer', 'DevOps', 'Product Manager'],
  INVALID_ROLES: ['', '   ', 'InvalidRole123', 'Role@#$%'],
  TIMEOUTS: {
    SHORT: 1000,
    MEDIUM: 5000,
    LONG: 10000
  },
  LIMITS: {
    MAX_NAME_LENGTH: 1000,
    MAX_ROLE_LENGTH: 500
  }
} 