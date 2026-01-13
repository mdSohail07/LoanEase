import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoanApplication = () => {
    const [formData, setFormData] = useState({ amount: '', tenure: '', interestRate: 5 });
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.post('http://localhost:5001/api/loans', formData, config);
            navigate('/user/dashboard');
        } catch (error) {
            console.error('Error applying for loan:', error);
            alert('Failed to apply for loan');
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-lg">
            <h1 className="text-3xl font-bold mb-6">Apply for a Loan</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Loan Amount ($)</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Tenure (months)</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded"
                            value={formData.tenure}
                            onChange={(e) => setFormData({ ...formData, tenure: e.target.value })}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Interest Rate (%)</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded bg-gray-100"
                            value={formData.interestRate}
                            readOnly
                        />
                        <p className="text-xs text-gray-500 mt-1">Fixed interest rate for now.</p>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button type="button" onClick={() => navigate('/user/dashboard')} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Submit Application</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoanApplication;
