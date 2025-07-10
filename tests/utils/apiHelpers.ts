
export class ApiHelpers {
    static async get(request: any,
        endpoint: string,
        params: Record<string, string> = {}
    ): Promise<any> {
        const response = await request.get(endpoint, { params })
        if (!response.ok()) {
            throw new Error(`GET request failed for ${endpoint}: ${response.status()} - ${await response.text()}`)
        }
        return response.json()
    }

    static async post(request: any,
        endpoint: string,
        data: Record<string, any> = {}
    ): Promise<any> {
        const response = await request.post(endpoint, { data })
        if (!response.ok()) {
            throw new Error(`POST request failed for ${endpoint}: ${response.status()} - ${await response.text()}`)
        }
        return response.json()
    }

    static async put(request: any,
        endpoint: string,
        data: Record<string, any> = {}
    ): Promise<any> {
        const response = await request.put(endpoint, { data })
        if (!response.ok()) {
            throw new Error(`PUT request failed for ${endpoint}: ${response.status()} - ${await response.text()}`)
        }
        return response.json()
    }

    static async delete(request: any,
        endpoint: string
    ): Promise<any> {
        const response = await request.delete(endpoint)
        if (!response.ok()) {
            throw new Error(`DELETE request failed for ${endpoint}: ${response.status()} - ${await response.text()}`)
        }
        return response.status()
    }
}