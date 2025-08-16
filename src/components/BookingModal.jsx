import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { FaUserMd, FaCalendarCheck, FaClock, FaCheckCircle } from 'react-icons/fa';

const BookingModal = ({ doctor, slot, onClose }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Lock, 2: Confirm OTP
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [appointmentId, setAppointmentId] = useState(null);

    const handleLockSlot = async () => {
        if (!isAuthenticated) {
            toast.error('You must be logged in to book an appointment.');
            navigate('/login');
            return;
        }
        setLoading(true);
        try {
            const { data } = await api.post('/appointments/lock', {
                doctorId: doctor.id,
                startTime: slot,
            });
            setAppointmentId(data.appointmentId);
            toast.success(data.message);
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to lock slot. Please try again.');
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmBooking = async () => {
        setLoading(true);
        try {
            await api.post('/appointments/confirm', {
                appointmentId,
                otp,
            });
            toast.success('Appointment confirmed successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to confirm booking. Please try again.');
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 opacity-100">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Confirm Booking</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Appointment Details Section */}
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Appointment Details</h3>
                    <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 mb-2">
                        <FaUserMd className="text-primary-500" />
                        <span className="font-medium">Doctor:</span>
                        <span className="ml-1">{doctor.User.name}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                        <FaCalendarCheck className="text-primary-500" />
                        <span className="font-medium">Date:</span>
                        <span className="ml-1">{format(new Date(slot), 'EEE, MMM d, yyyy')}</span>
                        <FaClock className="text-primary-500 ml-4" />
                        <span className="font-medium">Time:</span>
                        <span className="ml-1">{format(new Date(slot), 'h:mm a')}</span>
                    </div>
                </div>

                {/* Step 1: Lock Slot */}
                {step === 1 && (
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700">
                        <p className="text-blue-700 dark:text-blue-300 font-medium mb-4">
                            <span className="inline-flex items-center space-x-2"><FaCheckCircle className="text-blue-500" /> This slot is available.</span>
                            <br />
                            Confirm to temporarily lock the slot for 5 minutes.
                        </p>
                        <div className="flex justify-end space-x-3 mt-4">
                            <button onClick={onClose} className="px-5 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleLockSlot} disabled={loading} className="px-5 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors disabled:bg-gray-400">
                                {loading ? 'Locking...' : 'Lock Slot'}
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Step 2: Confirm OTP */}
                {step === 2 && (
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700">
                        <p className="text-green-700 dark:text-green-300 font-medium mb-4">
                            A confirmation code has been sent to your registered mobile number.
                        </p>
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2" htmlFor="otp">Enter OTP</label>
                            <input
                                id="otp"
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="e.g., 123456"
                            />
                        </div>
                        <div className="flex justify-end space-x-3 mt-4">
                            <button onClick={onClose} className="px-5 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleConfirmBooking} disabled={loading} className="px-5 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors disabled:bg-gray-400">
                                {loading ? 'Confirming...' : 'Confirm Booking'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingModal;