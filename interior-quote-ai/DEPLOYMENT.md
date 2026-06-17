# InteriorQuote AI - Deployment Guide

## Quick Start

### Prerequisites
- Node.js 22.13.0 or higher
- pnpm 10.4.1 or higher
- MySQL 8.0 or higher (or compatible database)

### Installation

1. **Extract the ZIP file**
   ```bash
   unzip interior-quote-ai-source.zip
   cd interior-quote-ai
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   - Configure your database connection
   - Set up OAuth credentials
   - Configure API keys and URLs
   - See Environment Variables section below

4. **Set up database**
   ```bash
   # Create database migrations
   pnpm drizzle-kit generate
   
   # Apply migrations to your database
   # Use your MySQL client to execute the SQL files in drizzle/migrations/
   ```

5. **Run development server**
   ```bash
   pnpm dev
   ```
   
   The application will be available at `http://localhost:3000`

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Environment Variables

Required environment variables:

- `DATABASE_URL` - MySQL connection string (e.g., mysql://user:password@localhost:3306/interior_quote_ai)
- `JWT_SECRET` - Session signing secret (generate a random string)
- `VITE_APP_ID` - Manus OAuth application ID
- `OAUTH_SERVER_URL` - OAuth server URL (https://api.manus.im)
- `VITE_OAUTH_PORTAL_URL` - OAuth portal URL
- `OWNER_OPEN_ID` - Owner's OpenID from Manus
- `OWNER_NAME` - Owner's name
- `BUILT_IN_FORGE_API_URL` - Built-in API URL
- `BUILT_IN_FORGE_API_KEY` - Built-in API key
- `VITE_FRONTEND_FORGE_API_KEY` - Frontend API key
- `VITE_FRONTEND_FORGE_API_URL` - Frontend API URL

## Database Setup

The application uses Drizzle ORM with MySQL. Database schema is defined in `drizzle/schema.ts`.

### Tables
- `users` - User accounts and authentication
- `clients` - Client information
- `quotations` - Quotation documents
- `quotation_items` - Line items for quotations
- `proposals` - Proposal documents

## Project Structure

```
interior-quote-ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── lib/           # Utilities (PDF generation, tRPC)
│   │   └── App.tsx        # Main app component
│   └── index.html         # HTML entry point
├── server/                # Express backend
│   ├── db.ts             # Database queries
│   ├── routers.ts        # tRPC procedures
│   └── _core/            # Core infrastructure
├── drizzle/              # Database schema and migrations
├── shared/               # Shared types and constants
└── package.json          # Dependencies
```

## Features

### Authentication
- Email/password signup and login
- Google OAuth via Manus
- Forgot password flow
- Session management

### Core Features
- **Dashboard** - Overview with statistics and quick actions
- **Client Management** - Full CRUD for client information
- **Quotation Builder** - Create quotations with line items and auto-calculations
- **Proposal Builder** - Generate professional proposals
- **PDF Export** - Download and print quotations and proposals
- **Document Library** - View, edit, duplicate, and delete saved documents
- **Settings** - User profile and preferences

## Development

### Running Tests
```bash
pnpm test
```

### Type Checking
```bash
pnpm check
```

### Code Formatting
```bash
pnpm format
```

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure MySQL server is running
- Check database credentials

### OAuth Issues
- Verify `VITE_APP_ID` and OAuth URLs are correct
- Check that redirect URIs are properly configured

### Build Issues
- Clear `dist` directory
- Delete `node_modules` and run `pnpm install` again
- Ensure Node.js version matches requirements

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Vite
- **Backend**: Express 4, tRPC 11, Node.js
- **Database**: MySQL, Drizzle ORM
- **PDF Generation**: jsPDF, html2canvas
- **Authentication**: Manus OAuth
- **UI Components**: shadcn/ui, Radix UI

## Support

For issues or questions, refer to:
- Drizzle ORM: https://orm.drizzle.team/
- tRPC: https://trpc.io/
- React: https://react.dev/
- Express: https://expressjs.com/

## License

MIT
