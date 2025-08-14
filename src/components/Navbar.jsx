import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-primary">
                    AyurCare
                </Link>
                <div className="flex items-center space-x-4">
                    <Link to="/doctors" className="text-gray-600 hover:text-primary transition">Find a Doctor</Link>
                    {isAuthenticated ? (
                        <>
                            {user.role === 'patient' && (
                                <Link to="/dashboard" className="text-gray-600 hover:text-primary transition">My Appointments</Link>
                            )}
                            <button onClick={handleLogout} className="bg-accent text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-primary transition">Login</Link>
                            <Link to="/register" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;