import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';
import MessageBox from '../components/MessageBox';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { FaCalendarCheck, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
 // Import the new modal component

const AppointmentCard = ({ appointment, onCancel }) => {
    const isUpcoming = new Date(appointment.startTime) > new Date();
    const canCancel = isUpcoming && (new Date(appointment.startTime) - new Date()) / (1000 * 60 * 60) > 24;

    const statusClasses = {
        'booked': 'bg-blue-100 text-blue-800',
        'completed': 'bg-green-100 text-green-800',
        'cancelled': 'bg-red-100 text-red-800'
    };

    const statusIcon = {
        'booked': <FaHourglassHalf className="text-blue-500" />,
        'completed': <FaCheckCircle className="text-green-500" />,
        'cancelled': <FaTimesCircle className="text-red-500" />
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex items-center mb-4 sm:mb-0">
                    <img
                        src="https://placehold.co/80x80/285E61/FFFFFF?text=Dr"
                        alt={`Dr. ${appointment.Doctor.User.name}`}
                        className="w-12 h-12 rounded-full mr-4 border-2 border-primary-500"
                    />
                    <div>
                        <p className="font-bold text-lg text-gray-800 dark:text-gray-200">Dr. {appointment.Doctor.User.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.Doctor.specialization}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {statusIcon[appointment.status]}
                    <span className={`px-3 py-1 text-xs rounded-full capitalize font-semibold ${statusClasses[appointment.status]}`}>
                        {appointment.status}
                    </span>
                </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center text-gray-700 dark:text-gray-300">
                <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                    <FaCalendarCheck className="text-primary-500" />
                    <p>{format(new Date(appointment.startTime), 'EEE, MMM d, yyyy')}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FaClock className="text-primary-500" />
                    <p>{format(new Date(appointment.startTime), 'h:mm a')}</p>
                </div>
            </div>

            {appointment.status === 'booked' && canCancel && (
                <div className="text-right mt-4">
                    <button
                        onClick={() => onCancel(appointment.id)}
                        className="px-4 py-2 text-sm text-red-600 bg-red-100 rounded-lg font-medium hover:bg-red-200 transition-colors duration-300"
                    >
                        Cancel Appointment
                    </button>
                </div>
            )}
        </div>
    );
};

const DashboardPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/appointments/my?status=${filter}`);
            setAppointments(data);
        } catch (err) {
            setError('Could not fetch appointments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [filter]);

    const openCancelModal = (id) => {
        setAppointmentToCancel(id);
        setIsModalOpen(true);
    };

    const handleCancel = async () => {
        setIsModalOpen(false);
        try {
            await api.put(`/appointments/${appointmentToCancel}/cancel`);
            toast.success('Appointment cancelled successfully.');
            fetchAppointments(); // Refresh the list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to cancel appointment.');
        } finally {
            setAppointmentToCancel(null);
        }
    };

    const filterOptions = [
        { value: '', label: 'All' },
        { value: 'booked', label: 'Booked' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">My Appointments</h1>
            
            <div className="mb-8 flex flex-wrap gap-2">
                {filterOptions.map(option => (
                    <button
                        key={option.value}
                        onClick={() => setFilter(option.value)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300
                            ${filter === option.value
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-primary-100 dark:hover:bg-primary-800'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <Loader />
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : appointments.length > 0 ? (
                <div className="space-y-4">
                    {appointments.map(app => (
                        <AppointmentCard key={app.id} appointment={app} onCancel={openCancelModal} />
                    ))}
                </div>
            ) : (
                <MessageBox>You have no appointments.</MessageBox>
            )}

           
        </div>
    );
};

export default DashboardPage;