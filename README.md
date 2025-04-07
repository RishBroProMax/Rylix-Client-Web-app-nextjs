# Rylix Client Communication Web App

A modern web application for Rylix Solution to streamline communication with clients and manage project workflows.

## Introduction

The Rylix Client Communication Web App is a comprehensive platform designed to facilitate seamless communication between businesses and their clients. It provides a centralized hub for project management, file sharing, messaging, and meeting scheduling, all within a secure and user-friendly interface.

## Features

- **Authentication System**
  - Secure login and registration
  - Role-based access control (Admin/Client)
  - Password reset functionality
  - Session management

- **Project Management**
  - Create and manage projects
  - Track project status and progress
  - Set deadlines and milestones
  - Assign team members

- **Real-time Messaging**
  - Instant messaging between team members and clients
  - Message read status
  - Project-specific chat channels
  - File attachment support

- **File Sharing**
  - Secure file uploads and downloads
  - File preview functionality
  - Version control
  - Access control based on user roles

- **Meeting Scheduling**
  - Google Calendar integration
  - Meeting invitations
  - Video conferencing links
  - Attendance tracking

- **Task Management**
  - Create and assign tasks
  - Set due dates
  - Track task status
  - Task notifications

- **Notifications**
  - Real-time notifications
  - Email notifications (optional)
  - Notification center
  - Mark as read functionality

- **UI/UX**
  - Responsive design for all devices
  - Dark/light mode toggle
  - Modern, intuitive interface
  - Accessibility features

## Tech Stack

- **Frontend**
  - Next.js 13 (App Router)
  - TypeScript
  - Tailwind CSS
  - ShadCN UI Components
  - React Hooks

- **Backend**
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL
  - NextAuth.js
  - Server Actions

- **Storage & Real-time**
  - Supabase Storage
  - Supabase Realtime

- **Integrations**
  - Google Calendar API
  - Email Service (optional)

## Environment Variables

The application requires several environment variables to function properly. Create a `.env` file in the root directory with the following variables:

### Database Configuration

