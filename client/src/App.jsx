import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoanApplication from './pages/LoanApplication';

const PrivateRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    // Wait for loading to finish just in case, though we handle loading in AuthProvider
    if (loading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" />; // Or unauthorized page
    }

    return children;
};

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Navbar />
            <main>{children}</main>
        </div>
    )
}

function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            <Route
                                path="/user/dashboard"
                                element={
                                    <PrivateRoute roles={['user']}>
                                        <UserDashboard />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/user/loan-application"
                                element={
                                    <PrivateRoute roles={['user']}>
                                        <LoanApplication />
                                    </PrivateRoute>
                                }
                            />

                            <Route
                                path="/admin/dashboard"
                                element={
                                    <PrivateRoute roles={['admin']}>
                                        <AdminDashboard />
                                    </PrivateRoute>
                                }
                            />

                            <Route path="/" element={<Navigate to="/login" />} />
                        </Routes>
                    </Layout>
                </Router>
            </SocketProvider>
        </AuthProvider>
    );
}

export default App;
