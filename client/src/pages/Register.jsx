import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(formData.name, formData.email, formData.password);
        if (result.success) {
            navigate('/user/kyc'); // Direct to KYC first for 100% flow
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20">
            <div className="card-premium glass p-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-2">Join LoanEase</h1>
                    <p className="text-gray-600">Create an account to start your application</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                    {/* Honeypot to trick browser autofill */}
                    <input type="text" name="prevent_autofill" style={{ display: 'none' }} tabIndex="-1" />
                    <input type="password" name="password_prevent_autofill" style={{ display: 'none' }} tabIndex="-1" />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            name="reg_fullname"
                            id="reg_fullname"
                            className="input-premium"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="reg_email"
                            id="reg_email"
                            className="input-premium"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            name="reg_password"
                            id="reg_password"
                            className="input-premium"
                            placeholder="Enter a secure password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            autoComplete="new-password"
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full py-4 text-lg">
                        Create Account
                    </button>
                    <p className="text-center text-sm text-gray-600">
                        Already have an account? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
