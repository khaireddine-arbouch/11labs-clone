# 11Labs Clone - AI Voice Generation Platform

This project is a comprehensive AI voice generation platform that combines multiple state-of-the-art text-to-speech and voice cloning technologies. The platform includes a modern Next.js frontend and multiple AI model backends for different voice generation capabilities.

## Features

- Text-to-Speech with StyleTTS2
- Voice Cloning with SEED-VC
- Audio Generation with Make-An-Audio
- Modern Next.js Frontend with TypeScript
- Docker-based deployment
- GPU-accelerated AI models
- User authentication and management
- File storage with AWS S3

## Prerequisites

- Node.js 18+ and pnpm 9.12.1
- Docker and Docker Compose
- NVIDIA GPU with CUDA support
- AWS Account (for S3 storage)
- PostgreSQL database

## Installation

1. Clone the repository:
```bash
git clone https://github.com/khaireddine-arbouch/11labs-clone.git
cd 11labs-clone
```

2. Install frontend dependencies:
```bash
cd 11labs-clone-frontend
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the frontend directory with:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="your-aws-region"
AWS_BUCKET_NAME="your-bucket-name"
```

4. Initialize the database:
```bash
pnpm db:generate
pnpm db:push
```

5. Start the development server:
```bash
pnpm dev
```

## Docker Deployment

The project uses Docker Compose to manage multiple services:

1. StyleTTS2 API (Port 8000)
2. SEED-VC API (Port 8001)
3. Make-An-Audio API (Port 8002)

To start all services:
```bash
docker-compose up -d
```

## Project Structure

```
.
├── 11labs-clone-frontend/     # Next.js frontend application
│   ├── src/                  # Source code
│   ├── prisma/              # Database schema and migrations
│   └── public/              # Static assets
├── StyleTTS2/               # StyleTTS2 voice generation service
├── seed-vc/                # SEED-VC voice cloning service
├── Make-An-Audio/          # Audio generation service
└── docker-compose.yml      # Docker services configuration
```

## Technology Stack

### Frontend
- Next.js 15.2.3
- React 19.0.0
- TypeScript
- TailwindCSS 4.0.15
- tRPC
- Prisma
- NextAuth.js
- Zustand for state management

### Backend Services
- StyleTTS2 for text-to-speech
- SEED-VC for voice cloning
- Make-An-Audio for audio generation
- All services are containerized with Docker

## API Documentation

### StyleTTS2 API
- Endpoint: `http://localhost:8000`
- GPU-accelerated text-to-speech generation

### SEED-VC API
- Endpoint: `http://localhost:8001`
- Voice cloning capabilities

### Make-An-Audio API
- Endpoint: `http://localhost:8002`
- Audio generation and manipulation

## Security

- All API endpoints are protected with authentication
- AWS S3 is used for secure file storage
- Environment variables for sensitive data
- HTTPS enforced in production

## Deployment

1. Build the frontend:
```bash
cd 11labs-clone-frontend
pnpm build
```

2. Start the Docker services:
```bash
docker-compose up -d
```

3. The application will be available at:
- Frontend: http://localhost:3000
- StyleTTS2 API: http://localhost:8000
- SEED-VC API: http://localhost:8001
- Make-An-Audio API: http://localhost:8002

## Acknowledgments

- StyleTTS2: [https://github.com/keithito/tacotron](https://github.com/keithito/tacotron)
- SEED-VC: [https://github.com/keithito/tacotron](https://github.com/keithito/tacotron)
- Make-An-Audio: [https://github.com/keithito/tacotron](https://github.com/keithito/tacotron) 
