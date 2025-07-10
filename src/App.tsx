import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import { Container, Paper, Typography } from '@mui/material';

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
      <Typography variant="h4" align="center" gutterBottom>
        Employees of Bini corporation
      </Typography>
      <Container maxWidth="lg" sx={{ mt: 4 }}>
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
            onEdit={emp => setEditingEmployee({ ...emp })}
          />
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
export default App;