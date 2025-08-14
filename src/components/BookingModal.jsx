import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

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
            toast.error(error.response?.data?.message || 'Failed to lock slot.');
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
            toast.error(error.response?.data?.message || 'Failed to confirm booking.');
        } finally {
            setLoading(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Confirm Booking</h2>
                <p><strong>Doctor:</strong> {doctor.User.name}</p>
                <p><strong>Slot:</strong> {format(new Date(slot), 'EEE, MMM d, yyyy')} at {format(new Date(slot), 'h:mm a')}</p>
                <hr className="my-4" />

                {step === 1 && (
                    <div>
                        <p className="mb-4">You are about to book this slot. The slot will be locked for 5 minutes for you to confirm.</p>
                        <div className="flex justify-end space-x-4">
                            <button onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
                            <button onClick={handleLockSlot} disabled={loading} className="px-4 py-2 rounded-md bg-primary text-white">
                                {loading ? 'Locking...' : 'Lock Slot'}
                            </button>
                        </div>
                    </div>
                )}
                
                {step === 2 && (
                    <div>
                        <p className="mb-4">An OTP has been sent to your registered mobile number. (Hint: Use 123456 for this mock step)</p>
                        <div className="mb-4">
                            <label className="block text-gray-700">Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-3 py-2 border rounded-md"
                                placeholder="123456"
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button onClick={onClose} className="px-4 py-2 rounded-md border">Cancel</button>
                            <button onClick={handleConfirmBooking} disabled={loading} className="px-4 py-2 rounded-md bg-primary text-white">
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