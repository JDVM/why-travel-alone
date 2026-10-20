import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Account } from '../types';
import { getToken, setToken, clearToken } from './token';
import * as authApi from '../api/auth';

interface AuthContextValue {
    account: Account | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [account, setAccount] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);

    // On first load, if a token is present, validate and hydrate the account
    // from /auth/me. A rejected call (expired/invalid token) clears it.
    useEffect(() => {
        if (!getToken()) {
            setLoading(false);
            return;
        }
        authApi
            .getMe()
            .then((acct) => setAccount(acct))
            .catch(() => {
                clearToken();
                setAccount(null);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async (email: string, password: string) => {
        const { token, account: acct } = await authApi.login(email, password);
        setToken(token);
        setAccount(acct);
    };

    const register = async (email: string, password: string) => {
        const { token, account: acct } = await authApi.register(email, password);
        setToken(token);
        setAccount(acct);
    };

    const logout = () => {
        clearToken();
        setAccount(null);
    };

    return (
        <AuthContext.Provider
            value={{ account, isAuthenticated: !!account, loading, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
}
