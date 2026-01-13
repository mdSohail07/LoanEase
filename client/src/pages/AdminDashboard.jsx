import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const [loans, setLoans] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        fetchLoans();
    }, [user]);

    const fetchLoans = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get('http://localhost:5001/api/loans', config);
            setLoans(data);
        } catch (error) {
            console.error('Error fetching loans:', error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            await axios.put(`http://localhost:5001/api/loans/${id}`, { status }, config);
            fetchLoans(); // Refresh list
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenure</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loans.map((loan) => (
                            <tr key={loan._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{loan.userId?.name}</div>
                                    <div className="text-sm text-gray-500">{loan.userId?.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">${loan.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{loan.tenure} months</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${loan.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            loan.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}>
                                        {loan.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    {loan.status === 'pending' && (
                                        <>
                                            <button onClick={() => updateStatus(loan._id, 'approved')} className="text-green-600 hover:text-green-900">Approve</button>
                                            <button onClick={() => updateStatus(loan._id, 'rejected')} className="text-red-600 hover:text-red-900">Reject</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
