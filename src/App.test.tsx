import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import axios from 'axios';

// Mocking axios to avoid actual API calls
jest.mock('axios');

beforeEach(() => {
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