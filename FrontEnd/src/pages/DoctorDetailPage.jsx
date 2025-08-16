import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import MessageBox from '../components/MessageBox';
import { format } from 'date-fns';
import BookingModal from '../components/BookingModal';
import { FaUserMd, FaStethoscope, FaDollarSign, FaCalendarAlt, FaStar } from 'react-icons/fa';

const DoctorDetailPage = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            setLoading(true);
            try {
                const doctorRes = await api.get(`/doctors/${id}`);
                setDoctor(doctorRes.data);

                const availabilityRes = await api.get(`/doctors/${id}/availability`);
                setAvailability(availabilityRes.data);
            } catch (err) {
                setError('Could not fetch doctor details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchDoctorDetails();
    }, [id]);

    const handleSlotSelect = (slot) => {
        setSelectedSlot(slot);
        setIsModalOpen(true);
    };

    if (loading) return <Loader />;
    if (error) return <MessageBox variant="danger">{error}</MessageBox>;
    if (!doctor) return <MessageBox>Doctor not found.</MessageBox>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-8 transform transition-all duration-300 hover:scale-[1.01]">
                <div className="p-6 md:p-8 flex flex-col md:flex-row items-center">
                    {/* Doctor Image and Info */}
                    <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
                        {/* Placeholder for doctor's image */}
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                            <FaUserMd className="text-6xl text-gray-500 dark:text-gray-400" />
                        </div>
                    </div>
                    
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl sm:text-4xl font-bold text-primary-600 dark:text-primary-400">Dr. {doctor.User.name}</h1>
                        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mt-1">{doctor.specialization}</p>
                        <p className="mt-4 text-gray-700 dark:text-gray-400 max-w-2xl">{doctor.bio}</p>
                        
                        <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-center md:justify-start">
                                <FaStethoscope className="text-lg text-gray-500 mr-2" />
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Mode:</span> <span className="ml-2 text-gray-600 dark:text-gray-400">{doctor.mode}</span>
                            </div>
                            <div className="flex items-center justify-center md:justify-start">
                                <FaDollarSign className="text-lg text-gray-500 mr-2" />
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Fee:</span> <span className="ml-2 text-gray-600 dark:text-gray-400">${doctor.consultationFee}</span>
                            </div>
                            {/* You can add more info here, like ratings or years of experience */}
                            <div className="flex items-center justify-center md:justify-start">
                                <FaStar className="text-lg text-yellow-500 mr-2" />
                                <span className="font-semibold text-gray-700 dark:text-gray-300">Rating:</span> <span className="ml-2 text-gray-600 dark:text-gray-400">4.8/5 (120 reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200 flex items-center">
                    <FaCalendarAlt className="mr-2 text-primary-600 dark:text-primary-400" />
                    Available Slots
                </h2>
                {availability.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {availability.map((slot, index) => (
                            <button
                                key={index}
                                onClick={() => handleSlotSelect(slot)}
                                className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-transparent text-center hover:border-primary-500 hover:bg-primary-500 hover:text-white transition-all duration-300 shadow-sm transform hover:-translate-y-1"
                            >
                                <p className="font-semibold text-sm sm:text-base">{format(new Date(slot), 'EEE, MMM d')}</p>
                                <p className="text-xs sm:text-sm mt-1">{format(new Date(slot), 'h:mm a')}</p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <MessageBox>No available slots in the next 14 days.</MessageBox>
                )}
            </div>
            
            {isModalOpen && (
                <BookingModal
                    doctor={doctor}
                    slot={selectedSlot}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default DoctorDetailPage;