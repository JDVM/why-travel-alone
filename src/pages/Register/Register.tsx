import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Checkbox, FormControlLabel, Link, Stack, TextField } from '@mui/material';
import { useAuth } from '../../auth/AuthContext';
import { AuthError, AuthForm, AuthLink, AuthPage, AuthSwitch } from '../../auth/AuthPage';

const MIN_PASSWORD_LENGTH = 8;

function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < MIN_PASSWORD_LENGTH) {
            setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
            return;
        }
        if (!acceptTerms) {
            setError('Please accept the Terms of Service and Privacy Policy to create an account.');
            return;
        }

        setSubmitting(true);
        try {
            await register({ email, password, first_name: firstName, last_name: lastName, accept_terms: acceptTerms });
            // Name now, the rest of the profile later: send new users to their profile.
            navigate('/profile', { state: { welcome: true } });
        } catch (err) {
            const message =
                axios.isAxiosError(err) && err.response?.data?.error
                    ? err.response.data.error
                    : 'Unable to register. Please try again.';
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AuthPage title="Create Account">
            <AuthForm onSubmit={handleSubmit}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                        id="firstName"
                        label="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        autoComplete="given-name"
                        fullWidth
                        slotProps={{ htmlInput: { required: true, maxLength: 255 } }}
                    />
                    <TextField
                        id="lastName"
                        label="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        autoComplete="family-name"
                        fullWidth
                        slotProps={{ htmlInput: { required: true, maxLength: 255 } }}
                    />
                </Stack>
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
                    autoComplete="new-password"
                    helperText={`At least ${MIN_PASSWORD_LENGTH} characters.`}
                    slotProps={{ htmlInput: { required: true, minLength: MIN_PASSWORD_LENGTH } }}
                />
                <FormControlLabel
                    sx={{ alignItems: 'flex-start', '& .MuiCheckbox-root': { pt: 0 } }}
                    control={
                        <Checkbox
                            id="acceptTerms"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            slotProps={{ input: { required: true } }}
                        />
                    }
                    label={
                        <span>
                            I agree to the{' '}
                            <AuthLinkNewTab to="/terms">Terms of Service</AuthLinkNewTab>{' '}
                            and have read the{' '}
                            <AuthLinkNewTab to="/privacy">Privacy Policy</AuthLinkNewTab>.
                        </span>
                    }
                />
                {error && <AuthError>{error}</AuthError>}
                <Button variant="contained" size="large" type="submit" disabled={submitting}>
                    {submitting ? 'Creating account…' : 'Register'}
                </Button>
            </AuthForm>
            <AuthSwitch>
                Already have an account? <AuthLink to="/login">Log in</AuthLink>
            </AuthSwitch>
        </AuthPage>
    );
}

// The legal pages open in a new tab so the half-filled form isn't lost.
function AuthLinkNewTab({ to, children }: { to: string; children: string }) {
    return (
        <Link href={to} target="_blank" rel="noopener noreferrer">
            {children}
        </Link>
    );
}

export default Register;
