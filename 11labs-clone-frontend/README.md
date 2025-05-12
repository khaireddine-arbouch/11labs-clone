# ElevenLabs Clone Frontend

A modern web application that replicates ElevenLabs' text-to-speech and voice cloning capabilities. Built with Next.js, TypeScript, and a modern tech stack.

## Features

- 🎙️ Text-to-Speech Generation
- 🎭 Voice Cloning
- 🎵 Sound Effects Generation
- 🔄 Voice Conversion
- 📚 Voice Library Management
- 🌙 Dark/Light Mode
- 🔐 Authentication System
- 📱 Responsive Design

## Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org)
- **Language:** [TypeScript](https://www.typescriptlang.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs)
- **Database:** [Prisma](https://prisma.io) with PostgreSQL
- **Authentication:** [NextAuth.js](https://next-auth.js.org)
- **API Layer:** [tRPC](https://trpc.io)
- **Form Handling:** [React Hook Form](https://react-hook-form.com)
- **Validation:** [Zod](https://zod.dev)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski)
- **Icons:** [Lucide Icons](https://lucide.dev)

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 9+
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/khaireddine-arbouch/11labs-clone.git
cd 11labs-clone/11labs-clone-frontend
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your configuration values.

4. Set up the database:
```bash
pnpm db:generate
pnpm db:push
```

5. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format:write` - Format code with Prettier
- `pnpm typecheck` - Run TypeScript compiler
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push database schema changes

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── client/      # Client-side components
│   ├── ui/          # Reusable UI components
│   └── ...
├── server/          # Server-side code
│   ├── api/         # API routes
│   └── auth/        # Authentication
├── styles/          # Global styles
└── utils/           # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
