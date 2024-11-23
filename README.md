# Period Tracker

A modern, privacy-focused period tracking application built with React, Remix, and Supabase.

## Features

- 📅 Track periods and symptoms
- 🔔 Set reminders for periods and pills
- 📊 View cycle predictions and insights
- 🔒 Secure authentication with email and Google
- 🤝 Share cycle information with trusted partners
- 📱 Responsive design for all devices
- 🌙 Dark mode support
- 🔐 Privacy-focused with end-to-end encryption

## Tech Stack

- **Frontend**: React, Remix, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Authentication**: Supabase Auth, Google OAuth
- **State Management**: React Hooks
- **Form Handling**: React Hook Form, Zod
- **Styling**: Tailwind CSS, CSS Modules
- **Icons**: Lucide Icons
- **Development**: Vite, ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- A Supabase account
- A Google Cloud Console account (for Google Auth)
- A reCAPTCHA account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/period-tracker.git
   cd period-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update the environment variables in `.env` with your own values.

5. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup

1. Create a new Supabase project.

2. Run the database migrations:
   ```bash
   cd supabase
   supabase db push
   ```

## Development

### Project Structure

```
period-tracker/
├── app/
│   ├── components/     # React components
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utility functions and configurations
│   └── routes/        # Remix routes
├── public/            # Static assets
└── supabase/         # Database migrations and schema
```

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy to your hosting provider of choice (e.g., Vercel, Netlify).

3. Set up the required environment variables in your hosting provider's dashboard.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

- All data is encrypted at rest in Supabase
- Authentication is handled securely by Supabase Auth
- reCAPTCHA protection against spam and abuse
- Regular security audits and dependency updates

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Remix](https://remix.run/)
- [Supabase](https://supabase.io/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

## Support

For support, email support@periodtracker.com or join our Discord community.