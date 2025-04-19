import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../services/ApiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoggedInStatus = async () => {
            setLoading(true);
            try {
                const response = await ApiService.get('/auth/me');
                if (response.success && response.data) {
                    setUser(response.data);
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Not authenticated:', error.message);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkLoggedInStatus();
    }, []);

    const register = async (userData) => {
        setLoading(true);
        try {
            const response = await ApiService.post('/auth/register', userData);
            if (response.success && response.user) {
                setUser(response.user);
                setIsAuthenticated(true);
                setLoading(false);
                navigate('/');
                return { success: true };
            }
            throw new Error(response.message || 'Registration failed');
        } catch (error) {
            console.error('Registration error:', error.message);
            setLoading(false);
            return { success: false, message: error.message || 'An error occurred during registration.' };
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        try {
            const response = await ApiService.post('/auth/login', credentials);
            if (response.success && response.user) {
                setUser(response.user);
                setIsAuthenticated(true);
                setLoading(false);
                navigate('/');
                return { success: true };
            }
            throw new Error(response.message || 'Login failed');
        } catch (error) {
            console.error('Login error:', error.message);
            setLoading(false);
            return { success: false, message: error.message || 'An error occurred during login.' };
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await ApiService.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error.message);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
            navigate('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};