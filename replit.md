# Visual Effects Tester

## Overview

This is a professional visual effects testing application designed for validating JavaScript-based VFX for commercial marketplaces like CodeCanyon and MotionElements. The application provides a comprehensive testing environment with real-time performance monitoring, parameter control, and quality assessment tools for visual effects.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern component-based development
- **UI Library**: Shadcn/ui components built on Radix UI primitives for professional, accessible interface
- **Styling**: Tailwind CSS with custom CSS variables for theming and responsive design
- **State Management**: React Query (TanStack Query) for server state management and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Canvas Management**: Custom canvas rendering system with real-time performance monitoring

### Backend Architecture
- **Framework**: Express.js with TypeScript for RESTful API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **File Upload**: Multer middleware for handling JavaScript effect file uploads
- **Storage**: In-memory storage implementation with future database persistence capability
- **Build System**: Vite for development and production builds with ESBuild for server compilation

### Key Components Structure
- **VFX Tester Core**: Main testing interface with canvas rendering, parameter controls, and metrics display
- **Effect System**: Base effect class architecture supporting pluggable visual effects with standardized parameter interfaces
- **Performance Monitor**: Real-time FPS, memory, and CPU usage tracking for effect validation
- **Parameter Panel**: Dynamic UI generation for effect parameters with range sliders, selects, and toggles
- **Canvas Recorder**: Video recording capabilities for effect demonstration and validation

### Data Models
- **Effects**: Store effect metadata, code, and parameter definitions
- **Performance Sessions**: Track testing sessions with metrics for quality assessment
- **Parameters**: Type-safe parameter definitions supporting ranges, selections, and boolean toggles

## External Dependencies

### Core Frontend Dependencies
- **React Ecosystem**: React 18, React Router alternative (Wouter), React Query for data fetching
- **UI Framework**: Radix UI primitives for accessibility, Tailwind CSS for styling
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Animation**: Embla Carousel for component carousels, native CSS animations for effects

### Backend Dependencies
- **Database**: Neon PostgreSQL serverless database, Drizzle ORM for type-safe queries
- **File Processing**: Multer for file uploads, built-in Node.js modules for file system operations
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **Development Tools**: TSX for TypeScript execution, ESBuild for production builds

### Development and Build Tools
- **Build System**: Vite with React plugin for fast development and optimized production builds
- **TypeScript**: Full TypeScript support across frontend and backend with strict type checking
- **Code Quality**: Prettier and ESLint configurations for consistent code formatting
- **Replit Integration**: Replit-specific plugins for development environment integration

### Canvas and Performance
- **Canvas API**: Native HTML5 Canvas for effect rendering with 2D context manipulation
- **Performance Monitoring**: Web Performance API for FPS calculation and memory usage tracking
- **Media Recording**: MediaRecorder API for canvas video capture and export functionality