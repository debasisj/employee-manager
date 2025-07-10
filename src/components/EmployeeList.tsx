import React, { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee } from '../services/employeeService';
import { Box, Button, List, ListItem, IconButton, Typography, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface Employee {
    name: string;
    role: string;
    _links: { self: { href: string } };
}

export default function EmployeeList({ onEdit }: { onEdit: (employee: Employee) => void }) {
    const [employees, setEmployees] = useState<Employee[]>([]);

    const fetchEmployees = async () => {
        const res = await getEmployees();
        setEmployees(res.data._embedded?.employeeList ?? []);
    };

    useEffect(() => { fetchEmployees(); }, []);

    const handleDelete = async (url: string) => {
        await deleteEmployee(url);
        fetchEmployees();
    };

    return (
        <div>
            <Typography variant="h5" gutterBottom>Employees</Typography>
            {employees.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    No existing employee - add one
                </Alert>
            )}
            <Box sx={{ display: 'flex', width: '100%', fontWeight: 'bold', mb: 1, px: 2 }}>
                <Box sx={{ flex: 1, textAlign: 'left' }} aria-label='EmpListNameHeader'>Name</Box>
                <Box sx={{ flex: 1, textAlign: 'left' }} aria-label='EmpListRoleHeader'>Role</Box>
            </Box>
            <List role='list' aria-label='Employee List' id='EmpListId'>
                {employees.map(emp => (
                    <ListItem role='listitem' aria-label='Employee List Item'
                        key={emp._links.self.href}
                        sx={{ px: 2 }}
                        secondaryAction={
                            <>
                                <Button aria-label='edit' id='EmpEditId' onClick={() => onEdit(emp)}>Edit</Button>
                                <IconButton role='button' aria-label='delete' id='EmpDelete' edge="end" onClick={() => handleDelete(emp._links.self.href)}>
                                    <DeleteIcon color='error' />
                                </IconButton>
                            </>
                        }
                    >
                        <Box sx={{ display: 'flex', width: '100%' }}>
                            <Box sx={{ flex: 1, textAlign: 'left' }}>{emp.name || 'Ghost'}</Box>
                            <Box sx={{ flex: 1, textAlign: 'left' }}>{emp.role || 'No Role'}</Box>
                        </Box>
                    </ListItem>
                ))}
            </List>
            <Button variant="contained" color='secondary' onClick={fetchEmployees}>Refresh</Button>
        </div>
    );
}
