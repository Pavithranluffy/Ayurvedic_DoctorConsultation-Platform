import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/database.js';

// Import all models to ensure they are registered with Sequelize
import './models/user.js';
import './models/Doctor.js';
import './models/Availability.js';
import './models/Appointment.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.get('/', (req, res) => {
    res.send('Ayurvedic Consultation Platform API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);


// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Authenticate and sync the database
const startServer = async () => {
    try {
        await db.authenticate();
        console.log('Database connected successfully.');

        // Sync all models with the database.
        // alter: true ensures that the tables match the models, making non-destructive changes.
        // In a production environment, you would use a dedicated migration library.
        await db.sync({ alter: true });
        console.log('Database synced successfully.');

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to or sync the database:', error);
    }
};

startServer();