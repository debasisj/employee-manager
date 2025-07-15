import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import axios from 'axios';

// Mocking axios to avoid actual API calls
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock data
const mockEmployees = [
  { 
    id: '1', 
    name: 'John Doe', 
    role: 'Developer', 
    _links: { self: { href: '/employees/1' } } 
  },
  { 
    id: '2', 
    name: 'Jane Smith', 
    role: 'Manager', 
    _links: { self: { href: '/employees/2' } } 
  },
  { 
    id: '3', 
    name: 'Bob Johnson', 
    role: 'Designer', 
    _links: { self: { href: '/employees/3' } } 
  }
];

const mockEmptyResponse = {
  data: {
    _embedded: {
      employeeList: [],
    },
  },
};

const mockEmployeesResponse = {
  data: {
    _embedded: {
      employeeList: mockEmployees,
    },
  },
};

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock for GET requests
    mockedAxios.get.mockResolvedValue(mockEmptyResponse);
  });

  describe('Initial Rendering', () => {
    test('renders the company name', async () => {
      render(<App />);
      const heading = await screen.findByText(/Employees of Bini corporation/i);
      expect(heading).toBeInTheDocument();
    });

    test('renders employee form', async () => {
      render(<App />);
      const form = await screen.findByTestId('employee-form');
      expect(form).toBeInTheDocument();
    });

    test('renders employee list container', async () => {
      render(<App />);
      const list = await screen.findByTestId('employee-list');
      expect(list).toBeInTheDocument();
    });

    test('displays form fields with proper labels', async () => {
      render(<App />);
      const nameField = await screen.findByTestId("EmpFormNameId");
      const roleField = await screen.findByTestId("EmpFormRoleId");
      
      expect(nameField).toBeInTheDocument();
      expect(roleField).toBeInTheDocument();
    });

    test('displays submit button', async () => {
      render(<App />);
      const submitButton = await screen.findByRole('button', { name: /create/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toBeEnabled();
    });
  });

  describe('Empty State', () => {
    test('displays no employees message when list is empty', async () => {
      render(<App />);
      const noEmployeesMessage = await screen.findByText(/No existing employee - add one/i);
      expect(noEmployeesMessage).toBeInTheDocument();
    });

    test('does not show edit/delete buttons when no employees exist', async () => {
      render(<App />);
      
      const editButtons = screen.queryAllByRole('button', { name: /edit/i });
      const deleteButtons = screen.queryAllByRole('button', { name: /delete/i });
      
      expect(editButtons).toHaveLength(0);
      expect(deleteButtons).toHaveLength(0);
    });
  });

  describe('Employee List Display', () => {
    beforeEach(() => {
      mockedAxios.get.mockResolvedValue(mockEmployeesResponse);
    });

    test('displays employees when they exist', async () => {
      render(<App />);

      await expect(screen.findByText('John Doe')).resolves.toBeInTheDocument();
      await expect(screen.findByText('Jane Smith')).resolves.toBeInTheDocument();
      await expect(screen.findByText('Bob Johnson')).resolves.toBeInTheDocument();
    });

    test('displays employee roles', async () => {
      render(<App />);
      await expect(screen.findByText('Developer')).resolves.toBeInTheDocument();
      await expect(screen.findByText('John Doe')).resolves.toBeInTheDocument();
      await expect(screen.findByText('Developer')).resolves.toBeInTheDocument();
      await expect(screen.findByText('Manager')).resolves.toBeInTheDocument();
      await expect(screen.findByText('Designer')).resolves.toBeInTheDocument();
      await expect(screen.findByText('QA Engineer')).resolves.toBeInTheDocument();
      await expect(screen.findByText('DevOps')).resolves.toBeInTheDocument();
      await expect(screen.findByText('Product Manager')).resolves.toBeInTheDocument();
    });

    test('shows edit and delete buttons for each employee', async () => {
      render(<App />);
      
      await waitFor(() => {
        const editButtons = screen.getAllByRole('button', { name: /edit/i });
        const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
        
        expect(editButtons).toHaveLength(3);
        expect(deleteButtons).toHaveLength(3);
      });
    });
  });

  describe('Form Interactions', () => {
    test('allows typing in name field', async () => {
      render(<App />);
      
      const nameField = await screen.findByTestId("EmpFormNameId");
      await userEvent.type(nameField, 'Test Employee');
      
      expect(nameField).toHaveValue('Test Employee');
    });

    test('allows typing in role field', async () => {
      render(<App />);
      
      const roleField = await screen.findByTestId("EmpFormRoleId");
      await userEvent.type(roleField, 'Engineer');
      
      expect(roleField).toHaveValue('Engineer');
    });

    test('clears form fields after successful submission', async () => {
      mockedAxios.post.mockResolvedValue({ data: { id: '4', name: 'Test Employee', role: 'Engineer' } });
      
      render(<App />);
      
      const nameField = await screen.findByTestId("EmpFormNameId");
      const roleField = await screen.findByTestId("EmpFormRoleId");
      const submitButton = await screen.findByRole('button', { name: /create/i });

      await userEvent.type(nameField, 'Test Employee');
      await userEvent.type(roleField, 'Engineer');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(nameField).toHaveValue('');
 
      });
    });

    test('handles form submission with Enter key', async () => {
      mockedAxios.post.mockResolvedValue({ data: { id: '4', name: 'Test Employee', role: 'Engineer' } });
      
      render(<App />);
      
      const nameField = await screen.findByTestId("EmpFormNameId");
      const roleField = await screen.findByTestId("EmpFormRoleId");

      await userEvent.type(nameField, 'Test Employee');
      await userEvent.type(roleField, 'Engineer');
      await userEvent.keyboard('{Enter}');
      
      await waitFor(() => {
        expect(nameField).toHaveValue('');
        expect(roleField).toHaveValue('');
      });
    });
  });

  describe('Create Employee', () => {
    test('creates new employee successfully', async () => {
      
      const newEmployee = { id: '4', name: 'Test Employee', role: 'Engineer' };
      mockedAxios.post.mockResolvedValue({ data: newEmployee });
      
      render(<App />);
      
      const nameField = await screen.findByTestId("EmpFormNameId");
      const roleField = await screen.findByTestId("EmpFormRoleId");
      const submitButton = await screen.findByRole('button', { name: /create/i });

      await userEvent.type(nameField, 'Test Employee');
      await userEvent.type(roleField, 'Engineer');
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith('/employees', {
          name: 'Test Employee',
          role: 'Engineer'
        });
      });
    });

    test('handles creation error gracefully', async () => {
      
      mockedAxios.post.mockRejectedValue(new Error('Creation failed'));
      
      render(<App />);
      
      const nameField = await screen.findByTestId("EmpFormNameId");
      const roleField = await screen.findByTestId("EmpFormRoleId");
      const submitButton = await screen.findByRole('button', { name: /create/i });

      await userEvent.type(nameField, 'Test Employee');
      await userEvent.type(roleField, 'Engineer');
      await userEvent.click(submitButton);

      // Should not crash the application
      await waitFor(() => {
        expect(screen.getByText(/Employees of Bini corporation/i)).toBeInTheDocument();
      });
    });
  });

  describe('Edit Employee', () => {
    beforeEach(() => {
      mockedAxios.get.mockResolvedValue(mockEmployeesResponse);
    });

    test('populates form when edit button is clicked', async () => {
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await userEvent.click(editButtons[0]);

      const nameField = screen.getByTestId("EmpFormNameId");
      const roleField = screen.getByTestId("EmpFormRoleId");

      expect(nameField).toHaveValue('John Doe');
      expect(roleField).toHaveValue('Developer');
    });

    test('updates employee successfully', async () => {
      
      mockedAxios.put.mockResolvedValue({ data: { id: '1', name: 'Updated Name', role: 'Updated Role' } });
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await userEvent.click(editButtons[0]);

      const nameField = screen.getByTestId("EmpFormNameId");
      const roleField = screen.getByTestId("EmpFormRoleId");
      const updateButton = screen.getByRole('button', { name: /update/i });

      await userEvent.clear(nameField);
      await userEvent.type(nameField, 'Updated Name');
      await userEvent.clear(roleField);
      await userEvent.type(roleField, 'Updated Role');
      await userEvent.click(updateButton);

      await waitFor(() => {
        expect(mockedAxios.put).toHaveBeenCalledWith('/employees/1', {
          name: 'Updated Name',
          role: 'Updated Role'
        });
      });
    });

    test('handles update error gracefully', async () => {
      
      mockedAxios.put.mockRejectedValue(new Error('Update failed'));
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await userEvent.click(editButtons[0]);

      const updateButton = screen.getByRole('button', { name: /update/i });
      await userEvent.click(updateButton);

      // Should not crash the application
      await waitFor(() => {
        expect(screen.getByText(/Employees of Bini corporation/i)).toBeInTheDocument();
      });
    });
  });

  describe('Delete Employee', () => {
    beforeEach(() => {
      mockedAxios.get.mockResolvedValue(mockEmployeesResponse);
      // Mock window.confirm
      window.confirm = jest.fn();
    });

    test('shows confirmation dialog when delete button is clicked', async () => {
      
      (window.confirm as jest.Mock).mockReturnValue(true);
      mockedAxios.delete.mockResolvedValue({ status: 200 });
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await userEvent.click(deleteButtons[0]);

      expect(window.confirm).toHaveBeenCalled();
    });

    test('deletes employee when confirmed', async () => {
      
      (window.confirm as jest.Mock).mockReturnValue(true);
      mockedAxios.delete.mockResolvedValue({ status: 200 });
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await userEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(mockedAxios.delete).toHaveBeenCalledWith('/employees/1');
      });
    });

    test('cancels deletion when not confirmed', async () => {
      
      (window.confirm as jest.Mock).mockReturnValue(false);
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await userEvent.click(deleteButtons[0]);

      expect(mockedAxios.delete).not.toHaveBeenCalled();
    });

    test('handles delete error gracefully', async () => {
      
      (window.confirm as jest.Mock).mockReturnValue(true);
      mockedAxios.delete.mockRejectedValue(new Error('Delete failed'));
      
      render(<App />);
      
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await userEvent.click(deleteButtons[0]);

      // Should not crash the application
      await waitFor(() => {
        expect(screen.getByText(/Employees of Bini corporation/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    test('prevents submission with empty name field', async () => {
      
      render(<App />);
      
      const nameField = await screen.findByTestId("EmpFormNameId");
      const roleField = await screen.findByTestId("EmpFormRoleId");
      const submitButton = await screen.findByRole('button', { name: /create/i });

      await userEvent.type(roleField, 'Engineer');
      await userEvent.click(submitButton);

      // Should not make API call
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    test('prevents submission with empty role field', async () => {
      
      render(<App />);
      
      const nameField = await screen.findByTestId("EmpFormNameId");
      const roleField = await screen.findByTestId("EmpFormRoleId");
      const submitButton = await screen.findByRole('button', { name: /create/i });

      await userEvent.type(nameField, 'Test Employee');
      await userEvent.click(submitButton);

      // Should not make API call
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    test('handles very long input values', async () => {
      
      const longName = 'A'.repeat(1000);
      const longRole = 'B'.repeat(500);
      mockedAxios.post.mockResolvedValue({ data: { id: '4', name: longName, role: longRole } });
      
      render(<App />);
      
      const nameField = await screen.findByTestId("EmpFormNameId");
      const roleField = await screen.findByTestId("EmpFormRoleId");
      const submitButton = await screen.findByRole('button', { name: /create/i });

      await userEvent.type(nameField, longName);
      await userEvent.type(roleField, longRole);
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith('/employees', {
          name: longName,
          role: longRole
        });
      });
    });
  });

  describe('API Error Handling', () => {
    test('handles GET request failure gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Failed to fetch employees'));
      
      render(<App />);
      
      // Should still render the basic UI
      await waitFor(() => {
        expect(screen.getByText(/Employees of Bini corporation/i)).toBeInTheDocument();
      });
    });

    test('handles network timeout', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network timeout'));
      
      render(<App />);
      
      // Should still render the basic UI
      await waitFor(() => {
        expect(screen.getByText(/Employees of Bini corporation/i)).toBeInTheDocument();
      });
    });

    test('handles server error responses', async () => {
      mockedAxios.get.mockRejectedValue({ response: { status: 500, data: 'Internal Server Error' } });
      
      render(<App />);
      
      // Should still render the basic UI
      await waitFor(() => {
        expect(screen.getByText(/Employees of Bini corporation/i)).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Edge Cases', () => {
    test('handles rapid form submissions', async () => {
      
      mockedAxios.post.mockResolvedValue({ data: { id: '4', name: 'Test', role: 'Engineer' } });
      
      render(<App />);
      
      const nameField = await screen.findByTestId("EmpFormNameId");
      const roleField = await screen.findByTestId("EmpFormRoleId");
      const submitButton = await screen.findByRole('button', { name: /create/i });

      // Rapidly submit multiple times
      for (let i = 0; i < 3; i++) {
        await userEvent.clear(nameField);
        await userEvent.type(nameField, `Test Employee ${i}`);
        await userEvent.clear(roleField);
        await userEvent.type(roleField, `Role ${i}`);
        await userEvent.click(submitButton);
      }

      // Should handle gracefully without crashing
      await waitFor(() => {
        expect(screen.getByText(/Employees of Bini corporation/i)).toBeInTheDocument();
      });
    });

    test('handles special characters in input', async () => {
      
      const specialName = 'Test@Employee#123';
      const specialRole = 'Dev-Ops & QA';
      mockedAxios.post.mockResolvedValue({ data: { id: '4', name: specialName, role: specialRole } });
      
      render(<App />);
      
      const nameField = await screen.findByTestId("EmpFormNameId");
      const roleField = await screen.findByTestId("EmpFormRoleId");
      const submitButton = await screen.findByRole('button', { name: /create/i });

      await userEvent.type(nameField, specialName);
      await userEvent.type(roleField, specialRole);
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith('/employees', {
          name: specialName,
          role: specialRole
        });
      });
    });

    test('handles unicode characters in input', async () => {
      
      const unicodeName = 'José María García';
      const unicodeRole = 'Développeur';
      mockedAxios.post.mockResolvedValue({ data: { id: '4', name: unicodeName, role: unicodeRole } });
      
      render(<App />);
      
      const nameField = await screen.findByTestId("EmpFormNameId");
      const roleField = await screen.findByTestId("EmpFormRoleId");
      const submitButton = await screen.findByRole('button', { name: /create/i });

      await userEvent.type(nameField, unicodeName);
      await userEvent.type(roleField, unicodeRole);
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockedAxios.post).toHaveBeenCalledWith('/employees', {
          name: unicodeName,
          role: unicodeRole
        });
      });
    });
  });
}); 
