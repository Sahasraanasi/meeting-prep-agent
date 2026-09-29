# Backend - Meeting Prep Agent

## Overview

The backend provides APIs for authentication, profile management, contact management, meeting management, and AI-powered meeting summarization.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Groq SDK

## API Modules

### Authentication

- User Signup
- User Login
- Session Validation

### Profile

- Create Profile
- Update Profile
- Retrieve Profile

### Contacts

- Create Contact
- Update Contact
- Delete Contact
- Retrieve Contacts

### Meetings

- Create Meeting
- Update Meeting
- Delete Meeting
- Retrieve Meetings

### AI Services

- Generate Meeting Summary
- AI-powered Meeting Assistance

## Running Backend

### Install Dependencies

```bash
npm install
```

### Start Server

```bash
npm start
```

Default:

```text
http://localhost:5000
```

## Environment Variables

Create a .env file containing:

```env
PORT=5000
GROQ_API_KEY=your_api_key
JWT_SECRET=your_secret
```

## Features

- REST API Architecture
- MongoDB Integration
- JWT Authentication
- Groq AI Integration
- Secure Route Handling