import React from 'react';

const MessageBox = ({ variant = 'info', children }) => {
    const baseClasses = 'p-4 rounded-md text-center';
    const variants = {
        info: 'bg-blue-100 text-blue-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
    };

    return <div className={`${baseClasses} ${variants[variant]}`}>{children}</div>;
};

export default MessageBox