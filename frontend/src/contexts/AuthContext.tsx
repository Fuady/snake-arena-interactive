import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/game';
import { api } from '@/services/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            const currentUser = await api.getCurrentUser();
            setUser(currentUser);
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        const result = await api.login(username, password);
        if (result.success && result.user) {
            setUser(result.user);
        }
        return result;
    };

    const signup = async (username: string, password: string) => {
        const result = await api.signup(username, password);
        if (result.success && result.user) {
            setUser(result.user);
        }
        return result;
    };

    const logout = async () => {
        await api.logout();
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
