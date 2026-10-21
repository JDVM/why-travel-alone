import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField } from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import { AuthError, AuthForm, AuthLink, AuthNotice, AuthPage, AuthSwitch } from '../../auth/AuthPage';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const { login, logoutNotice } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await login(email, password);
            navigate('/Trips');
        } catch (err) {
            const message =
                axios.isAxiosError(err) && err.response?.data?.error
                    ? err.response.data.error
                    : 'Unable to log in. Please try again.';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthPage title="Log In">
            {logoutNotice && <AuthNotice>{logoutNotice}</AuthNotice>}
            <AuthForm onSubmit={handleSubmit}>
                <TextField
                    id="email"
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    slotProps={{ htmlInput: { required: true } }}
                />
                <TextField
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    slotProps={{ htmlInput: { required: true } }}
                />
                {error && <AuthError>{error}</AuthError>}
                <Button variant="contained" size="large" type="submit" disabled={submitting}>
                    {submitting ? 'Logging in…' : 'Log In'}
                </Button>
            </AuthForm>
            <AuthSwitch>
                <AuthLink to="/forgot-password">Forgot your password?</AuthLink>
            </AuthSwitch>
            <AuthSwitch>
                Need an account? <AuthLink to="/register">Register</AuthLink>
            </AuthSwitch>
        </AuthPage>
    );
}

export default Login;
