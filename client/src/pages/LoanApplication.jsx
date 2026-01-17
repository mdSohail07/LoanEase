import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaMoneyBillWave, FaClock, FaPercentage, FaCheckCircle } from 'react-icons/fa';
const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const LoanApplication = () => {
    const [formData, setFormData] = useState({
        amount: 5000,
        tenure: 12,
        interestRate: 10,
        loanType: 'personal',
        purpose: ''
    });
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [emi, setEmi] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        // Dynamic interest rate based on credit score: Better score = Lower rate
        // Base rate 12%, minus 1% for every 100 points above 500, floor at 4%, ceiling at 15%
        const score = user?.creditScore || 500;
        let rate = 12;
        if (score > 500) {
            rate = Math.max(4, 12 - Math.floor((score - 500) / 100) * 1.5);
        } else {
            rate = Math.min(15, 12 + Math.floor((500 - score) / 100) * 1.5);
        }

        setFormData(prev => ({ ...prev, interestRate: rate }));
    }, [user?.creditScore]);

    useEffect(() => {
        const r = (formData.interestRate / 100) / 12;
        const n = formData.tenure;
        const emiVal = (formData.amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        setEmi(emiVal.toFixed(2));
    }, [formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.post(`${API_URL}/api/loans`, formData, config);
            navigate('/user/dashboard');
        } catch (error) {
            console.error('Error applying for loan:', error);
            alert('Failed to apply for loan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-3">Apply for a Loan</h1>
                <p className="text-gray-600">Choose your amount and tenure to get started.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="card-premium space-y-8">
                        <div className="grid grid-cols-3 gap-4">
                            {['personal', 'business', 'education'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, loanType: type })}
                                    className={`py-3 px-4 rounded-xl border-2 font-bold capitalize transition-all ${formData.loanType === type
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                                        : 'border-gray-100 hover:border-gray-300 text-gray-400'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>

                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="flex items-center gap-2 font-medium text-gray-700">
                                    <FaMoneyBillWave className="text-indigo-500" /> Loan Amount
                                </label>
                                <span className="text-2xl font-bold text-indigo-600">${formData.amount}</span>
                            </div>
                            <input
                                type="range"
                                min="1000"
                                max="100000"
                                step="1000"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-4">
                                <label className="flex items-center gap-2 font-medium text-gray-700">
                                    <FaClock className="text-blue-500" /> Tenure (Months)
                                </label>
                                <span className="text-2xl font-bold text-blue-600">{formData.tenure} Mon</span>
                            </div>
                            <input
                                type="range"
                                min="3"
                                max="36"
                                step="1"
                                value={formData.tenure}
                                onChange={(e) => setFormData({ ...formData, tenure: Number(e.target.value) })}
                                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Purpose of Loan</label>
                            <textarea
                                className="input-premium h-24"
                                placeholder="E.g. Starting a new business, paying tuition fees..."
                                value={formData.purpose}
                                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || user.kycStatus !== 'approved'}
                            className="btn-primary w-full py-4 text-lg"
                        >
                            {loading ? 'Processing...' : user.kycStatus === 'approved' ? 'Submit Application' : 'Complete KYC to Apply'}
                        </button>

                        {user.kycStatus !== 'approved' && (
                            <p className="text-center text-sm text-amber-600 font-medium">
                                ⚠️ You need to complete your KYC verification before applying.
                            </p>
                        )}
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="card-premium glass bg-indigo-50 border-indigo-100">
                        <h3 className="text-lg font-bold mb-6">EMI Breakdown</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Principal</span>
                                <span className="font-semibold">${formData.amount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Interest Rate</span>
                                <span className="font-semibold text-emerald-600">{formData.interestRate}%</span>
                            </div>
                            <div className="flex justify-between pt-4 border-t border-indigo-100">
                                <span className="font-bold">Monthly EMI</span>
                                <span className="text-2xl font-black text-indigo-700">${emi}</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 bg-white rounded-2xl border border-gray-100">
                        <h4 className="font-bold mb-4">How it works</h4>
                        <ol className="space-y-4 text-xs text-gray-500 list-decimal pl-4">
                            <li>Submit your application with accurate details.</li>
                            <li>Our admin team will review your KYC and credit eligibility.</li>
                            <li>Once approved, the amount will be disbursed to your account.</li>
                            <li>You can track repayments from your dashboard.</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanApplication;
