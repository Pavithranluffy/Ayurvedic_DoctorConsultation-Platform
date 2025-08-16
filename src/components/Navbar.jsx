import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Common link styles
    const linkClasses = "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300";
    const buttonClasses = "bg-primary-500 hover:bg-primary-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-colors duration-300 transform hover:scale-105";

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo and Mobile Menu Button */}
                <div className="flex items-center justify-between w-full md:w-auto">
                    <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        AyurCare
                    </Link>
                    <button 
                        onClick={toggleMenu} 
                        className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none"
                        aria-label="Toggle navigation menu"
                    >
                        {isMenuOpen ? (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        ) : (
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                            </svg>
                        )}
                    </button>
                </div>

                {/* Desktop and Mobile Menu Links */}
                <div 
                    className={`flex-grow md:flex md:items-center md:space-x-8 md:justify-end ${isMenuOpen ? 'flex flex-col items-start space-y-4 py-4 w-full' : 'hidden'}`}
                >
                    <Link to="/doctors" className={linkClasses} onClick={isMenuOpen ? toggleMenu : null}>Find a Doctor</Link>
                    
                    {isAuthenticated ? (
                        <>
                            {user.role === 'patient' && (
                                <Link to="/dashboard" className={linkClasses} onClick={isMenuOpen ? toggleMenu : null}>My Appointments</Link>
                            )}
                            <button onClick={handleLogout} className={buttonClasses}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={linkClasses} onClick={isMenuOpen ? toggleMenu : null}>Login</Link>
                            <Link to="/register" className={buttonClasses} onClick={isMenuOpen ? toggleMenu : null}>
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