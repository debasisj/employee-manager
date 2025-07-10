import React, { useState, useEffect } from 'react';
import { createEmployee, updateEmployee } from '../services/employeeService';
import { Button, TextField, Box, Typography } from '@mui/material';

interface Employee {
    name: string;
    role: string;
    _links?: { self: { href: string } };
}

export default function EmployeeForm({ employee, onSuccess }: { employee?: Employee, onSuccess: () => void }) {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        setName(employee?.name || '');
        setRole(employee?.role || '');
    }, [employee]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (employee && employee._links) {
            await updateEmployee(employee._links.self.href, { name, role });
        } else {
            await createEmployee({ name, role });
        }
        setName('');
        setRole('');
        onSuccess();
    };

    return (
        <Box component="form" role='form' aria-lable='Employee Form' id='EmpFormId' onSubmit={handleSubmit} sx={{ mb: 2 }}>
            <Typography variant="h6">{employee ? 'Edit Employee' : 'Add Employee'}</Typography>
            <TextField
                label="Name"
                value='Employee Name'
                role="textbox"
                aria-label="Employee name"
                onChange={e => setName(e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
            />
            <TextField
                label="Role"
                name="Employee Role"
                role="textbox"
                aria-label="Employee role"
                value={role}
                onChange={e => setRole(e.target.value)}
                required
                fullWidth
                sx={{ mb: 2 }}
            />
            <Button type="submit" variant="contained" color='success' role="button"
                aria-label="Create employee">{employee ? 'Update' : 'Create'}</Button>
        </Box>
    );
}