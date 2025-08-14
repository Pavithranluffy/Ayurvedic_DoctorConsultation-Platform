import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import MessageBox from '../components/MessageBox';

const DoctorCard = ({ doctor }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
        <h3 className="text-xl font-bold text-primary">{doctor.User.name}</h3>
        <p className="text-gray-600">{doctor.specialization}</p>
        <p className="mt-2 text-sm text-gray-500">{doctor.bio}</p>
        <div className="mt-4 flex justify-between items-center">
            <span className="text-lg font-semibold">${doctor.consultationFee}</span>
            <Link to={`/doctors/${doctor.id}`} className="bg-secondary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition">
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
                setError('Could not fetch doctors.');
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Find a Doctor</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctors.map(doctor => (
                        <DoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DoctorsListPage;