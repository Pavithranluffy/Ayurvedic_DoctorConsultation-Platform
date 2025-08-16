import { Op } from 'sequelize';
import Appointment from '../models/Appointment.js';
import Doctor from '../models/Doctor.js';
import User from '../models/user.js';
import sequelize from '../config/database.js';

const APPOINTMENT_DURATION_MINUTES = 30;
const SLOT_LOCK_MINUTES = 5;

// @desc    Lock an appointment slot
// @route   POST /api/appointments/lock
// @access  Private/Patient
const lockSlot = async (req, res) => {
    const { doctorId, startTime } = req.body;
    const patientId = req.user.id;

    if (!doctorId || !startTime) {
        return res.status(400).json({ message: 'Doctor ID and start time are required.' });
    }

    const t = await sequelize.transaction();

    try {
        // Clean up any expired locks for this user first
        await Appointment.destroy({
            where: {
                patientId,
                status: 'locked',
                lockExpiresAt: { [Op.lt]: new Date() }
            },
            transaction: t
        });

        const start = new Date(startTime);
        const end = new Date(start.getTime() + APPOINTMENT_DURATION_MINUTES * 60000);
        const lockExpires = new Date(Date.now() + SLOT_LOCK_MINUTES * 60000);

        // Attempt to create a locked appointment.
        // The unique index on (doctorId, startTime, status) will prevent duplicates.
        const [appointment, created] = await Appointment.findOrCreate({
            where: {
                doctorId,
                startTime,
                status: { [Op.in]: ['booked', 'locked'] }
            },
            defaults: {
                patientId,
                doctorId,
                startTime: start,
                endTime: end,
                status: 'locked',
                lockExpiresAt: lockExpires,
            },
            transaction: t
        });

        if (!created) {
            // If the slot was found but not created, it means it's already booked or locked by someone else.
            await t.rollback();
            return res.status(409).json({ message: 'Slot is not available. It may have just been booked.' });
        }

        await t.commit();
        res.status(201).json({
            message: 'Slot locked successfully. Please confirm within 5 minutes.',
            appointmentId: appointment.id,
            lockExpiresAt: lockExpires,
        });

    } catch (error) {
        await t.rollback();
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'This slot is already booked or locked.' });
        }
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Confirm a booking
// @route   POST /api/appointments/confirm
// @access  Private/Patient
const confirmBooking = async (req, res) => {
    const { appointmentId, otp } = req.body; // Mock OTP
    const patientId = req.user.id;

    // --- Mock OTP validation ---
    if (otp !== '123456') { // Hardcoded mock OTP
        return res.status(400).json({ message: 'Invalid OTP.' });
    }
    // --- End Mock OTP ---

    try {
        const appointment = await Appointment.findOne({
            where: {
                id: appointmentId,
                patientId,
                status: 'locked'
            }
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Locked appointment not found or you are not the owner.' });
        }

        if (new Date() > new Date(appointment.lockExpiresAt)) {
            // The lock has expired, so we should delete it.
            await appointment.destroy();
            return res.status(410).json({ message: 'Your lock on this slot has expired. Please try again.' });
        }

        // If lock is valid, confirm the booking
        appointment.status = 'booked';
        appointment.lockExpiresAt = null; // Remove expiry
        await appointment.save();

        res.status(200).json({ message: 'Appointment confirmed successfully!', appointment });

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private/Patient
const cancelAppointment = async (req, res) => {
    const { id } = req.params;
    const patientId = req.user.id;

    try {
        const appointment = await Appointment.findOne({ where: { id, patientId } });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        if (appointment.status === 'cancelled' || appointment.status === 'completed') {
            return res.status(400).json({ message: `Cannot cancel an already ${appointment.status} appointment.` });
        }

        // Check if cancellation is allowed (>24 hours before)
        const now = new Date();
        const appointmentTime = new Date(appointment.startTime);
        const hoursBefore = (appointmentTime - now) / (1000 * 60 * 60);

        if (hoursBefore <= 24) {
            return res.status(403).json({ message: 'Cannot cancel an appointment less than 24 hours in advance.' });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        res.status(200).json({ message: 'Appointment cancelled successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Reschedule an appointment (Simplified: Cancel and guide to re-book)
// @route   PUT /api/appointments/:id/reschedule
// @access  Private/Patient
const rescheduleAppointment = async (req, res) => {
    // A true reschedule involves finding a new slot and atomically updating.
    // For an MVP, it's simpler and safer to treat it as a cancellation followed by a new booking.
    const { id } = req.params;
    const patientId = req.user.id;

    try {
        const appointment = await Appointment.findOne({ where: { id, patientId } });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        const now = new Date();
        const appointmentTime = new Date(appointment.startTime);
        const hoursBefore = (appointmentTime - now) / (1000 * 60 * 60);

        if (hoursBefore <= 24) {
            return res.status(403).json({ message: 'Cannot reschedule an appointment less than 24 hours in advance.' });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        res.status(200).json({ message: 'Your appointment has been cancelled. Please book a new slot.' });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Get appointments for the logged-in user
// @route   GET /api/appointments/my
// @access  Private/Patient
const getMyAppointments = async (req, res) => {
    const { status } = req.query; // Filter by status
    const whereClause = { patientId: req.user.id };
    console.log('status query:', status);
     if (status?.trim() && ['booked', 'completed', 'cancelled', 'locked'].includes(status.trim())) {
        // Filter by given status
        whereClause.status = status.trim();
    }

    try {
        const appointments = await Appointment.findAll({
            where: whereClause,
            include: [
                {
                    model: Doctor,
                    as: 'Doctor',
                    include: {
                        model: User,
                        attributes: ['name', 'email']
                    }
                }
            ],
            order: [['startTime', 'DESC']]
        });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export {
    lockSlot,
    confirmBooking,
    cancelAppointment,
    rescheduleAppointment,
    getMyAppointments
};
