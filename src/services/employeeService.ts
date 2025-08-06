import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Add axios interceptor for authentication
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Add response interceptor to handle 401 errors
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export interface Employee {
    id?: number;
    name: string;
    role: string;
    _links?: { self: { href: string } };
}

export interface LoginRequest {
    userId: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    type: string;
    expiresIn: string;
    message: string;
}

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
};

export const getEmployees = async () => {
    return await axios.get(`${API_BASE_URL}/employees`);
};

export const createEmployee = async (employee: Omit<Employee, 'id'>) => {
    return await axios.post(`${API_BASE_URL}/employees`, employee);
};

export const updateEmployee = async (url: string, employee: Omit<Employee, 'id'>) => {
    return await axios.put(url, employee);
};

export const deleteEmployee = async (url: string) => {
    return await axios.delete(url);
};

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('authToken');
};

export const logout = (): void => {
    localStorage.removeItem('authToken');
};