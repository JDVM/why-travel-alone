import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Account } from '../types';
import { getToken, setToken, clearToken } from './token';
import * as authApi from '../api/auth';
import { Registration } from '../api/auth';
import { setMonitoringUser } from '../monitoring';

interface AuthContextValue {
    account: Account | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (registration: Registration) => Promise<void>;
    // Signs out. A notice (e.g. "Your account has been deleted") is shown on
    // the login page, however the app gets there.
    logout: (notice?: string) => void;
    // The notice from the last logout, until the next login.
    logoutNotice: string | null;
    // Re-reads the account, e.g. after creating or renaming the traveler profile.
    refreshAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [account, setAccount] = useState<Account | null>(null);
    const [loading, setLoading] = useState(true);
    const [logoutNotice, setLogoutNotice] = useState<string | null>(null);

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

    // Error reports name the signed-in account by id only.
    useEffect(() => {
        setMonitoringUser(account ? account.id : null);
    }, [account]);

    const login = async (email: string, password: string) => {
        const { token, account: acct } = await authApi.login(email, password);
        setToken(token);
        setLogoutNotice(null);
        setAccount(acct);
    };

    const register = async (registration: Registration) => {
        const { token, account: acct } = await authApi.register(registration);
        setToken(token);
        setAccount(acct);
    };

    const logout = (notice?: string) => {
        clearToken();
        setLogoutNotice(notice ?? null);
        setAccount(null);
    };

    const refreshAccount = async () => {
        setAccount(await authApi.getMe());
    };

    return (
        <AuthContext.Provider
            value={{ account, isAuthenticated: !!account, loading, login, register, logout, logoutNotice, refreshAccount }}
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
