import React, { useState, useEffect } from 'react';
import { createEmployee, updateEmployee, Employee } from '../services/employeeService';
import { Alert, Button, TextField, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { SelectChangeEvent } from '@mui/material';

export default function EmployeeForm({ employee, onSuccess }: { employee?: Employee, onSuccess: () => void }) {
    const [form, setForm] = useState(employee || { name: '', role: '' });

    useEffect(() => {
        setForm(employee || { name: '', role: '' });
    }, [employee]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (e: SelectChangeEvent) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name as string]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (employee && employee._links) {
                await updateEmployee(employee._links.self.href, { name: form.name, role: form.role });
                setMessage({ type: 'success', text: 'Employee updated successfully!' });
            } else {
                await createEmployee({ name: form.name, role: form.role });
                setMessage({ type: 'success', text: 'Employee created successfully!' });
            }
            onSuccess();
            if (!employee) {
                setForm({ name: '', role: '' });
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Something went wrong. Please try again.';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" role='form' aria-label='Employee Form' data-testid='employee-form' onSubmit={handleSubmit} sx={{ mb: 4 }}>
            {message && (
                <Alert severity={message.type} onClose={() => setMessage(null)} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            <Typography variant="h6" sx={{ mb: 2 }}>
                {employee ? 'Edit Employee' : 'Add Employee'}
            </Typography>

            <TextField
                label="Name"
                name="name"
                value={form.name}
                inputProps={{ 'data-testid': 'EmpFormNameId' }}
                aria-label="Employee name"
                onChange={handleTextFieldChange}
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
                    onChange={handleSelectChange}
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

            <Button
                type="submit"
                variant="contained"
                color='primary'
                disabled={loading}
                sx={{ mr: 2 }}
            >
                {loading ? 'Saving...' : (employee ? 'Update' : 'Create')}
            </Button>

            {employee && (
                <Button
                    variant="outlined"
                    onClick={() => onSuccess()}
                >
                    Cancel
                </Button>
            )}
        </Box>
    );
}