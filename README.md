# Real Estate Marketing Platform

A comprehensive real estate management and marketing application built with Next.js, MongoDB, and NextAuth.js. Features a beautiful public property listing interface and a powerful admin dashboard for managing properties.

## Features

### Public Features
- 🏠 Browse and search properties by city, price range, and property type
- 📸 View detailed property information with multiple images
- 🔍 Advanced filtering and search capabilities
- 📱 Fully responsive design for mobile and desktop

### Admin Features
- 🔐 Secure authentication with NextAuth.js
- ➕ Create, read, update, and delete properties
- 📊 Dashboard with property statistics
- 🖼️ Image URL management for properties
- 🏷️ Property status management (available, pending, sold)
- 🔍 Search and filter properties

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js with credentials provider
- **UI Components**: shadcn/ui
- **Form Handling**: React Hook Form
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository and install dependencies:**
```bash
pnpm install
```

2. **Set up environment variables:**
Create a `.env.local` file based on `.env.local.example`:
```bash
cp .env.local.example .env.local
```

Update the values in `.env.local`:
```
MONGODB_URI=mongodb://localhost:27017/real-estate
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-generate-one
# static admin login (required for accessing /admin pages)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=password123
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id
```

### Database Setup

1. **Seed the database with demo data:**
```bash
pnpm seed
```

This will create:
- Demo admin account: `admin@example.com` / `password123`
- 6 sample properties across different cities

2. **Or manually create a MongoDB user:**
```bash
# Connect to MongoDB and run:
db.users.insertOne({
  email: "admin@example.com",
  password: "$2a$10/...", // bcrypt hash of "password123"
  name: "Admin User"
})
```

### Running the Application

**Development:**
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000)

**Production Build:**
```bash
pnpm build
pnpm start
```

## Project Structure

```
/app
  /api                  # API routes
    /auth              # NextAuth configuration
    /properties        # Property CRUD endpoints
  /admin               # Admin pages
    /login             # Admin login page
    /dashboard         # Admin dashboard
  /properties          # Public property pages
    /[id]              # Property detail page
  /page.tsx            # Homepage

/components
  /admin               # Admin-specific components
    PropertyForm.tsx
    PropertyManagement.tsx
    PropertyTable.tsx
  PropertyCard.tsx      # Property listing card
  PropertyGrid.tsx      # Grid of properties
  PropertySearchCard.tsx # Search/filter form
  AdminDashboard.tsx    # Admin dashboard layout

/lib
  auth.ts              # NextAuth configuration
  mongodb.ts           # MongoDB connection

/models
  Property.ts          # Property schema
  User.ts              # User schema

/scripts
  seed-db.js           # Database seeding script

/styles
  globals.css          # Global styles and design tokens
```

## Usage

### Public Site
1. Visit homepage to browse featured properties
2. Use search and filters to find properties
3. Click on property cards to view details
4. Properties show location, price, bedrooms, bathrooms, and square footage

### Admin Dashboard
1. Go to `/admin/login`
2. Enter the **admin username and password** you defined in your environment (`ADMIN_USERNAME` / `ADMIN_PASSWORD`).
   - If you seeded the database, the demo account will still work (`admin@example.com` / `password123`).
3. Access dashboard to manage properties:
   - View statistics (available, sold, pending)
   - Create new properties
   - Edit existing properties
   - Delete properties
   - Filter and search properties

## API Endpoints

### Properties
- `GET /api/properties` - Get all properties with optional filters
- `GET /api/properties/[id]` - Get specific property
- `POST /api/properties` - Create new property (admin only)
- `PUT /api/properties/[id]` - Update property (admin only)
- `DELETE /api/properties/[id]` - Delete property (admin only)

### Query Parameters
- `city` - Filter by city name
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `propertyType` - Filter by type (house, apartment, condo, townhouse, commercial, land)
- `status` - Filter by status (available, sold, pending)

Example:
```
GET /api/properties?city=Los Angeles&minPrice=1000000&maxPrice=5000000&propertyType=house
```

## Design

The application features a warm, professional design with:
- Earthy tone color palette (rust/terracotta primary color)
- Clean, modern UI with shadcn/ui components
- Responsive grid layouts
- Accessible components and proper ARIA labels
- Smooth transitions and hover effects

## Security

- Passwords hashed with bcryptjs
- NextAuth.js for secure session management
- Protected admin routes with authentication
- Environment variables for sensitive data
- CSRF protection built into Next.js

## Future Enhancements

- Property image uploads with Uploadthing
- Agent profiles and contact information
- Property viewing appointments
- User favorites/wishlist
- Email notifications
- Advanced analytics dashboard
- Mobile app
- Virtual property tours
- Real-time notifications

## Environment Variables Reference

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `NEXTAUTH_URL` | Your app URL (e.g., http://localhost:3000) |
| `NEXTAUTH_SECRET` | Secret key for NextAuth (generate with `openssl rand -base64 32`) |
| `UPLOADTHING_SECRET` | Uploadthing API secret for file uploads |
| `UPLOADTHING_APP_ID` | Uploadthing app ID |

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check MONGODB_URI is correct
- Verify network connectivity

**Login Not Working:**
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your deployment URL
- Ensure database has admin user (run seed script)

**Properties Not Loading:**
- Check MongoDB connection
- Verify properties collection exists
- Run seed script to populate data

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the code comments and inline documentation
3. Check MongoDB and NextAuth.js documentation
4. Create an issue with details about the problem
