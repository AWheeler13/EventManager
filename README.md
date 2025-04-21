# University Events Management System

## Overview
This is a full-stack web application designed to help university students organize, discover, and participate in campus events. The system allows students to join or create Registered Student Organizations (RSOs), manage events, and interact with others through comments and ratings. The application features three user roles: Super Admin, Admin, and Student, each with different access levels.

## Tech Stack
- Frontend: React (JavaScript, HTML, CSS)
- Backend: Express JS
- Database: MySQL
- Server: AWS RDS

## Installation & Setup
### Prerequisites
- Install MySQL version 8.0 on your local
- Install Node.js and npm for React frontend.
- Run `npm install mysql2 express cors dotenv nodemon`

### Running the Backend Server
1. Navigate to the /backend folder
2. Add the backend .env file to the directory
3. Run the command `node server.js`

### Running the Frontend Server
1. Navigate to the /frontend folder
2. Add the frontend .env file to the directory
3. Run the command `npm run build` to build the directory
4. Run the command `npm start` to launch the application

## Features
### User Roles
- Super Admin: Creates university profiles, approves public events, and manages users.
- Admin: Owns an RSO, creates and manages events.
- Student: Views events, comments, rates events, and joins RSOs.

### Events
- Create, update, and manage events (public, private, or RSO-specific).
- Events include name, category, description, date, time, location, and contact info.
- Location selection via a map API (Google Maps, OpenStreetMap, or Bing Maps).

### User Management
- Secure authentication with user registration and login.
- RSO creation with at least 5 members sharing the same university domain.

### Social Features
- Commenting and rating events (1-5 stars).
- Integration with social media (Facebook, Google, etc.).

