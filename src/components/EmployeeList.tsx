import React, { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee } from '../services/employeeService';
import { Box, Button, List, ListItem, IconButton, Typography, Alert, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';

interface Employee {
    name: string;
    role: string;
    _links: { self: { href: string } };
}

export default function EmployeeList({ onEdit }: { onEdit: (employee: Employee) => void }) {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

    const fetchEmployees = async () => {
        const res = await getEmployees();
        setEmployees(res.data._embedded?.employeeList ?? []);
    };

    useEffect(() => { fetchEmployees(); }, []);

    const handleDeleteClick = (employee: Employee) => {
        setEmployeeToDelete(employee);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (employeeToDelete) {
            await deleteEmployee(employeeToDelete._links.self.href);
            fetchEmployees();
        }
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
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
                                <IconButton role='button' aria-label='delete' id='EmpDelete' edge="end" onClick={() => handleDeleteClick(emp)}>
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
            
            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title" sx={{ display: 'flex', alignItems: 'center', color: 'warning.main' }}>
                    <WarningIcon sx={{ mr: 1, color: 'warning.main' }} />
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete "{employeeToDelete?.name}"? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
