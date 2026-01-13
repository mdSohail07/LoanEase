import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-blue-600 p-4 text-white shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold">SmartLoan</Link>
                <div>
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span>Welcome, {user.name}</span>
                            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/login" className="hover:text-gray-200">Login</Link>
                            <Link to="/register" className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
