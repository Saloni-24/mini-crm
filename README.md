Mini CRM - Campaign Management Application
This project is a basic Customer Relationship Management (CRM) application. It allows users to create and manage marketing campaigns by setting specific rules and targeting customers accordingly. The system supports user authentication, campaign creation, and simulated message delivery.

This application is built using the MERN stack: MongoDB, Express.js, React.js, and Node.js.

Key Features
User registration and login using password hashing and JWT tokens

Google OAuth login option

Campaign creation with dynamic rules such as "spend greater than 100" or "visits less than 5"

Preview option before sending campaigns

Simulated message sending to show how campaigns would work

View reports showing the number of messages sent and failed

Technology Stack
Frontend: React.js
Backend: Node.js and Express.js
Database: MongoDB with Mongoose
Authentication: JWT and Google OAuth 2.0
API Testing: Postman

Project Folder Structure
The project is divided into two main folders:

mini-crm/
|
|-- backend/
| |-- controllers/
| |-- data/
| |-- routes/
| |-- .env
| |-- index.js
|
|-- frontend/
|-- src/
| |-- components/
| |-- pages/
| |-- App.js

Running the Project Locally
Clone the project

git clone https://github.com/Saloni24/mini-crm.git
cd mini-crm

Start the backend

cd backend
npm install
node index.js

Start the frontend

cd frontend
npm install
npm start

Backend Environment Variables
Create a file named .env inside the backend folder and add the following:

MONGO_URI=mongodb+srv://saloniduggal24:SaloniMongo2025!@cluster0.3bsxjed.mongodb.net/miniCRM?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=yourSuperSecretKey123
GOOGLE_CLIENT_ID=1056083452714-ngbiuq08o73dilcp7ku6ib2j6fb2naac.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
