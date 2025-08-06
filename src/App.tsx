import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, Box, Button } from '@mui/material';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import LoginForm from './components/LoginForm';
import { Container, Paper, Typography } from '@mui/material';
import { isAuthenticated, logout } from './services/employeeService';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setEditingEmployee(null);
  };

  const handleEdit = (employee: any) => {
    setEditingEmployee({ ...employee });
  };

  const handleSuccess = () => {
    setEditingEmployee(null);
    setRefresh(prev => prev + 1);
  };

  if (!isLoggedIn) {
    return (
      <ThemeProvider theme={theme}>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ pt: 4, pb: 4, position: 'relative', zIndex: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                color: 'white',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                fontWeight: 'bold'
              }}
            >
              Employees of Bini Corporation
            </Typography>
            <Button
              variant="outlined"
              onClick={handleLogout}
              sx={{
                color: 'white',
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Logout
            </Button>
          </Box>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              backgroundColor: 'white',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <EmployeeForm
              employee={editingEmployee}
              onSuccess={handleSuccess}
            />
            <EmployeeList
              key={refresh}
              onEdit={handleEdit}
            />
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;