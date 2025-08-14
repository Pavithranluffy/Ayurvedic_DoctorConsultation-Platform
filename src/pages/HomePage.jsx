import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="text-center py-20">
            <h1 className="text-5xl font-bold mb-4">Welcome to AyurCare</h1>
            <p className="text-xl text-gray-600 mb-8">
                Connect with experienced Ayurvedic doctors for online and in-person consultations.
            </p>
            <Link
                to="/doctors"
                className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-transform transform hover:scale-105"
            >
                Find Your Doctor
            </Link>
        </div>
    );
};

export default HomePage;