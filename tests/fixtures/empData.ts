import { test as base } from '@playwright/test'
import { ApiHelpers } from '../utils/apiHelpers'

export const test = base.extend<{
    employeesList: any[]
}>({
    employeesList: async ({ request }, use) => {
        const response = await ApiHelpers.get(request, '/employees')
        await use(response._embedded.employeeList)
    }
})