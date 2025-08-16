import { Op } from 'sequelize';
import Doctor from '../models/Doctor.js';
import User from '../models/user.js';
import Availability from '../models/Availability.js';
import Appointment from '../models/Appointment.js';

// @desc    Get all doctors with filters
// @route   GET /api/doctors
// @access  Public
const getDoctors = async (req, res) => {
    const { specialization, mode, sortBy } = req.query;
    let whereClause = {};
    let includeClause = [{
        model: User,
        attributes: ['name', 'email']
    }];

    if (specialization) {
        whereClause.specialization = { [Op.iLike]: `%${specialization}%` };
    }
    if (mode) {
        whereClause.mode = { [Op.in]: [mode, 'both'] };
    }

    try {
        const doctors = await Doctor.findAll({
            where: whereClause,
            include: includeClause,
            // Sorting by availability is complex and better handled by a dedicated search service or a more complex query.
            // For MVP, we sort by creation date. A better approach is in SCALING.md.
            order: [['createdAt', 'DESC']]
        });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findByPk(req.params.id, {
            include: [{ model: User, attributes: ['name', 'email'] }]
        });
        if (doctor) {
            res.json(doctor);
        } else {
            res.status(404).json({ message: 'Doctor not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get available slots for a doctor
// @route   GET /api/doctors/:id/availability
// @access  Public
const getDoctorAvailability = async (req, res) => {
    const doctorId = req.params.id;
    const appointmentDuration = 30; // in minutes

    try {
        const doctorAvailabilities = await Availability.findAll({ where: { doctorId } });
        if (!doctorAvailabilities.length) {
            return res.status(404).json({ message: 'Doctor has not set up availability.' });
        }

        const bookedSlots = await Appointment.findAll({
            where: {
                doctorId,
                status: { [Op.in]: ['booked', 'locked'] },
                startTime: { [Op.gte]: new Date() }
            },
            attributes: ['startTime']
        });

        const bookedTimes = new Set(bookedSlots.map(slot => new Date(slot.startTime).getTime()));

        const availableSlots = [];
        const daysToScan = 14; // Scan for the next 14 days

        for (let i = 0; i < daysToScan; i++) {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + i);
            const dayOfWeek = currentDate.getDay();

            const dayAvailability = doctorAvailabilities.find(a => a.dayOfWeek === dayOfWeek);

            if (dayAvailability) {
                const [startHour, startMinute] = dayAvailability.startTime.split(':');
                const [endHour, endMinute] = dayAvailability.endTime.split(':');

                let slotTime = new Date(currentDate.setHours(startHour, startMinute, 0, 0));
                const endTime = new Date(currentDate.setHours(endHour, endMinute, 0, 0));

                while (slotTime < endTime) {
                    const isBooked = bookedTimes.has(slotTime.getTime());
                    const isPast = slotTime < new Date();

                    if (!isBooked && !isPast) {
                        availableSlots.push(new Date(slotTime));
                    }
                    slotTime.setMinutes(slotTime.getMinutes() + appointmentDuration);
                }
            }
        }

        res.json(availableSlots);

    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export { getDoctors, getDoctorById, getDoctorAvailability };