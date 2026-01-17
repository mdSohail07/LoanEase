import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { FaBell, FaInfoCircle, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const NotificationPanel = () => {
    const socket = useSocket();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!socket) return;

        const handleLoanUpdate = (data) => {
            if (user.role === 'user' && data.userId === user._id) {
                addNotification(`Your loan application for $${data.amount.toLocaleString()} is now ${data.status.toUpperCase()}.`, 'loan');
            }
        };

        const handleKYCUpdate = (data) => {
            if (user.role === 'user' && data.userId === user._id) {
                addNotification(`Your KYC verification has been ${data.status.toUpperCase()}.`, 'kyc');
            }
        };

        const addNotification = (message, type) => {
            setNotifications(prev => [{
                id: Date.now(),
                message,
                type,
                timestamp: new Date()
            }, ...prev].slice(0, 5));
        };

        socket.on('loanStatusUpdate', handleLoanUpdate);
        socket.on('kycStatusUpdate', handleKYCUpdate);

        return () => {
            socket.off('loanStatusUpdate', handleLoanUpdate);
            socket.off('kycStatusUpdate', handleKYCUpdate);
        };
    }, [socket, user]);

    if (notifications.length === 0) return null;

    return (
        <div className="card-premium glass-dark p-6 mb-10 animate-float border-indigo-500/30">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                    <FaBell className="animate-swing" />
                </div>
                <h3 className="text-xl font-black italic tracking-tighter text-white">Live Updates</h3>
            </div>
            <div className="space-y-4">
                {notifications.map((notif) => (
                    <div key={notif.id} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                        <div className={`mt-1 text-lg ${notif.message.includes('APPROVED') || notif.message.includes('DISBURSED') ? 'text-emerald-400' : 'text-blue-400'}`}>
                            {notif.message.includes('APPROVED') || notif.message.includes('DISBURSED') ? <FaCheckCircle /> : <FaInfoCircle />}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-100 group-hover:text-white transition-colors">{notif.message}</p>
                            <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">
                                {new Date(notif.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationPanel;
