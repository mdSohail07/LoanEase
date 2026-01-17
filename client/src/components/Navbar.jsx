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
        <nav className="sticky top-0 z-50 glass border-b border-white/20 px-6 py-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-tighter uppercase gradient-text">LoanEase</Link>
                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            <Link to={user.role === 'admin' ? "/admin/dashboard" : "/user/dashboard"} className="text-sm font-medium hover:text-indigo-600 transition-colors">Dashboard</Link>
                            {user.role === 'user' && <Link to="/user/loan-application" className="text-sm font-medium hover:text-indigo-600 transition-colors">Apply Loan</Link>}
                            <div className="h-6 w-px bg-gray-200 mx-2"></div>
                            <span className="text-sm font-semibold text-gray-700 hidden sm:block">Hi, {user.name}</span>
                            <button onClick={handleLogout} className="btn-secondary py-2 px-4 text-sm bg-red-50 text-red-600 border-red-100 hover:bg-red-100">
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium hover:text-indigo-600 transition-colors">Login</Link>
                            <Link to="/register" className="btn-primary py-2 px-6 text-sm">
                                Join Now
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
