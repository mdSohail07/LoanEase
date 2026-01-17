import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(formData.email, formData.password);
        if (result.success) {
            navigate(formData.email === 'admin@gmail.com' ? '/admin/dashboard' : '/user/dashboard');
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20">
            <div className="card-premium glass p-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Enter your credentials to access your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="login_user_email"
                            id="login_user_email"
                            className="input-premium"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            autoComplete="chrome-off"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            name="login_user_password"
                            id="login_user_password"
                            className="input-premium"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full py-4 text-lg">
                        Sign In
                    </button>
                    <p className="text-center text-sm text-gray-600">
                        Don't have an account? <Link to="/register" className="text-indigo-600 font-semibold hover:underline">Create one</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
