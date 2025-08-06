import React, { useState } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    Container
} from '@mui/material';
import { login, LoginRequest } from '../services/employeeService';

interface LoginFormProps {
    onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
    const [form, setForm] = useState<LoginRequest>({
        userId: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await login(form);
            localStorage.setItem('authToken', response.token);
            onLoginSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Employee Manager
                    </Typography>
                    <Typography variant="h6" component="h2" gutterBottom align="center">
                        Login
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="User ID"
                            name="userId"
                            value={form.userId}
                            onChange={handleChange}
                            required
                            sx={{ mb: 2 }}
                            placeholder="admin"
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            sx={{ mb: 3 }}
                            placeholder="G5hnX2GMyFEetC1"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{ mb: 2 }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </Box>

                    <Typography variant="body2" align="center" color="textSecondary">
                        Default credentials: admin / G5hnX2GMyFEetC1
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
}
