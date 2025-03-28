# Event Sync

Event Sync is a modern web application that helps users discover and manage events from various sources. The platform aggregates events from multiple APIs, provides social features for event interaction, and offers a personalized event management experience.

## Features

### Core Features

- Event Discovery and Search
- User Authentication and Profiles
- Social Interactions (Likes, Comments, Shares)
- Event Categories and Filtering
- Responsive Design and Dark Mode
- Real-time Event Status Updates

### Technical Features

- Next.js 14 with App Router
- MongoDB Integration
- Clerk Authentication
- Mantine UI Components
- Framer Motion Animations
- React Query for Data Management
- TypeScript for Type Safety

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- Clerk Account (for authentication)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
TICKETMASTER_API_KEY=your_ticketmaster_api_key
```

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/event-sync.git
cd event-sync
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable UI components
├── models/             # MongoDB models
├── lib/                # Utility functions and configurations
├── hooks/              # Custom React hooks
└── screens/            # Page-specific components
```

## Technical Implementation Details

### Authentication

- Implemented using Clerk for secure user authentication
- Protected routes and API endpoints
- User session management

### Database

- MongoDB for event and user data storage
- Optimized queries and indexes
- Real-time data synchronization

### API Integration

- Ticketmaster API for event data
- Scheduled updates for fresh content
- Rate limiting and error handling

### Performance Optimization

- React Query for efficient data fetching
- Image optimization
- Code splitting and lazy loading
- Caching strategies

## License

This project is licensed under the MIT License - see the LICENSE file for details.
