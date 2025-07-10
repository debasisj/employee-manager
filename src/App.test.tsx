import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import axios from 'axios';

// Mocking axios to avoid actual API calls
jest.mock('axios');

beforeEach(() => {
  jest.clearAllMocks();
  (axios.get as jest.Mock).mockResolvedValue({
    data: {
      _embedded: {
        employeeList: [], // or mock employees as needed
      },
    },
  });
});



test('Renders the company name', async () => {
  render(<App />);
  const heading = await screen.findByText(/Employees of Bini corporation/i);
  expect(heading).toBeInTheDocument();
});

test('Employer form should present', async () => {
  render(<App />);
  const form = await screen.findByLabelText("Employee Form");
  expect(form).toBeInTheDocument();
});

test('Employee list should present', async () => {
  render(<App />);
  const list = await screen.findByLabelText("Employee List");
  expect(list).toBeInTheDocument();
});

test('Should display no employees message when list is empty', async () => {
  render(<App />);
  const noEmployeesMessage = await screen.findByText(/No existing employee - add one/i);
  expect(noEmployeesMessage).toBeInTheDocument();
});

test('Employee form should have name and role fields', async () => {
  render(<App />);
  const nameField = await screen.findByLabelText("EmpListNameHeader");
  const roleField = await screen.findByLabelText("EmpListRoleHeader");
  expect(nameField).toBeInTheDocument();
  expect(roleField).toBeInTheDocument();
});

test('Employee form should have submit button', async () => {
  render(<App />);
  const submitButton = await screen.findByRole('button', { name: /create/i });
  expect(submitButton).toBeInTheDocument();
});

test('Employee list should have edit and delete buttons', async () => {
  // Override the default mock for this test
  (axios.get as jest.Mock).mockResolvedValueOnce({
    data: {
      _embedded: {
        employeeList: [
          { name: 'John Doe', role: 'Developer', _links: { self: { href: '/employees/1' } } },
        ],
      },
    },
  });
  render(<App />);
  const editButton = await screen.findByRole('button', { name: /edit/i });
  const deleteButton = await screen.findByRole('button', { name: /delete/i });
  expect(editButton).toBeInTheDocument();
  expect(deleteButton).toBeInTheDocument();
});

test('Employee form should allow editing an employee', async () => {
  // Override the default mock for this test
  (axios.get as jest.Mock).mockResolvedValueOnce({
    data: {
      _embedded: {
        employeeList: [
          { name: 'John Doe', role: 'Developer', _links: { self: { href: '/employees/1' } } },
        ],
      },
    },
  });
  render(<App />);
  const editButton = await screen.findByRole('button', { name: /edit/i });
  editButton.click();

  const nameField = await screen.findByTestId("EmpFormNameId");
  const roleField = await screen.findByTestId("EmpFormRoleId");

  expect(nameField).toHaveValue('John Doe');
  expect(roleField).toHaveValue('Developer');
}); 
