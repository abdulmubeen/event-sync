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

## Team Contributions

### Team Member 1 (Lead Developer)

**Role**: Lead Developer & Backend Architect
**Responsibilities**:

- Project architecture and setup
- Authentication system implementation
- Database design and integration
- API development and optimization
- Social features implementation
- Performance optimization
- Team coordination

**Features Completed**:

- User authentication with Clerk
- Social interactions system
- Event data fetching and caching
- API route optimization
- Database models and schemas
- Real-time event status updates

### Team Member 2

**Role**: Frontend Developer
**Responsibilities**:

- UI/UX design implementation
- Component development
- Responsive design
- Animation implementation

**Features Completed**:

- Landing page design
- Event card components
- Navigation and header
- Responsive layouts
- Dark mode implementation

### Team Member 3

**Role**: Frontend Developer
**Responsibilities**:

- Dashboard development
- Search and filtering
- User profile pages
- Event management features

**Features Completed**:

- Dashboard layout
- Event search functionality
- Category filtering
- User profile pages
- Event management interface

### Team Member 4

**Role**: Backend Developer
**Responsibilities**:

- API integration
- Data processing
- Event synchronization
- Error handling

**Features Completed**:

- Ticketmaster API integration
- Event data processing
- Scheduled data updates
- Error handling system
- API response optimization

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
