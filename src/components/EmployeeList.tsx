import React, { useEffect, useState } from 'react';
import { getEmployees, deleteEmployee, Employee } from '../services/employeeService';
import { Box, Button, List, ListItem, IconButton, Typography, Alert, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import WarningIcon from '@mui/icons-material/Warning';

export default function EmployeeList({ onEdit }: { onEdit: (employee: Employee) => void }) {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getEmployees();
            setEmployees(res.data._embedded?.employeeList ?? []);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load employees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleDeleteClick = (employee: Employee) => {
        setEmployeeToDelete(employee);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (employeeToDelete) {
            try {
                await deleteEmployee(employeeToDelete._links!.self.href);
                fetchEmployees();
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to delete employee');
            }
        }
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setEmployeeToDelete(null);
    };

    if (loading) {
        return <Typography>Loading employees...</Typography>;
    }

    return (
        <div>
            <Typography variant="h5" gutterBottom>Employees</Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {employees.length === 0 && !error && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    No existing employee - add one
                </Alert>
            )}

            {employees.length > 0 && (
                <>
                    <Box sx={{ display: 'flex', width: '100%', fontWeight: 'bold', mb: 1, px: 2 }}>
                        <Box sx={{ flex: 1, textAlign: 'left' }} aria-label='EmpListNameHeader'>Name</Box>
                        <Box sx={{ flex: 1, textAlign: 'left' }} aria-label='EmpListRoleHeader'>Role</Box>
                        <Box sx={{ width: 120, textAlign: 'center' }}>Actions</Box>
                    </Box>

                    <List role='list' aria-label='Employee List' data-testid='employee-list'>
                        {employees.map(emp => (
                            <ListItem
                                key={emp._links!.self.href}
                                sx={{ px: 2, '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' } }}
                            >
                                <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                    <Box sx={{ flex: 1, textAlign: 'left' }}>{emp.name || 'No Name'}</Box>
                                    <Box sx={{ flex: 1, textAlign: 'left' }}>{emp.role || 'No Role'}</Box>
                                    <Box sx={{ width: 120, display: 'flex', justifyContent: 'center', gap: 1 }}>
                                        <IconButton
                                            aria-label='edit'
                                            onClick={() => onEdit(emp)}
                                            color="primary"
                                            size="small"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            aria-label='delete'
                                            onClick={() => handleDeleteClick(emp)}
                                            color="error"
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </>
            )}

            <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
                <DialogTitle>
                    <WarningIcon color="warning" sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Confirm Delete
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete employee "{employeeToDelete?.name}"?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
