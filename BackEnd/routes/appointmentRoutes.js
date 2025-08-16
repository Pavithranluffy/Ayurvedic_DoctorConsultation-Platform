import express from 'express';
import {
    lockSlot,
    confirmBooking,
    cancelAppointment,
    rescheduleAppointment,
    getMyAppointments
} from '../controllers/appointmentController.js';
import { protect, isPatient } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my', protect, isPatient, getMyAppointments);
router.post('/lock', protect, isPatient, lockSlot);
router.post('/confirm', protect, isPatient, confirmBooking);
router.put('/:id/cancel', protect, isPatient, cancelAppointment);
router.put('/:id/reschedule', protect, isPatient, rescheduleAppointment);

export default router;