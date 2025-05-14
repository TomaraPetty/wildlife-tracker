# Wildlife Tracker Dashboard

A modern web application for tracking and monitoring wildlife herds, families, and their movements over time. Built with Next.js, TypeScript, and Tailwind CSS.

## Table of Contents

- [Features](#features)
- [Technical Specification](#technical-specification)
  - [Architecture](#architecture)
  - [Data Flow](#data-flow)
  - [Scalability](#scalability)
  - [Performance Considerations](#performance-considerations)
  - [Security](#security)
  - [Future Improvements](#future-improvements)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Development](#development)
  - [Project Structure](#project-structure)
  - [Key Components](#key-components)
  - [Running Tests](#running-tests)
  - [Building for Production](#building-for-production)
- [Docker Support](#docker-support)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- **Interactive Map View**: Visualize herd and family movements using Leaflet maps
- **Multi-view Dashboard**:
  - Herd Tracking: Monitor entire herds and their movements
  - Family Tracking: Track individual family units
  - Family Metrics: View detailed metrics for specific families
  - Location Events: Track events and families near specific locations
  - Ranger event entry submission form
- **Time-based Filtering**: Analyze data across custom time ranges
- **Event Tracking**: Monitor births, health issues, and migrations
- **Location History**: View historical movement patterns
- **Responsive Design**: Works on desktop and mobile devices
- ![Screenshot 2025-05-14 at 9 47 31 AM](https://github.com/user-attachments/assets/7743c90f-8bae-48d1-8c97-3b07475144a9)

  Wildlife herd and family tracking with points plotted on a map in a helpful easy to understand dashboard:
  ![Screenshot 2025-05-14 at 9 38 14 AM](https://github.com/user-attachments/assets/5cfcc6d9-2cb1-41e0-849d-368da038477a)

  Family metrics and health chart:
  ![Screenshot 2025-05-14 at 9 39 06 AM](https://github.com/user-attachments/assets/55452e8b-7274-4e86-ba11-439662d7e4c2)

  Ranger event entry form:
  ![Screenshot 2025-05-14 at 9 37 41 AM](https://github.com/user-attachments/assets/2651471c-7ae4-4537-85b7-3c9b7aa36fb2)

  Clickable pins to see data about the checkpoint:
  ![Screenshot 2025-05-14 at 9 39 53 AM](https://github.com/user-attachments/assets/cae9fcde-ca6d-4564-8289-bb42bc1872d7)

## Technical Specification

### Architecture

The application follows a modern client-server architecture with the following components:

1. **Frontend Layer**
   - Next.js App Router for server-side rendering and routing ✅
   - React components organized by feature ✅
   - Client-side state management using React Hooks ✅

2. **Data Layer**
   - In-memory data store (mock data) ✅
   - PostgreSQL for persistent storage (planned)
   - Redis for caching (planned)
   - Elasticsearch for geospatial queries (planned)

3. **API Layer**
   - RESTful endpoints for data operations ✅
   - GraphQL API for complex queries (planned)
   - Rate limiting and request validation (planned)
   - Auth0 authentication (planned)

### Data Flow

1. **Data Collection** (Planned)
   ```
   Ranger Input → API Endpoints → Data Validation → Storage
   ```

2. **Data Processing** (Planned)
   ```
   Raw Data → Aggregation → Analytics → Visualization
   ```

3. **Real-time Updates** (Planned)
   ```
   Event → WebSocket → Client → UI Update
   ```

### Scalability

1. **Horizontal Scaling** (Planned)
   - Stateless API design
   - Load balancing ready
   - Containerized deployment
   - Microservices architecture

2. **Data Scaling** (Planned)
   - Database sharding strategy
   - Caching layer implementation
   - CDN for static assets
   - Data partitioning by region

3. **Performance Scaling**
   - Edge caching (planned)
   - Lazy loading of map data ✅
   - Pagination of large datasets (planned)
   - Optimistic UI updates (planned)

### Performance Considerations

1. **Frontend Optimization**
   - Code splitting ✅
   - Dynamic imports ✅
   - Image optimization (planned)
   - Bundle size monitoring (planned)

2. **Backend Optimization** (Planned)
   - Query optimization
   - Connection pooling
   - Response compression
   - Caching strategies

3. **Map Performance**
   - Tile-based loading ✅
   - Clustering for dense data (planned)
   - Progressive loading ✅
   - Viewport-based filtering (planned)

### Security

1. **Authentication & Authorization** (Planned)
   - Role-based access control
   - JWT token management
   - Session handling
   - API key management

2. **Data Protection** (Planned)
   - Input sanitization
   - XSS prevention
   - CSRF protection
   - Rate limiting

3. **Infrastructure Security** (Planned)
   - HTTPS enforcement
   - Security headers
   - Regular security audits
   - Dependency scanning

### Future Improvements

1. **Short-term (1-3 months)**
   - Implement persistent storage
   - Add user authentication
   - Real-time updates
   - Mobile responsiveness

2. **Medium-term (3-6 months)**
   - Advanced analytics
   - Machine learning predictions
   - Mobile app development
   - API documentation

3. **Long-term (6-12 months)**
   - Microservices architecture
   - Multi-region deployment
   - Advanced visualization
   - Integration with external systems

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Maps**: Leaflet, react-leaflet
- **Charts**: Recharts
- **State Management**: React Hooks
- **Development**: Docker

## Getting Started

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd wildlife-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
# Using npm
npm run dev

# Using Docker
docker compose up
```

The application will be available at `http://localhost:3000`

## Development

### Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   └── ...          # Feature-specific components
├── lib/             # Utility functions and shared logic
└── types/           # TypeScript type definitions
```

### Key Components

- `Dashboard.tsx`: Main application interface
- `MapView.tsx`: Interactive map component
- `FamilyMetrics.tsx`: Family-specific metrics and charts
- `TimelineControl.tsx`: Time range selection component
- `EventsList.tsx`: List of events near selected locations

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
# Using npm
npm run build
npm start

# Using Docker
docker compose up --build
```

## Docker Support

The application includes Docker configuration for development:

```bash
# Start development server with hot reload
docker compose up --build

# Stop containers
docker compose down
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Leaflet](https://leafletjs.com/)
- [shadcn/ui](https://ui.shadcn.com/)
