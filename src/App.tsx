import React, { useState } from 'react';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import { Container, Paper } from '@mui/material';

function App() {
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [refresh, setRefresh] = useState(0);

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <EmployeeForm
          employee={editingEmployee}
          onSuccess={() => {
            setEditingEmployee(null);
            setRefresh(r => r + 1);
          }}
        />
        <EmployeeList
          key={refresh}
          onEdit={emp => setEditingEmployee(emp)}
        />
      </Paper>
    </Container>
  );
}

export default App;