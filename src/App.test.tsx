import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import * as employeeService from './services/employeeService';

// Mock the employee service
jest.mock('./services/employeeService');

const mockEmployeeService = employeeService as jest.Mocked<typeof employeeService>;

// Mock data
const mockEmptyResponse = {
  data: {
    _embedded: {
      employeeList: [],
    },
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {} as any,
};

const mockEmployeesResponse = {
  data: {
    _embedded: {
      employeeList: [
        { id: 1, name: 'John Doe', role: 'Developer', _links: { self: { href: '/employees/1' } } },
        { id: 2, name: 'Jane Smith', role: 'Manager', _links: { self: { href: '/employees/2' } } }
      ],
    },
  },
  status: 200,
  statusText: 'OK',
  headers: {},
  config: {} as any,
};

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
    });
  });

  describe('Authentication', () => {
    test('shows login form when not authenticated', () => {
      mockEmployeeService.isAuthenticated.mockReturnValue(false);
      render(<App />);
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByLabelText(/user id/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    test('shows main app when authenticated', async () => {
      mockEmployeeService.isAuthenticated.mockReturnValue(true);
      mockEmployeeService.getEmployees.mockResolvedValue(mockEmptyResponse);
      
      render(<App />);
      const heading = await screen.findByText(/Employees of Bini Corporation/i);
      expect(heading).toBeInTheDocument();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  describe('Employee Management (when authenticated)', () => {
    beforeEach(() => {
      mockEmployeeService.isAuthenticated.mockReturnValue(true);
    });

    test('Renders the company name', async () => {
      mockEmployeeService.getEmployees.mockResolvedValue(mockEmptyResponse);
      render(<App />);
      const heading = await screen.findByText(/Employees of Bini Corporation/i);
      expect(heading).toBeInTheDocument();
    });

    test('Employee form should be present', async () => {
      mockEmployeeService.getEmployees.mockResolvedValue(mockEmptyResponse);
      render(<App />);
      const form = await screen.findByTestId("employee-form");
      expect(form).toBeInTheDocument();
    });

    test('Employee list should have edit and delete buttons when employees exist', async () => {
      mockEmployeeService.getEmployees.mockResolvedValue(mockEmployeesResponse);
      render(<App />);
      
      const editButton = await screen.findByLabelText(/edit/i);
      const deleteButton = await screen.findByLabelText(/delete/i);
      expect(editButton).toBeInTheDocument();
      expect(deleteButton).toBeInTheDocument();
    });

    test('Shows no employees message when list is empty', async () => {
      mockEmployeeService.getEmployees.mockResolvedValue(mockEmptyResponse);
      render(<App />);
      
      const noEmployeesMessage = await screen.findByText(/No existing employee - add one/i);
      expect(noEmployeesMessage).toBeInTheDocument();
    });
  });
});
