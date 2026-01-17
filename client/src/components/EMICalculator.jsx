import React, { useState, useEffect } from 'react';

const EMICalculator = () => {
    const [amount, setAmount] = useState(10000);
    const [tenure, setTenure] = useState(12);
    const [rate, setRate] = useState(10);
    const [emi, setEmi] = useState(0);

    useEffect(() => {
        calculateEMI();
    }, [amount, tenure, rate]);

    const calculateEMI = () => {
        const r = (rate / 100) / 12;
        const n = tenure;
        const emiVal = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        setEmi(emiVal.toFixed(2));
    };

    return (
        <div className="card-premium glass max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 gradient-text">EMI Calculator</h2>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount: ${amount}</label>
                    <input
                        type="range"
                        min="1000"
                        max="100000"
                        step="1000"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tenure: {tenure} Months</label>
                    <input
                        type="range"
                        min="3"
                        max="36"
                        step="1"
                        value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate: {rate}%</label>
                    <input
                        type="range"
                        min="5"
                        max="25"
                        step="0.5"
                        value={rate}
                        onChange={(e) => setRate(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                </div>

                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 mt-8">
                    <p className="text-sm text-indigo-600 font-medium">Monthly EMI</p>
                    <p className="text-3xl font-bold text-indigo-900">${emi}</p>
                </div>
            </div>
        </div>
    );
};

export default EMICalculator;
