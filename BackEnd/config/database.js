import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// This setup uses Sequelize, an ORM, to interact with PostgreSQL.
// It simplifies database operations and provides a layer of abstraction.
const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false, // Set to console.log to see SQL queries
        pool: {
            max: 5, // Max number of connections in pool
            min: 0, // Min number of connections in pool
            acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
            idle: 10000 // The maximum time, in milliseconds, that a connection can be idle before being released
        }
    }
);

export default sequelize;