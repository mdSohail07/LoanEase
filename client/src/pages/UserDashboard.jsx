import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaWallet, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaCalendarAlt, FaChartLine, FaArrowRight, FaClock, FaHandHoldingUsd } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:5050';
const UserDashboard = () => {
    const { user, updateUserData } = useAuth();
    const [loans, setLoans] = useState([]);
    const [stats, setStats] = useState({ totalBorrowed: 0, pendingAmount: 0, nextPayment: null });
    const [selectedLoan, setSelectedLoan] = useState(null);

    useEffect(() => {
        if (user && user.token) {
            fetchLoans();
        }
    }, [user]);

    const fetchLoans = async () => {
        if (!user || !user.token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`${API_URL}/api/loans`, config);
            setLoans(data);

            const disbursedLoans = data.filter(l => l.status === 'disbursed');
            const total = disbursedLoans.reduce((acc, loan) => acc + loan.amount, 0);

            // Find next payment
            let nextPay = null;
            disbursedLoans.forEach(l => {
                const pending = l.repaymentSchedule.find(s => s.status === 'pending');
                if (pending && (!nextPay || new Date(pending.dueDate) < new Date(nextPay))) {
                    nextPay = pending.dueDate;
                }
            });

            setStats({
                totalBorrowed: total,
                pendingAmount: disbursedLoans.reduce((acc, l) => acc + l.repaymentSchedule.filter(s => s.status === 'pending').reduce((a, s) => a + s.amount, 0), 0),
                nextPayment: nextPay
            });

            // Refresh credit score and sync state
            const scoreRes = await axios.get(`${API_URL}/api/auth/profile/credit-score`, config);
            updateUserData({ creditScore: scoreRes.data.creditScore });
        } catch (error) {
            console.error('Error fetching loans:', error);
        }
    };

    const handlePayment = async (loanId, emiId) => {
        if (!user || !user.token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`${API_URL}/api/loans/${loanId}/pay`, { emiId }, config);
            fetchLoans();
            alert('Payment Successful!');
        } catch (error) {
            alert('Payment Failed');
        }
    };

    const handleAcceptOffer = async (loanId) => {
        if (!user || !user.token) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`${API_URL}/api/loans/${loanId}/accept-offer`, {}, config);
            fetchLoans();
            alert('Offer Accepted! Waiting for disbursement.');
        } catch (error) {
            alert('Failed to accept offer');
        }
    };

    if (!user) return <div className="p-10 text-center font-black">Loading your financial profile...</div>;

    return (
        <div className="space-y-10 max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Hello, {user?.name || 'User'} 👋</h1>
                    <p className="text-gray-400 font-medium">Your financial overview for today.</p>
                </div>
                <Link to="/user/kyc" className={`px-6 py-3 rounded-2xl border-2 font-bold text-sm transition-all flex items-center gap-2 ${user?.kycStatus === 'approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                    user?.kycStatus === 'pending' ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-red-50 border-red-100 text-red-600 animate-pulse'
                    }`}>
                    {user?.kycStatus === 'approved' ? <FaCheckCircle /> : user?.kycStatus === 'pending' ? <FaHourglassHalf /> : <FaTimesCircle />}
                    KYC: {(user?.kycStatus || 'not_submitted').replace('_', ' ').toUpperCase()}
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card-premium glass p-8 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                        <FaWallet size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Principal</p>
                        <p className="text-3xl font-black">${stats.totalBorrowed.toLocaleString()}</p>
                    </div>
                </div>
                <div className="card-premium glass p-8 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
                        <FaChartLine size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Outstanding</p>
                        <p className="text-3xl font-black">${stats.pendingAmount.toLocaleString()}</p>
                    </div>
                </div>
                <div className="card-premium glass p-8 space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-200">
                        <FaCalendarAlt size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Next Due Date</p>
                        <p className="text-3xl font-black">{stats.nextPayment ? new Date(stats.nextPayment).toLocaleDateString('en-US', { day: '2-digit', month: 'short' }) : 'None'}</p>
                    </div>
                </div>
            </div>

            {/* Credit Score Banner */}
            <div className="card-premium bg-gradient-to-r from-indigo-600 to-blue-700 text-white p-8 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <FaChartLine size={120} />
                </div>
                <div className="space-y-2 relative z-10">
                    <h2 className="text-2xl font-black italic tracking-tighter">Your Financial Health</h2>
                    <p className="text-indigo-100 font-medium">We've updated your credit score based on your recent activity.</p>
                </div>
                <div className="text-center relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Credit Score</p>
                    <div className="text-6xl font-black tracking-tighter tabular-nums drop-shadow-xl">
                        {user.creditScore || 0}
                    </div>
                    <div className="mt-2 text-xs font-bold px-3 py-1 bg-white/20 rounded-full inline-block backdrop-blur-md">
                        {user?.creditScore > 700 ? 'EXCELLENT' : user?.creditScore > 500 ? 'GOOD' : 'POOR'}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Loan List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center px-2">
                        <h2 className="text-2xl font-black tracking-tight">Recent Applications</h2>
                        <Link to="/user/loan-application" className="btn-primary py-2 px-6 rounded-2xl text-xs">New Loan</Link>
                    </div>
                    <div className="space-y-4">
                        {loans.map(loan => (
                            <div
                                key={loan._id}
                                onClick={() => loan.status === 'disbursed' && setSelectedLoan(loan)}
                                className={`card-premium group p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ${selectedLoan?._id === loan._id ? 'border-indigo-600 ring-4 ring-indigo-50' : ''}`}
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                                            <FaClock size={16} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg">${loan.amount.toLocaleString()}</h3>
                                            <p className="text-[10px] font-black uppercase text-gray-400 tracking-tighter">{loan.loanType} • {loan.tenure} Months</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 line-clamp-1 italic">"{loan.purpose}"</p>
                                </div>
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className="hidden sm:block text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase">Monthly EMI</p>
                                        <p className="font-bold text-indigo-600">${loan.emiAmount}</p>
                                    </div>
                                    <div className={`flex-1 sm:flex-none py-2 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center ${loan.status === 'disbursed' ? 'bg-emerald-100 text-emerald-700' :
                                        loan.status === 'approved' ? 'bg-indigo-100 text-indigo-700' :
                                            loan.status === 'offered' ? 'bg-blue-100 text-blue-700' :
                                                loan.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {loan.status}
                                    </div>
                                    {loan.status === 'offered' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleAcceptOffer(loan._id); }}
                                            className="btn-primary py-2 px-4 rounded-xl text-[10px]"
                                        >
                                            ACCEPT OFFER
                                        </button>
                                    )}
                                    {loan.status === 'disbursed' && <FaArrowRight className="text-gray-300 group-hover:text-indigo-600 transition-colors" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Repayment Schedule */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black tracking-tight px-2">Repayments</h2>
                    {selectedLoan ? (
                        <div className="card-premium bg-gray-900 text-white p-8 space-y-8 animate-in fade-in slide-in-from-bottom-5">
                            <div className="space-y-1">
                                <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Repayment Schedule</p>
                                <h3 className="text-xl font-bold">Loan ID: ...{selectedLoan._id.slice(-6).toUpperCase()}</h3>
                            </div>
                            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                                {selectedLoan.repaymentSchedule.map((emi, idx) => (
                                    <div key={emi._id} className={`flex justify-between items-center p-4 rounded-2xl border ${emi.status === 'paid' ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}>
                                        <div className="space-y-1">
                                            <p className="text-xs text-gray-400 font-medium">{new Date(emi.dueDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</p>
                                            <p className="font-bold font-mono">${emi.amount}</p>
                                        </div>
                                        {emi.status === 'paid' ? (
                                            <span className="flex items-center gap-1 text-[10px] font-black text-emerald-400 uppercase">
                                                <FaCheckCircle /> Paid
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handlePayment(selectedLoan._id, emi._id)}
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[10px] font-black transition-all"
                                            >
                                                PAY NOW
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase">Paid So Far</p>
                                    <p className="text-lg font-bold text-emerald-400">${selectedLoan.repaymentSchedule.filter(s => s.status === 'paid').reduce((a, s) => a + s.amount, 0).toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-gray-400 uppercase">Remaining</p>
                                    <p className="text-lg font-bold">${selectedLoan.repaymentSchedule.filter(s => s.status === 'pending').reduce((a, s) => a + s.amount, 0).toFixed(2)}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card-premium border-dashed bg-transparent shadow-none h-[400px] flex items-center justify-center text-center p-10">
                            <div className="space-y-3">
                                <FaHandHoldingUsd className="mx-auto text-gray-200" size={50} />
                                <p className="text-gray-400 font-bold">Select a disbursed loan to view repayment schedule.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
