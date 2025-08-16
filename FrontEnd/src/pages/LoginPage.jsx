import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data.token);
            toast.success('Logged in successfully!');
            navigate('/dashboard');
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
            <div className="w-full max-w-sm p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transition-all duration-300 transform scale-95 hover:scale-100">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-primary-100 dark:bg-primary-900 rounded-full">
                        <FaSignInAlt className="text-3xl text-primary-600 dark:text-primary-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-600 dark:text-gray-400">Log in to your AyurCare account</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2" htmlFor="email">Email</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <FaUser />
                            </span>
                            <input
                                id="email"
                                type="email"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2" htmlFor="password">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <FaLock />
                            </span>
                            <input
                                id="password"
                                type="password"
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-primary-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-primary-700 transition-all duration-300 transform hover:-translate-y-1 disabled:bg-gray-400 disabled:shadow-none disabled:transform-none"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Logging in...</span>
                            </div>
                        ) : 'Login'}
                    </button>
                </form>
                 <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
                    New user? <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;