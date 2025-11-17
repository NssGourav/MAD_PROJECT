# MongoDB Setup Guide

## Prerequisites

1. Install MongoDB locally or use MongoDB Atlas (cloud)

### Local MongoDB Installation

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
# Follow instructions at https://www.mongodb.com/docs/manual/installation/
```

**Windows:**
Download and install from https://www.mongodb.com/try/download/community

### MongoDB Atlas (Cloud)

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string

## Configuration

1. Create a `.env` file in the `server` directory:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/shuttle_tracker
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shuttle_tracker?retryWrites=true&w=majority
```

2. Replace `username` and `password` with your Atlas credentials

## Running the Server

```bash
cd server
npm install
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## Database Models

The application uses three main models:

1. **User** - Stores user authentication data (passwords are hashed with bcrypt)
2. **Route** - Stores shuttle routes with stops
3. **Shuttle** - Stores shuttle location and status data

## Default Data

On first run, the server will automatically create:
- A default route called "Main Loop" with 3 stops
- A default shuttle "Shuttle 101" assigned to the Main Loop route

