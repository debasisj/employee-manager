import React, { useState, useEffect } from 'react';
import { createEmployee, updateEmployee } from '../services/employeeService';
import { Alert, Button, TextField, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
        const name = e.target.name;
        const value = e.target.value;
        setForm({ ...form, [name]: value });
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

                inputProps={{ 'data-testid': 'EmpFormNameId' }}
                aria-label="Employee name"
                onChange={handleChange}
                required
                fullWidth
                sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                    labelId="role-label"
                    name="role"
                    value={form.role}
                    label="Role"
                    onChange={handleChange}
                    inputProps={{ 'data-testid': 'EmpFormRoleId' }}
                    aria-label="Employee role"
                    required
                >
                    <MenuItem value="Developer">Developer</MenuItem>
                    <MenuItem value="Manager">Manager</MenuItem>
                    <MenuItem value="Designer">Designer</MenuItem>
                    <MenuItem value="QA Engineer">QA Engineer</MenuItem>
                    <MenuItem value="DevOps">DevOps</MenuItem>
                    <MenuItem value="Product Manager">Product Manager</MenuItem>
                </Select>
            </FormControl>
            <Button type="submit" variant="contained" color='success' role="button"
                aria-label="Create employee">{employee ? 'Update' : 'Create'}</Button>
        </Box>
    );
}