import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaIdCard, FaMapMarkerAlt, FaPhone, FaCalendarAlt, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa';
const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const KYCVerification = () => {
    const { user, updateUserData } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        mobile: '',
        dob: '',
        address: '',
        income: 0,
        age: 0,
    });
    const [fileUploaded, setFileUploaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('not_submitted');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const { data } = await axios.get(`${API_URL}/api/auth/profile`, config);
                setFormData({
                    name: data.name,
                    mobile: data.mobile || '',
                    dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
                    address: data.address || '',
                    income: data.income || 0,
                    age: data.age || 0,
                });
                setStatus(data.kycStatus);
                updateUserData({ kycStatus: data.kycStatus });
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        if (user) fetchProfile();
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.put(`${API_URL}/api/auth/profile`, { ...formData, kycSubmitted: true }, config);
            setStatus('pending');
            updateUserData({ kycStatus: 'pending' });
            alert('KYC submitted successfully!');
        } catch (error) {
            alert('Failed to submit KYC');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'approved') {
        return (
            <div className="max-w-2xl mx-auto text-center py-20">
                <FaCheckCircle className="text-emerald-500 text-7xl mx-auto mb-6" />
                <h1 className="text-4xl font-bold mb-4">KYC Verified!</h1>
                <p className="text-gray-600 mb-8 text-lg">Your profile is fully verified. You can now apply for loans and access all features.</p>
                <button onClick={() => navigate('/user/loan-application')} className="btn-primary">Apply for a Loan</button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold mb-3">Profile & KYC</h1>
                <p className="text-gray-600">Complete your profile to unlock loan eligibility.</p>
                {status === 'pending' && (
                    <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-100 inline-block font-medium">
                        KYC status: Pending Verification
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                    <form onSubmit={handleSubmit} className="card-premium space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <FaIdCard className="text-gray-400" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    className="input-premium"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <FaPhone className="text-gray-400" /> Mobile Number
                                </label>
                                <input
                                    type="tel"
                                    className="input-premium"
                                    placeholder="+1 (555) 000-0000"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <FaCalendarAlt className="text-gray-400" /> Date of Birth
                                </label>
                                <input
                                    type="date"
                                    className="input-premium"
                                    value={formData.dob}
                                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <FaMapMarkerAlt className="text-gray-400" /> Current Address
                                </label>
                                <input
                                    type="text"
                                    className="input-premium"
                                    placeholder="123 Main St, City, Country"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <FaMoneyBillWave className="text-gray-400" /> Monthly Income ($)
                                </label>
                                <input
                                    type="number"
                                    className="input-premium"
                                    placeholder="5000"
                                    value={formData.income}
                                    onChange={(e) => setFormData({ ...formData, income: Number(e.target.value) })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                    <FaCalendarAlt className="text-gray-400" /> Age
                                </label>
                                <input
                                    type="number"
                                    className="input-premium"
                                    placeholder="25"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="font-semibold mb-4">Identity Verification</h3>
                            <div
                                onClick={() => setFileUploaded(true)}
                                className={`p-8 border-2 border-dashed rounded-2xl text-center transition-all cursor-pointer ${fileUploaded ? 'border-emerald-400 bg-emerald-50' : 'border-gray-200 hover:border-indigo-400 bg-gray-50/50'}`}
                            >
                                {fileUploaded ? (
                                    <>
                                        <FaCheckCircle className="text-emerald-500 text-3xl mx-auto mb-2" />
                                        <p className="text-emerald-700 font-bold uppercase text-[10px] tracking-widest">Document Uploaded Successfully</p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-gray-500 mb-2 font-medium">Click to upload Passport or Aadhaar Card</p>
                                        <p className="text-xs text-gray-400">PDF, JPG, PNG (Max 5MB)</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || status === 'pending' || !fileUploaded}
                            className="btn-primary w-full py-4 text-lg"
                        >
                            {loading ? 'Submitting...' : status === 'pending' ? 'KYC Under Review' : !fileUploaded ? 'Upload Document to Submit' : 'Submit for Verification'}
                        </button>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="card-premium bg-gradient-to-br from-indigo-900 to-blue-900 text-white border-0">
                        <h3 className="text-xl font-bold mb-4">Verification Tips</h3>
                        <ul className="space-y-4 text-sm text-indigo-100">
                            <li className="flex gap-3">
                                <span className="w-6 h-6 rounded-full bg-indigo-800 flex items-center justify-center text-xs flex-shrink-0">1</span>
                                Ensure your documents are clear and readable.
                            </li>
                            <li className="flex gap-3">
                                <span className="w-6 h-6 rounded-full bg-indigo-800 flex items-center justify-center text-xs flex-shrink-0">2</span>
                                Use your legal name as per your identity proof.
                            </li>
                            <li className="flex gap-3">
                                <span className="w-6 h-6 rounded-full bg-indigo-800 flex items-center justify-center text-xs flex-shrink-0">3</span>
                                Verification typically takes less than 24 hours.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KYCVerification;
