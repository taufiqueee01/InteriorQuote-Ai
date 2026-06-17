# InteriorQuote AI - Setup Instructions

## Overview

InteriorQuote AI is a professional web application designed for interior designers to create quotations and proposals in 2-3 minutes instead of manually creating them in Word, Excel, or Canva.

## What's Included

This package contains the complete source code for InteriorQuote AI with:

✅ Full React + TypeScript frontend
✅ Express + tRPC backend
✅ MySQL database schema and migrations
✅ PDF generation for quotations and proposals
✅ Manus OAuth authentication
✅ Complete CRUD operations for clients, quotations, and proposals
✅ Professional UI with Tailwind CSS and shadcn/ui components
✅ Responsive design for mobile and desktop

## Quick Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment
Set up your environment variables with:
- Database connection string
- OAuth credentials
- API keys

### 3. Set Up Database
```bash
pnpm drizzle-kit generate
# Then execute the generated SQL migrations
```

### 4. Run Development Server
```bash
pnpm dev
```

Visit http://localhost:3000

## Project Structure

- **client/** - React frontend application
- **server/** - Express backend with tRPC
- **drizzle/** - Database schema and migrations
- **shared/** - Shared types and constants

## Key Features

### Authentication
- Email/password signup and login
- Google OAuth integration
- Forgot password functionality

### Dashboard
- Overview statistics
- Quick-create buttons
- Recent clients list

### Client Management
- Add, edit, delete clients
- Store client information and project details

### Quotation Builder
- Create professional quotations
- Add line items with auto-calculations
- Support for GST and discounts
- PDF export

### Proposal Builder
- Generate multi-section proposals
- Professional formatting
- PDF export and print

### Document Library
- View all quotations and proposals
- Edit existing documents
- Duplicate for quick reuse
- Delete with confirmation

## Database Schema

### Users Table
- id, openId, name, email, loginMethod, role, createdAt, updatedAt, lastSignedIn

### Clients Table
- id, userId, name, phone, email, projectAddress, notes, createdAt, updatedAt

### Quotations Table
- id, userId, clientId, projectType, area, budget, estimatedTimeline, selectedServices, subtotal, gstAmount, finalTotal, createdAt, updatedAt

### Quotation Items Table
- id, quotationId, itemName, quantity, rate, gstPercentage, discount, createdAt, updatedAt

### Proposals Table
- id, userId, clientId, quotationId, projectType, area, budget, estimatedTimeline, selectedServices, pricingSummary, termsAndConditions, createdAt, updatedAt

## Development Commands

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test

# Type check
pnpm check

# Format code
pnpm format
```

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Vite
- **Backend**: Express 4, tRPC 11, Node.js
- **Database**: MySQL with Drizzle ORM
- **PDF**: jsPDF + html2canvas
- **Authentication**: Manus OAuth
- **UI**: shadcn/ui, Radix UI, Lucide icons

## File Locations

- Frontend pages: `client/src/pages/`
- Backend routers: `server/routers.ts`
- Database queries: `server/db.ts`
- Database schema: `drizzle/schema.ts`
- PDF utilities: `client/src/lib/pdfGenerator.ts`

## Next Steps

1. Review `DEPLOYMENT.md` for detailed deployment instructions
2. Configure your environment variables
3. Set up your MySQL database
4. Run `pnpm install` to install dependencies
5. Run `pnpm dev` to start the development server

## Support

For detailed deployment instructions, see `DEPLOYMENT.md` in the project root.

For questions about the technology stack:
- React: https://react.dev/
- Express: https://expressjs.com/
- Drizzle ORM: https://orm.drizzle.team/
- tRPC: https://trpc.io/

## License

MIT
