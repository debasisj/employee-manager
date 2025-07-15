import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import EmployeeList from './components/EmployeeList';
import EmployeeForm from './components/EmployeeForm';
import { Container, Paper, Typography, Box } from '@mui/material';

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
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [refresh, setRefresh] = useState(0);

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
          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom
            sx={{
              color: 'white',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontWeight: 'bold',
              mb: 4
            }}
          >
            Employees of Bini corporation
          </Typography>
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
      </Box>
    </ThemeProvider>
  );
}
export default App;