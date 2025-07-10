import { expect } from '@playwright/test'
import { ApiHelpers } from '../utils/apiHelpers'
import { test } from '../fixtures/empData'
import { user } from '../utils'

test.describe('Get all employees', () => {
    test('Should get all employees', async ({ employeesList }) => {
        expect(employeesList.length).toBeGreaterThan(0)
    })

    test('Should get an employee by ID', async ({ request, employeesList }) => {
        //get the random employee ID from the list
        const employeeId = employeesList[Math.floor(Math.random() * employeesList.length)].id
        console.log('Employee ID:', employeeId)
        expect(employeeId).toBeDefined()
        const response = await ApiHelpers.get(request, `/employees/${employeeId}`)
        expect(response).toBeTruthy()
        expect(response.id).toEqual(employeeId)
        console.log('Response:', response)
    })

    test('Should create a new employee', async ({ request }) => {
        const newEmployee = {
            name: `${user.firstName} ${user.lastName}`,
            role: 'Engineer'
        }
        const response = await ApiHelpers.post(request,
            '/employees',
            newEmployee
        )
        expect(response).toBeTruthy()
        expect(response.name).toEqual(newEmployee.name)
        expect(response.role).toEqual(newEmployee.role)

        // Check if the new employee is added to the employees list
        const updatedEmployeesList = await ApiHelpers.get(request, '/employees')
        expect(updatedEmployeesList._embedded.employeeList).toContainEqual(expect.objectContaining({
            name: newEmployee.name,
            role: newEmployee.role
        }))
        console.log('Response:', response)
    })

    test('Should update an employee', async ({ request, employeesList }) => {
        const updatedEmployee = {
            name: `${user.firstName} ${user.lastName} Updated`,
            role: 'Manager'
        }
        //get the random employee ID from the list
        const employeeId = employeesList[Math.floor(Math.random() * employeesList.length)].id
        expect(employeeId).toBeDefined()
        console.log('Employee ID:', employeeId)

        const response = await ApiHelpers.put(request,
            `/employees/${employeeId}`,
            updatedEmployee
        )
        expect(response).toBeTruthy()
        expect(response.name).toEqual(updatedEmployee.name)
        expect(response.role).toEqual(updatedEmployee.role)
        //check if the employee is updated in the employees list
        const updatedEmployeesList = await ApiHelpers.get(request, '/employees')
        const updatedEmployeeData = updatedEmployeesList._embedded.employeeList.find((emp: { id: any }) => emp.id === employeeId)
        expect(updatedEmployeeData).toBeTruthy()
        console.log('Updated Employee Data:', updatedEmployeeData)
        expect(updatedEmployeeData.name).toEqual(updatedEmployee.name)
        expect(updatedEmployeeData.role).toEqual(updatedEmployee.role)

    })
    test('Should delete an employee', async ({ request, employeesList }) => {
        //get the random employee ID from the list
        const employeeId = employeesList[Math.floor(Math.random() * employeesList.length)].id
        expect(employeeId).toBeDefined()
        console.log('Employee ID to delete:', employeeId)
        const response = await ApiHelpers.delete(request,
            `/employees/${employeeId}`
        )
        expect(response).toBeTruthy()
        console.log('Response:', response)

        // Check if the employee is deleted from the employees list
        const updatedEmployeesList = await ApiHelpers.get(request, '/employees')
        const deletedEmployeeData = updatedEmployeesList._embedded.employeeList.find((emp: { id: any }) => emp.id === employeeId)
        expect(deletedEmployeeData).toBeUndefined()
        console.log('Deleted Employee Data:', deletedEmployeeData)
    })
})