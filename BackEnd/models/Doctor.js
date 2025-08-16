import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './user.js';

const Doctor = sequelize.define('Doctor', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id',
        },
        allowNull: false,
    },
    specialization: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bio: {
        type: DataTypes.TEXT,
    },
    mode: {
        type: DataTypes.ENUM('online', 'in-person', 'both'),
        defaultValue: 'online',
    },
    consultationFee: {
        type: DataTypes.DECIMAL(10, 2),
    },
}, {
    timestamps: true,
});

// Associations
User.hasOne(Doctor, { foreignKey: 'userId' });
Doctor.belongsTo(User, { foreignKey: 'userId' });

export default Doctor;