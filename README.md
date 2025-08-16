AyurCare - Ayurvedic Doctor Consultation Platform
AyurCare is a full-stack web application designed to connect patients with Ayurvedic doctors. The platform provides a seamless experience for discovering doctors, viewing their availability, and booking appointments. This MVP (Minimum Viable Product) is built with a focus on modularity, scalability, and a clean user experience.

Core Features
User Authentication: Secure JWT-based authentication for patients.

Doctor Discovery: Users can search and browse doctor profiles.

Availability Calendar: View real-time available slots for each doctor.

Slot Booking System: Implements pessimistic locking for 5 minutes to prevent double bookings. The process includes a mock OTP confirmation step, and unconfirmed slots are automatically released.

Appointment Dashboard: Patients can view their upcoming and past appointments.

Reschedule/Cancel: Patients can cancel appointments up to 24 hours in advance.

Tech Stack
Frontend: React.js, React Router, Tailwind CSS, Axios

Backend: Node.js, Express.js

Database: PostgreSQL with Sequelize ORM

Auth: JSON Web Tokens (JWT)

Setup & Installation
To run this project locally, you need Node.js and PostgreSQL installed.

Backend Setup

Navigate to the backend directory.

Install dependencies: npm install

Create a .env file from the example and add your database credentials and JWT secret.

IMPORTANT: Create the ayurveda_db database in PostgreSQL.

Start the server: npm run dev

Frontend Setup

Navigate to the frontend directory in a new terminal.

Install dependencies: npm install

Start the React development server: npm start
