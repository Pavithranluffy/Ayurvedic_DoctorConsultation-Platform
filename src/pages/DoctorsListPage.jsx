import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import MessageBox from '../components/MessageBox';
import { FaUserMd, FaStethoscope, FaDollarSign, FaStar } from 'react-icons/fa';

const DoctorCard = ({ doctor }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="flex flex-col sm:flex-row items-center mb-4 space-x-0 sm:space-x-4">
            <div className="flex-shrink-0 w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 sm:mb-0">
                <FaUserMd className="text-4xl text-gray-500 dark:text-gray-400" />
            </div>
            <div className="text-center sm:text-left">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{doctor.User.name}</h3>
                <div className="flex items-center justify-center sm:justify-start mt-1">
                    <FaStethoscope className="text-sm text-primary-500 mr-2" />
                    <p className="text-gray-600 dark:text-gray-400">{doctor.specialization}</p>
                </div>
            </div>
        </div>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {doctor.bio}
        </p>
        <div className="mt-4 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <FaDollarSign className="text-lg text-green-500" />
                    <span className="ml-2 text-lg font-semibold text-gray-800 dark:text-white">${doctor.consultationFee}</span>
                </div>
                <div className="flex items-center text-yellow-500">
                    <FaStar className="text-sm mr-1" />
                    <FaStar className="text-sm mr-1" />
                    <FaStar className="text-sm mr-1" />
                    <FaStar className="text-sm mr-1" />
                    <FaStar className="text-sm" />
                </div>
            </div>
        </div>
        <div className="mt-6 text-center">
            <Link 
                to={`/doctors/${doctor.id}`} 
                className="inline-block w-full bg-primary-600 text-white font-medium py-3 px-6 rounded-full shadow-md hover:bg-primary-700 transition-colors duration-300"
            >
                View Profile
            </Link>
        </div>
    </div>
);


const DoctorsListPage = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const { data } = await api.get('/doctors');
                setDoctors(data);
            } catch (err) {
                setError('Could not fetch doctors. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">Find a Doctor</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Browse our list of experienced Ayurvedic doctors and book a consultation.
                </p>
            </div>
            
            {loading ? (
                <Loader />
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {doctors.map(doctor => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DoctorsListPage;