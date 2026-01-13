import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('loanEaseUser');
        if (userInfo) {
            const parsedUser = JSON.parse(userInfo);
            setUser(parsedUser);
            // Optional: Verify token with backend here
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:5001/api/auth/login', { email, password });
            setUser(response.data);
            localStorage.setItem('loanEaseUser', JSON.stringify(response.data));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
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

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
