import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import {
    User,
    Session,
    saveUser,
    findUserByEmail,
    validateCredentials,
    saveSession,
    getSession,
    clearSession,
    generateId,
    isValidEmail,
} from '@/lib/authUtils';

interface AuthContextType {
    user: Session | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, password: string) => Promise<boolean>;
    loginAsGuest: () => void;
    logout: () => void;
    isAuthenticated: boolean;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Check for existing session on mount
    useEffect(() => {
        const session = getSession();
        if (session) {
            setUser(session);
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        if (!email || !password) {
            toast({
                title: 'Validation Error',
                description: 'Please enter both email and password',
                variant: 'destructive',
            });
            return false;
        }

        if (!isValidEmail(email)) {
            toast({
                title: 'Invalid Email',
                description: 'Please enter a valid email address',
                variant: 'destructive',
            });
            return false;
        }

        const validUser = validateCredentials(email, password);

        if (validUser) {
            const session: Session = {
                userId: validUser.id,
                email: validUser.email,
                name: validUser.name,
                isGuest: false,
                loginTime: new Date().toISOString(),
            };

            saveSession(session);
            setUser(session);

            toast({
                title: 'Welcome back!',
                description: `Logged in as ${validUser.name}`,
            });

            navigate('/');
            return true;
        } else {
            toast({
                title: 'Login Failed',
                description: 'Invalid email or password',
                variant: 'destructive',
            });
            return false;
        }
    };

    const signup = async (name: string, email: string, password: string): Promise<boolean> => {
        if (!name || !email || !password) {
            toast({
                title: 'Validation Error',
                description: 'Please fill in all fields',
                variant: 'destructive',
            });
            return false;
        }

        if (!isValidEmail(email)) {
            toast({
                title: 'Invalid Email',
                description: 'Please enter a valid email address',
                variant: 'destructive',
            });
            return false;
        }

        if (password.length < 6) {
            toast({
                title: 'Weak Password',
                description: 'Password must be at least 6 characters',
                variant: 'destructive',
            });
            return false;
        }

        const existingUser = findUserByEmail(email);
        if (existingUser) {
            toast({
                title: 'Email Already Exists',
                description: 'This email is already registered. Please login instead.',
                variant: 'destructive',
            });
            return false;
        }

        const newUser: User = {
            id: generateId(),
            name,
            email,
            password, // In production, this should be hashed
            isGuest: false,
            createdAt: new Date().toISOString(),
        };

        try {
            saveUser(newUser);

            const session: Session = {
                userId: newUser.id,
                email: newUser.email,
                name: newUser.name,
                isGuest: false,
                loginTime: new Date().toISOString(),
            };

            saveSession(session);
            setUser(session);

            toast({
                title: 'Account Created!',
                description: `Welcome, ${newUser.name}!`,
            });

            navigate('/');
            return true;
        } catch (error) {
            toast({
                title: 'Signup Failed',
                description: 'Unable to create account. Please try again.',
                variant: 'destructive',
            });
            return false;
        }
    };

    const loginAsGuest = () => {
        const guestSession: Session = {
            userId: `guest-${generateId()}`,
            email: 'guest@aigrade.com',
            name: 'Guest User',
            isGuest: true,
            loginTime: new Date().toISOString(),
        };

        saveSession(guestSession);
        setUser(guestSession);

        toast({
            title: 'Welcome!',
            description: 'Signed in as guest',
        });

        navigate('/');
    };

    const logout = () => {
        clearSession();
        setUser(null);
        toast({
            title: 'Logged Out',
            description: 'You have been logged out successfully',
        });
        navigate('/login');
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        signup,
        loginAsGuest,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
