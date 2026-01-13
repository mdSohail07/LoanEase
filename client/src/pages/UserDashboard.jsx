import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import NotificationPanel from '../components/NotificationPanel';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
    const [loans, setLoans] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
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

        if (user) {
            fetchLoans();
        }
    }, [user]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">My Loans</h2>
                        <Link to="/user/loan-application" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Apply for Loan</Link>
                    </div>
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {loans.length === 0 ? (
                            <p className="p-4 text-gray-500">No active loans found.</p>
                        ) : (
                            <table className="min-w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenure</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loans.map((loan) => (
                                        <tr key={loan._id}>
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
                                            <td className="px-6 py-4 whitespace-nowrap">{new Date(loan.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4">Notifications</h2>
                    <NotificationPanel />
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
