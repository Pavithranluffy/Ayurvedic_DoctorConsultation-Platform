import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';
import MessageBox from '../components/MessageBox';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const AppointmentCard = ({ appointment, onCancel }) => {
    const isUpcoming = new Date(appointment.startTime) > new Date();
    const canCancel = isUpcoming && (new Date(appointment.startTime) - new Date()) / (1000 * 60 * 60) > 24;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-bold text-lg">Dr. {appointment.Doctor.User.name}</p>
                    <p className="text-gray-600">{appointment.Doctor.specialization}</p>
                    <p className="mt-2">{format(new Date(appointment.startTime), 'EEE, MMM d, yyyy')} at {format(new Date(appointment.startTime), 'h:mm a')}</p>
                </div>
                <span className={`px-3 py-1 text-sm rounded-full capitalize ${
                    appointment.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                    appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                }`}>
                    {appointment.status}
                </span>
            </div>
            {appointment.status === 'booked' && canCancel && (
                 <div className="text-right mt-4">
                    <button onClick={() => onCancel(appointment.id)} className="text-sm text-red-600 hover:underline">
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const handleCancel = async (id) => {
        if(window.confirm('Are you sure you want to cancel this appointment?')){
            try {
                await api.put(`/appointments/${id}/cancel`);
                toast.success('Appointment cancelled successfully.');
                fetchAppointments(); // Refresh the list
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to cancel appointment.');
            }
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">My Appointments</h1>
            <div className="mb-4">
                <select onChange={(e) => setFilter(e.target.value)} value={filter} className="p-2 border rounded-md">
                    <option value="">All</option>
                    <option value="booked">Booked</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
            {loading ? (
                <Loader />
            ) : error ? (
                <MessageBox variant="danger">{error}</MessageBox>
            ) : appointments.length > 0 ? (
                <div className="space-y-4">
                    {appointments.map(app => (
                        <AppointmentCard key={app.id} appointment={app} onCancel={handleCancel} />
                    ))}
                </div>
            ) : (
                <MessageBox>You have no appointments.</MessageBox>
            )}
        </div>
    );
};

export default DashboardPage;
