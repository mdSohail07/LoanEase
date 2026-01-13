import React, { useState, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const NotificationPanel = () => {
    const socket = useSocket();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!socket) return;

        socket.on('loanStatusUpdate', (data) => {
            // Only show notification if it belongs to the logged-in user
            // Also admin might want to see all? user requirement says "user dashboard"
            if (user.role === 'user' && data.userId === user._id) {
                setNotifications(prev => [{
                    id: Date.now(),
                    message: `Your loan of ${data.amount} is now ${data.status}.`,
                    timestamp: new Date()
                }, ...prev].slice(0, 5));
            }
        });

        return () => {
            socket.off('loanStatusUpdate');
        };
    }, [socket, user]);

    if (notifications.length === 0) return null;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-2">Recent Notifications</h3>
            <ul className="space-y-2">
                {notifications.map((notif) => (
                    <li key={notif.id} className="p-2 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded">
                        <p className="font-medium">{notif.message}</p>
                        <p className="text-xs text-gray-500">{notif.timestamp.toLocaleTimeString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationPanel;
