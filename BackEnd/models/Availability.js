import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Doctor from './Doctor.js';

const Availability = sequelize.define('Availability', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    doctorId: {
        type: DataTypes.INTEGER,
        references: {
            model: Doctor,
            key: 'id'
        },
        allowNull: false
    },
    dayOfWeek: { // 0 for Sunday, 1 for Monday, etc.
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    startTime: { // e.g., '09:00:00'
        type: DataTypes.TIME,
        allowNull: false,
    },
    endTime: { // e.g., '17:00:00'
        type: DataTypes.TIME,
        allowNull: false,
    }
}, {
    timestamps: false,
});

Doctor.hasMany(Availability, { foreignKey: 'doctorId' });
Availability.belongsTo(Doctor, { foreignKey: 'doctorId' });

export default Availability;