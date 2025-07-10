import axios from 'axios';

const API_URL = 'http://localhost:8080/employees';

export const getEmployees = () => axios.get(API_URL);
export const createEmployee = (employee: { name: string; role: string }) => axios.post(API_URL, employee);
export const updateEmployee = (url: string, employee: { name: string; role: string }) => axios.put(url, employee);
export const deleteEmployee = (url: string) => axios.delete(url);