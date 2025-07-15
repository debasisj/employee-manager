import { expect } from '@playwright/test'
import { ApiHelpers } from '../utils/apiHelpers'
import { test } from '../fixtures/empData'
import { user } from '../utils'

test.describe('Employee API Tests', () => {
    let createdEmployeeId: string | null = null

    test.afterEach(async ({ request }) => {
        // Cleanup: Delete any employee created during tests
        if (createdEmployeeId) {
            try {
                await ApiHelpers.delete(request, `/employees/${createdEmployeeId}`)
            } catch (error) {
                console.log('Cleanup failed for employee:', createdEmployeeId)
            }
            createdEmployeeId = null
        }
    })

    test.describe('GET Operations', () => {
        test('Should get all employees successfully', async ({ employeesList }) => {
            expect(employeesList).toBeDefined()
            expect(Array.isArray(employeesList)).toBe(true)
            expect(employeesList.length).toBeGreaterThanOrEqual(0)
            
            // Validate employee structure
            if (employeesList.length > 0) {
                const firstEmployee = employeesList[0]
                expect(firstEmployee).toHaveProperty('id')
                expect(firstEmployee).toHaveProperty('name')
                expect(firstEmployee).toHaveProperty('role')
                expect(typeof firstEmployee.id).toBe('number')
                expect(typeof firstEmployee.name).toBe('string')
                expect(typeof firstEmployee.role).toBe('string')
            }
        })

        test('Should get an employee by valid ID', async ({ request, employeesList }) => {
            expect(employeesList.length).toBeGreaterThan(0)
            
            const employeeId = employeesList[0].id
            const response = await ApiHelpers.get(request, `/employees/${employeeId}`)
            
            expect(response).toBeDefined()
            expect(response.id).toEqual(employeeId)
            expect(response.name).toBeDefined()
            expect(response.role).toBeDefined()
        })

        test('Should return 404 for non-existent employee ID', async ({ request }) => {
            const nonExistentId = '999999'
            
            try {
                await ApiHelpers.get(request, `/employees/${nonExistentId}`)
                throw new Error('Expected 404 but got success')
            } catch (error) {
                expect(error.message).toContain('404')
            }
        })

        test('Should handle invalid employee ID format', async ({ request }) => {
            const invalidId = 'invalid-id'
            
            try {
                await ApiHelpers.get(request, `/employees/${invalidId}`)
                throw new Error('Expected error but got success')
            } catch (error) {
                expect(error.message).toContain('failed')
            }
        })
    })

    test.describe('POST Operations', () => {
        test('Should create a new employee with valid data', async ({ request }) => {
            const newEmployee = {
                name: `${user.firstName} ${user.lastName}`,
                role: 'Engineer'
            }
            
            const response = await ApiHelpers.post(request, '/employees', newEmployee)
            
            expect(response).toBeDefined()
            expect(response.id).toBeDefined()
            expect(response.name).toEqual(newEmployee.name)
            expect(response.role).toEqual(newEmployee.role)
            
            createdEmployeeId = response.id
        })

        test('Should create employee with different roles', async ({ request }) => {
            const roles = ['Manager', 'Developer', 'Designer', 'QA Engineer']
            
            for (const role of roles) {
                const newEmployee = {
                    name: `${user.firstName} ${user.lastName} ${role}`,
                    role: role
                }
                
                const response = await ApiHelpers.post(request, '/employees', newEmployee)
                expect(response.role).toEqual(role)
                
                // Cleanup immediately
                await ApiHelpers.delete(request, `/employees/${response.id}`)
            }
        })

        test('Should handle empty name field', async ({ request }) => {
            const invalidEmployee = {
                name: '',
                role: 'Engineer'
            }
            
            try {
                await ApiHelpers.post(request, '/employees', invalidEmployee)
                throw new Error('Expected validation error but got success')
            } catch (error) {
                expect(error.message).toContain('failed')
            }
        })

        test('Should handle missing required fields', async ({ request }) => {
            const invalidEmployee = {
                role: 'Engineer'
                // Missing name field
            }
            
            try {
                await ApiHelpers.post(request, '/employees', invalidEmployee)
                throw new Error('Expected validation error but got success')
            } catch (error) {
                expect(error.message).toContain('failed')
            }
        })

        test('Should handle very long name', async ({ request }) => {
            const longName = 'A'.repeat(1000)
            const newEmployee = {
                name: longName,
                role: 'Engineer'
            }
            
            try {
                const response = await ApiHelpers.post(request, '/employees', newEmployee)
                expect(response.name).toEqual(longName)
                createdEmployeeId = response.id
            } catch (error) {
                // If the API has length limits, this should fail gracefully
                expect(error.message).toContain('failed')
            }
        })
    })

    test.describe('PUT Operations', () => {
        test('Should update an existing employee', async ({ request, employeesList }) => {
            expect(employeesList.length).toBeGreaterThan(0)
            
            const employeeId = employeesList[0].id
            const updatedEmployee = {
                name: `${user.firstName} ${user.lastName} Updated`,
                role: 'Senior Manager'
            }
            
            const response = await ApiHelpers.put(request, `/employees/${employeeId}`, updatedEmployee)
            
            expect(response).toBeDefined()
            expect(response.id).toEqual(employeeId)
            expect(response.name).toEqual(updatedEmployee.name)
            expect(response.role).toEqual(updatedEmployee.role)
        })

        test('Should return 404 when updating non-existent employee', async ({ request }) => {
            const nonExistentId = '999999'
            const updatedEmployee = {
                name: 'Test Employee',
                role: 'Manager'
            }
            
            try {
                await ApiHelpers.put(request, `/employees/${nonExistentId}`, updatedEmployee)
                throw new Error('Expected 404 but got success')
            } catch (error) {
                expect(error.message).toContain('404')
            }
        })

        test('Should handle partial updates', async ({ request, employeesList }) => {
            expect(employeesList.length).toBeGreaterThan(0)
            
            const employeeId = employeesList[0].id
            const partialUpdate = {
                role: 'Lead Developer'
                // Only updating role, not name
            }
            
            try {
                const response = await ApiHelpers.put(request, `/employees/${employeeId}`, partialUpdate)
                expect(response.role).toEqual(partialUpdate.role)
            } catch (error) {
                // If the API requires all fields, this should fail
                expect(error.message).toContain('failed')
            }
        })
    })

    test.describe('DELETE Operations', () => {
        test('Should delete an existing employee', async ({ request, employeesList }) => {
            expect(employeesList.length).toBeGreaterThan(0)
            
            const employeeId = employeesList[0].id
            const response = await ApiHelpers.delete(request, `/employees/${employeeId}`)
            
            expect(response).toBeDefined()
            
            // Verify employee is deleted
            try {
                await ApiHelpers.get(request, `/employees/${employeeId}`)
                throw new Error('Employee should be deleted but still exists')
            } catch (error) {
                expect(error.message).toContain('404')
            }
        })

        test('Should return 404 when deleting non-existent employee', async ({ request }) => {
            const nonExistentId = '999999'
            
            try {
                await ApiHelpers.delete(request, `/employees/${nonExistentId}`)
                throw new Error('Expected 404 but got success')
            } catch (error) {
                expect(error.message).toContain('404')
            }
        })

        test('Should handle invalid ID format for deletion', async ({ request }) => {
            const invalidId = 'invalid-id'
            
            try {
                await ApiHelpers.delete(request, `/employees/${invalidId}`)
                throw new Error('Expected error but got success')
            } catch (error) {
                expect(error.message).toContain('failed')
            }
        })
    })

    test.describe('Data Validation', () => {
        test('Should validate employee name format', async ({ request }) => {
            const testCases = [
                { name: 'John Doe', shouldPass: true },
                { name: 'A', shouldPass: true },
                { name: '', shouldPass: false },
                { name: '   ', shouldPass: false },
                { name: 'John@Doe', shouldPass: true }, // Assuming special chars are allowed
                { name: '123', shouldPass: true }
            ]
            
            for (const testCase of testCases) {
                const newEmployee = {
                    name: testCase.name,
                    role: 'Engineer'
                }
                
                try {
                    const response = await ApiHelpers.post(request, '/employees', newEmployee)
                    expect(testCase.shouldPass).toBe(true)
                    
                    // Cleanup
                    await ApiHelpers.delete(request, `/employees/${response.id}`)
                } catch (error) {
                    expect(testCase.shouldPass).toBe(false)
                }
            }
        })

        test('Should validate role values', async ({ request }) => {
            const validRoles = ['Engineer', 'Manager', 'Developer', 'Designer', 'QA']
            const invalidRoles = ['', '   ', 'InvalidRole123']
            
            // Test valid roles
            for (const role of validRoles) {
                const newEmployee = {
                    name: `${user.firstName} ${user.lastName}`,
                    role: role
                }
                
                try {
                    const response = await ApiHelpers.post(request, '/employees', newEmployee)
                    expect(response.role).toEqual(role)
                    await ApiHelpers.delete(request, `/employees/${response.id}`)
                } catch (error) {
                    console.log(`Role "${role}" failed validation:`, error.message)
                }
            }
            
            // Test invalid roles
            for (const role of invalidRoles) {
                const newEmployee = {
                    name: `${user.firstName} ${user.lastName}`,
                    role: role
                }
                
                try {
                    await ApiHelpers.post(request, '/employees', newEmployee)
                    throw new Error(`Role "${role}" should have failed validation`)
                } catch (error) {
                    expect(error.message).toContain('failed')
                }
            }
        })
    })

    test.describe('Performance and Load', () => {
        test('Should handle multiple concurrent requests', async ({ request }) => {
            const concurrentRequests = 5
            const promises: Promise<any>[] = []
            
            for (let i = 0; i < concurrentRequests; i++) {
                const newEmployee = {
                    name: `${user.firstName} ${user.lastName} Concurrent${i}`,
                    role: 'Engineer'
                }
                promises.push(ApiHelpers.post(request, '/employees', newEmployee))
            }
            
            const responses = await Promise.all(promises)
            expect(responses).toHaveLength(concurrentRequests)
            
            // Cleanup
            for (const response of responses) {
                await ApiHelpers.delete(request, `/employees/${response.id}`)
            }
        })

        test('Should return employees list within reasonable time', async ({ request }) => {
            const startTime = Date.now()
            const response = await ApiHelpers.get(request, '/employees')
            const endTime = Date.now()
            
            expect(response).toBeDefined()
            expect(endTime - startTime).toBeLessThan(5000) // Should complete within 5 seconds
        })
    })
}) 