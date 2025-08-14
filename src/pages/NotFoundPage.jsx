import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="text-center py-20">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <h2 className="text-3xl font-semibold mt-4 mb-2">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
                Sorry, the page you are looking for does not exist.
            </p>
            <Link
                to="/"
                className="bg-primary text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90"
            >
                Go to Homepage
            </Link>
        </div>
    );
};

export default NotFoundPage;
