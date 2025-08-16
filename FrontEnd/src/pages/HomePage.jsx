import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 sm:p-8">
            <div className="text-center w-full px-4 py-12 sm:py-20 md:py-24 bg-white dark:bg-gray-800 rounded-none shadow-none transition-all duration-300">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary-600 dark:text-primary-400 mb-4 sm:mb-6 leading-tight">
                    AyurCare: Your Gateway to Holistic Wellness
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 sm:mb-10 font-light">
                    Connect with experienced Ayurvedic doctors for personalized online and in-person consultations.
                </p>
                <Link
                    to="/doctors"
                    className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 px-8 sm:py-4 sm:px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                    Find Your Doctor
                </Link>
            </div>
        </div>
    );
};

export default HomePage;