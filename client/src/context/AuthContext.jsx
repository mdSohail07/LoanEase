import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('loanEaseUser');
        if (userInfo) {
            try {
                const parsedUser = JSON.parse(userInfo);
                setUser(parsedUser);
            } catch (e) {
                localStorage.removeItem('loanEaseUser');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
            setUser(response.data);
            localStorage.setItem('loanEaseUser', JSON.stringify(response.data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
            setUser(response.data);
            localStorage.setItem('loanEaseUser', JSON.stringify(response.data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('loanEaseUser');
    };

    const updateUserData = (newData) => {
        setUser(prev => {
            if (!prev) return null;
            const updated = { ...prev, ...newData };
            localStorage.setItem('loanEaseUser', JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, updateUserData }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
