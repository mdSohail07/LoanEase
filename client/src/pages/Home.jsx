import React from 'react';
import { Link } from 'react-router-dom';
import EMICalculator from '../components/EMICalculator';
import { FaShieldAlt, FaBolt, FaChartLine } from 'react-icons/fa';

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="pt-20 pb-32 px-4">
                <div className="container mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        Smart Loans for <br />
                        <span className="gradient-text">Brighter Futures</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                        Experience a seamless, secure, and fast way to get the financial help you need.
                        Join thousands of users who trust LoanEase.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/register" className="btn-primary">Get Started Now</Link>
                        <Link to="/login" className="btn-secondary">View Dashboard</Link>
                    </div>
                </div>
            </section>

            {/* Features & Calculator Grid */}
            <section className="py-20 bg-white/30 backdrop-blur-sm border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-bold mb-8">Why Choose LoanEase?</h2>

                            <div className="flex gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                    <FaShieldAlt size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Secure & KYC Verified</h3>
                                    <p className="text-gray-600">Your data is encrypted and protected with industry-standard security.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                    <FaBolt size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Instant Approval</h3>
                                    <p className="text-gray-600">Get your eligibility checked instantly based on your credit profile.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-4 rounded-2xl hover:bg-white hover:shadow-lg transition-all duration-300">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                                    <FaChartLine size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Flexible Repayments</h3>
                                    <p className="text-gray-600">Choose a tenure that fits your budget, from 3 to 36 months.</p>
                                </div>
                            </div>
                        </div>

                        <div className="animate-float">
                            <EMICalculator />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
