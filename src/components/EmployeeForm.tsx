import React, { useState, useEffect } from 'react';
import { createEmployee, updateEmployee } from '../services/employeeService';
import { Alert, Button, TextField, Box, Typography } from '@mui/material';

interface Employee {
    name: string;
    role: string;
    _links?: { self: { href: string } };
}

export default function EmployeeForm({ employee, onSuccess }: { employee?: Employee, onSuccess: () => void }) {
    const [form, setForm] = useState(employee || { name: '', role: '' });
    useEffect(() => {
        setForm(employee || { name: '', role: '' });
    }, [employee]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        try {
            if (employee && employee._links) {
                await updateEmployee(employee._links.self.href, form);
                setMessage({ type: 'success', text: 'Employee updated successfully!' });
            } else {
                await createEmployee(form);
                setMessage({ type: 'success', text: 'Employee created successfully!' });
            }
            onSuccess();
            setForm({ name: '', role: '' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" role='form' aria-label='Employee Form' id='EmpFormId' onSubmit={handleSubmit} sx={{ mb: 2 }}>
            {message && (
                <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}
            <Typography variant="h6">{employee ? 'Edit Employee' : 'Add Employee'}</Typography>
            <TextField
                label="Name"
                name="name"
                value={form.name}
                role="textbox"
                aria-label="Employee name"
                onChange={handleChange}
                required
                fullWidth
                sx={{ mb: 2 }}
            />
            <TextField
                label="Role"
                name="role"
                value={form.role}
                role="listbox"
                aria-label="Employee role"
                onChange={handleChange}
                required
                fullWidth
                sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color='success' role="button"
                aria-label="Create employee">{employee ? 'Update' : 'Create'}</Button>
        </Box>
    );
}