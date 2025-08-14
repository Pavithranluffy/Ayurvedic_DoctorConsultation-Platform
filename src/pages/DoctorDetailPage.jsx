import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import MessageBox from '../components/MessageBox';
import { format } from 'date-fns';
import BookingModal from '../components/BookingModal';

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
                setError('Could not fetch doctor details.');
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
        <div>
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                <h1 className="text-4xl font-bold text-primary">{doctor.User.name}</h1>
                <p className="text-xl text-gray-700 mt-1">{doctor.specialization}</p>
                <p className="mt-4 text-gray-600">{doctor.bio}</p>
                <div className="mt-4">
                    <span className="font-bold">Mode:</span> {doctor.mode}
                </div>
                <div>
                    <span className="font-bold">Fee:</span> ${doctor.consultationFee}
                </div>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Available Slots</h2>
                {availability.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {availability.map((slot, index) => (
                            <button
                                key={index}
                                onClick={() => handleSlotSelect(slot)}
                                className="p-3 bg-light text-center rounded-md border border-gray-200 hover:bg-primary hover:text-white transition"
                            >
                                <p className="font-semibold">{format(new Date(slot), 'EEE, MMM d')}</p>
                                <p>{format(new Date(slot), 'h:mm a')}</p>
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