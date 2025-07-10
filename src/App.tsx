import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import { Container, Paper } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  },
});

function App() {
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [refresh, setRefresh] = useState(0);

  return (
    <ThemeProvider theme={darkTheme}>
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
    </ThemeProvider>
  );
}

export default App;