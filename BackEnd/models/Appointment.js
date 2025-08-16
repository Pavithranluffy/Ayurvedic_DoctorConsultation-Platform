import { DataTypes, Op } from 'sequelize';
import sequelize from '../config/database.js';
import User from './user.js';
import Doctor from './Doctor.js';

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    patientId: {
        type: DataTypes.INTEGER,
        references: { model: User, key: 'id' },
        allowNull: false,
    },
    doctorId: {
        type: DataTypes.INTEGER,
        references: { model: Doctor, key: 'id' },
        allowNull: false,
    },
    startTime: {
        type: DataTypes.DATE, // Full timestamp, e.g., 2025-09-15 10:00:00
        allowNull: false,
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('booked', 'completed', 'cancelled', 'locked'),
        defaultValue: 'locked',
        allowNull: false,
    },
    lockExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true, // Only for 'locked' status
    }
}, {
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['doctorId', 'startTime'],
            where: {
                status: {
                    [Op.in]: ['booked', 'locked']
                }
            },
            name: 'unique_active_appointment'
        }
    ]
});

// Associations
Appointment.belongsTo(User, { as: 'Patient', foreignKey: 'patientId' });
Appointment.belongsTo(Doctor, { as: 'Doctor', foreignKey: 'doctorId' });

export default Appointment;