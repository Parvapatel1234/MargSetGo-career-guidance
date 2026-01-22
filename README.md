# MargSetGo

MargSetGo is a career-guidance platform that connects college juniors with verified seniors to provide genuine mentorship.

## Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Lucide React
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Authentication**: JWT

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running locally

### Installation

1. **Clone the repository** (if applicable)

2. **Install Dependencies**

   ```bash
   # Client
   cd client
   npm install

   # Server
   cd ../server
   npm install
   ```

3. **Environment Setup**

   - The `server` comes with a `.env` file pre-configured for local development.
   - `MONGO_URI=mongodb://localhost:27017/margsetgo`
   - `JWT_SECRET=supersecretkey`

### Running the Application

1. **Start the Backend**

   ```bash
   cd server
   npm run start
   # or for development
   npm run dev
   ```

2. **Start the Frontend**

   Open a new terminal:
   ```bash
   cd client
   npm run dev
   ```

3. **Access the App**

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Role-based Auth**: Sign up as Junior or Senior.
- **Junior Dashboard**: Find seniors by college, department, or domain.
- **Senior Dashboard**: Manage profile and view mentorship requests.
- **Security**: Password hashing (bcrypt) and JWT authentication.
