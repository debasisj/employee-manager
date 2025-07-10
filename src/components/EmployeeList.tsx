import React, { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee } from '../services/employeeService';
import { Button, List, ListItem, ListItemText, IconButton, Typography } from '@mui/material';
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
        setEmployees(res.data._embedded.employeeList);
    };

    useEffect(() => { fetchEmployees(); }, []);

    const handleDelete = async (url: string) => {
        await deleteEmployee(url);
        fetchEmployees();
    };

    return (
        <div>
            <Typography variant="h5" gutterBottom>Employees</Typography>
            <List role='list' aria-label='Employee List' id='EmpListId'>
                {employees.map(emp => (
                    <ListItem role='listitem' aria-label='Employee List Item'
                        key={emp._links.self.href}
                        secondaryAction={
                            <>
                                <Button aria-label='Employee Edit' id='EmpEditId' onClick={() => onEdit(emp)}>Edit</Button>
                                <IconButton role='button' aria-label='delete' id='EmpDelete' edge="end" onClick={() => handleDelete(emp._links.self.href)}>
                                    <DeleteIcon color='error' />
                                </IconButton>
                            </>
                        }
                    >
                        <ListItemText primary={emp.name} secondary={emp.role} />
                    </ListItem>
                ))}
            </List>
            <Button variant="contained" color='secondary' onClick={fetchEmployees}>Refresh</Button>
        </div>
    );
}