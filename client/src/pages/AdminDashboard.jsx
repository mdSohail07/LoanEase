import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaUsers, FaHandHoldingUsd, FaClock, FaCheckCircle, FaTimesCircle, FaChartPie, FaRocket, FaHistory } from 'react-icons/fa';

const API_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5050'
    : import.meta.env.VITE_BACKEND_API_URL;


const AdminDashboard = () => {
    const { user } = useAuth();
    const [loans, setLoans] = useState([]);
    const [pendingKYCs, setPendingKYCs] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalLoans: 0,
        totalDisbursed: 0,
        pendingLoans: 0,
        monthlyData: [],
        typeDistribution: []
    });
    const [activeTab, setActiveTab] = useState('loans');

    useEffect(() => {
        fetchData();
    }, [user]);

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const [loansRes, kycsRes, statsRes, usersRes] = await Promise.all([
                axios.get(`${API_URL}/api/loans`, config),
                axios.get(`${API_URL}/api/admin/kyc/pending`, config),
                axios.get(`${API_URL}/api/admin/stats`, config),
                axios.get(`${API_URL}/api/admin/users`, config)
            ]);
            setLoans(loansRes.data);
            setPendingKYCs(kycsRes.data);
            setStats(statsRes.data);
            setAllUsers(usersRes.data);
        } catch (error) {
            console.error('Error fetching admin data:', error);
        }
    };

    const updateLoanStatus = async (id, status) => {
    try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.put(`${API_URL}/api/loans/${id}`, { status }, config);
        fetchData();
    } catch (error) {
        alert('Failed to update loan status');
    }
};
   const disburseLoan = async (id) => {
    try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.put(`${API_URL}/api/loans/${id}/disburse`, {}, config);
        fetchData();
        alert('Loan Disbursed Successfully!');
    } catch (error) {
        alert('Disbursement Failed');
    }
};

   const verifyKYC = async (userId, status) => {
    try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.put(`${API_URL}/api/admin/kyc/verify`, { userId, status }, config);
        fetchData();
        alert(`KYC Successfully ${status.toUpperCase()}! User has been notified.`);
    } catch (error) {
        alert('Failed to verify KYC');
    }
};

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className="space-y-10 max-w-7xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter">Command Center</h1>
                    <p className="text-gray-500 font-medium">Real-time platform insights and operations.</p>
                </div>
                <div className="flex gap-2 bg-gray-100 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab('analytics')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'analytics' ? 'bg-white shadow-xl text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Analytics
                    </button>
                    <button
                        onClick={() => setActiveTab('loans')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'loans' ? 'bg-white shadow-xl text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Applications
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-white shadow-xl text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setActiveTab('kyc')}
                        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'kyc' ? 'bg-white shadow-xl text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        KYC Queue {pendingKYCs.length > 0 && <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded-full text-[8px] animate-pulse">{pendingKYCs.length}</span>}
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {activeTab === 'analytics' ? (
                <div className="space-y-8">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Users', val: stats.totalUsers, icon: <FaUsers />, color: 'indigo' },
                            { label: 'Disbursed', val: `$${stats.totalDisbursed.toLocaleString()}`, icon: <FaHandHoldingUsd />, color: 'emerald' },
                            { label: 'Pending Apps', val: stats.pendingLoans, icon: <FaClock />, color: 'amber' },
                            { label: 'Active Loans', val: stats.activeLoans, icon: <FaRocket />, color: 'blue' },
                        ].map((s, i) => (
                            <div key={i} className={`card-premium glass p-6 border-b-4 border-${s.color}-500 group hover:shadow-2xl transition-all duration-500`}>
                                <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-${s.color}-600 mb-4 group-hover:bg-${s.color}-600 group-hover:text-white transition-colors duration-500`}>
                                    {s.icon}
                                </div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
                                <p className="text-3xl font-extrabold tracking-tighter">{s.val}</p>
                            </div>
                        ))}
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Custom Bar Chart for Monthly Data */}
                        <div className="card-premium p-8 space-y-8">
                            <div>
                                <h3 className="text-xl font-black italic tracking-tighter">Growth Trends</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">Disbursed Amount (Last 6 Months)</p>
                            </div>
                            <div className="h-64 flex items-end justify-between gap-4 px-4">
                                {stats.monthlyData.length > 0 ? stats.monthlyData.map((d, i) => {
                                    const maxVal = Math.max(...stats.monthlyData.map(m => m.total));
                                    const height = (d.total / maxVal) * 100;
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                                            <div className="absolute -top-8 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-indigo-600 text-white px-2 py-1 rounded shadow-lg">
                                                ${d.total.toLocaleString()}
                                            </div>
                                            <div
                                                style={{ height: `${height}%` }}
                                                className="w-full bg-indigo-50 rounded-t-lg group-hover:bg-indigo-600 transition-all duration-500 relative cursor-pointer"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 opacity-0 group-hover:opacity-100" />
                                            </div>
                                            <p className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-tighter">{monthNames[d._id.month - 1]}</p>
                                        </div>
                                    );
                                }) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-black italic">
                                        No recent disbursements
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Distribution Card */}
                        <div className="card-premium p-8">
                            <h3 className="text-xl font-black italic tracking-tighter">Portfolio Mix</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-10">Application Categories</p>

                            <div className="space-y-8">
                                {stats.typeDistribution.map((t, i) => {
                                    const total = stats.typeDistribution.reduce((acc, curr) => acc + curr.count, 0);
                                    const percentage = ((t.count / total) * 100).toFixed(0);
                                    const colors = ['indigo', 'emerald', 'amber', 'rose'];
                                    const color = colors[i % colors.length];

                                    return (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <p className="text-xs font-black uppercase tracking-widest text-gray-700">{t._id}</p>
                                                <p className="text-xs font-black text-indigo-600">{percentage}% ({t.count})</p>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    style={{ width: `${percentage}%` }}
                                                    className={`h-full bg-${color}-500 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-12 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-[10px] text-gray-400 font-black italic">Note: Analytics data is updated on every page load and reflects current platform state.</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : activeTab === 'loans' ? (
                <div className="card-premium p-0 overflow-hidden border-0 shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-900 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-5">Applicant Profile</th>
                                    <th className="px-8 py-5">Loan Details</th>
                                    <th className="px-8 py-5 text-center">Duration</th>
                                    <th className="px-8 py-5">Current Status</th>
                                    <th className="px-8 py-5 text-right">Review Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm bg-white">
                                {loans.map((loan) => (
                                    <tr key={loan._id} className="hover:bg-indigo-50/30 transition-colors duration-300">
                                        <td className="px-8 py-6">
                                            <div className="font-extrabold text-gray-900 truncate max-w-[150px]">{loan.userId?.name}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter truncate max-w-[150px]">{loan.userId?.email}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-black text-indigo-700 text-lg">${loan.amount.toLocaleString()}</span>
                                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase">{loan.loanType}</span>
                                            </div>
                                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Purpose: {loan.purpose}</div>
                                        </td>
                                        <td className="px-8 py-6 text-center font-black text-gray-500">{loan.tenure}M</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${loan.status === 'disbursed' ? 'bg-emerald-600 text-white' :
                                                loan.status === 'offered' ? 'bg-blue-600 text-white' :
                                                    loan.status === 'approved' ? 'bg-indigo-600 text-white' :
                                                        loan.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-amber-400 text-amber-900'
                                                }`}>
                                                {loan.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            {loan.status === 'pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => updateLoanStatus(loan._id, 'offered')} className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-sm">MAKE OFFER</button>
                                                    <button onClick={() => updateLoanStatus(loan._id, 'rejected')} className="h-10 w-10 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center shadow-sm"><FaTimesCircle size={14} /></button>
                                                </div>
                                            )}
                                            {loan.status === 'offered' && (
                                                <span className="text-[10px] font-black text-blue-400 uppercase italic">Awaiting Acceptance</span>
                                            )}
                                            {loan.status === 'approved' && (
                                                <button onClick={() => disburseLoan(loan._id)} className="btn-primary py-2 px-6 text-[10px] font-black shadow-lg shadow-indigo-200">
                                                    DISBURSE NOW
                                                </button>
                                            )}
                                            {loan.status === 'disbursed' && (
                                                <span className="text-[10px] font-black text-gray-300 uppercase italic">On Schedule</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {loans.length === 0 && (
                            <div className="p-20 text-center text-gray-300 font-black uppercase tracking-widest bg-white">
                                No loan records found.
                            </div>
                        )}
                    </div>
                </div>
            ) : activeTab === 'users' ? (
                <div className="card-premium p-0 overflow-hidden border-0 shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-900 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-5">User Profile</th>
                                    <th className="px-8 py-5">Contact & KYC</th>
                                    <th className="px-8 py-5 text-center">Credit Score</th>
                                    <th className="px-8 py-5">Income</th>
                                    <th className="px-8 py-5 text-right">Joined On</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm bg-white">
                                {allUsers.map((u) => (
                                    <tr key={u._id} className="hover:bg-indigo-50/30 transition-colors duration-300">
                                        <td className="px-8 py-6">
                                            <div className="font-extrabold text-gray-900">{u.name}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{u.email}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-gray-700 mb-1">{u.mobile || 'No Mobile'}</div>
                                            <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase ${u.kycStatus === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                KYC: {u.kycStatus}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <div className={`inline-block px-3 py-1 rounded-xl font-black text-white ${u.creditScore > 700 ? 'bg-emerald-500' : u.creditScore > 500 ? 'bg-amber-500' : 'bg-red-500'}`}>
                                                {u.creditScore || 0}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-black text-indigo-700">${u.income?.toLocaleString() || '0'}</span>
                                        </td>
                                        <td className="px-8 py-6 text-right font-medium text-gray-400">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="p-10 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                    {pendingKYCs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {pendingKYCs.map((u) => (
                                <div key={u._id} className="card-premium p-8 group hover:border-indigo-600 transition-all duration-500 border-2 bg-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 -rotate-12 translate-x-4 -translate-y-4">
                                        <FaHistory size={80} />
                                    </div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-200">
                                            {u.name[0]}
                                        </div>
                                        <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Awaiting Verification</span>
                                    </div>
                                    <div className="space-y-4 mb-8">
                                        <h3 className="font-black text-xl group-hover:text-indigo-600 transition-colors">{u.name}</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pb-1">DOB</p>
                                                <p className="font-bold text-sm text-gray-700">{u.dob ? new Date(u.dob).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pb-1">Mobile</p>
                                                <p className="font-bold text-sm text-gray-700">{u.mobile || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pb-1">Address</p>
                                            <p className="font-bold text-sm text-gray-700 line-clamp-1">{u.address || 'N/A'}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pb-1">Income</p>
                                                <p className="font-bold text-sm text-emerald-600">${u.income?.toLocaleString() || '0'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pb-1">Age</p>
                                                <p className="font-bold text-sm text-gray-700">{u.age || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-6 border-t border-gray-100 relative z-10">
                                        <button onClick={() => verifyKYC(u._id, 'approved')} className="flex-1 btn-primary py-3 text-[10px] font-black">APPROVE ID</button>
                                        <button onClick={() => verifyKYC(u._id, 'rejected')} className="flex-1 btn-secondary py-3 text-[10px] font-black border-red-100 text-red-600 hover:bg-red-50">REJECT</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 text-gray-300 bg-white rounded-3xl">
                            <FaCheckCircle className="mx-auto text-emerald-500/10 mb-6 animate-bounce" size={100} />
                            <p className="font-black text-xl uppercase tracking-widest">Queue Clear</p>
                            <p className="text-sm font-medium">All user profiles are currently verified.</p>
                        </div>
                    )}
                </div>
            )}
        </div >
    );
};

export default AdminDashboard;
