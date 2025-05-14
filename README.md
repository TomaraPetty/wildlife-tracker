# Wildlife Tracker Dashboard

A modern web application for tracking and monitoring wildlife herds, families, and their movements over time. Built with Next.js, TypeScript, and Tailwind CSS.

## Table of Contents

- [Features](#features)
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
- **Time-based Filtering**: Analyze data across custom time ranges
- **Event Tracking**: Monitor births, health issues, and migrations
- **Location History**: View historical movement patterns
- **Responsive Design**: Works on desktop and mobile devices

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
