# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Tire Shop Finder Cambodia** - A location-based business directory platform for tire shops across Cambodia with admin verification workflow.

## Tech Stack

- **Backend**: Laravel 12.x (PHP 8.2+) with Inertia.js
- **Frontend**: React 19.x with TypeScript  
- **Database**: SQLite with Eloquent ORM
- **Styling**: Tailwind CSS 4.x + shadcn/ui components
- **Build**: Vite 7.x with Laravel Vite Plugin
- **Permissions**: Spatie Laravel Permission package

## Development Commands

### Quick Start
```bash
composer dev         # Start full development stack (Laravel + Vite + Queue)
composer dev:ssr     # Development with SSR support
composer test        # Run PHPUnit tests
```

### Frontend Development
```bash
npm run dev          # Start Vite development server
npm run build        # Production build
npm run build:ssr    # Build with SSR support
npm run lint         # ESLint with auto-fix
npm run format       # Format code with Prettier
npm run types        # TypeScript type checking
```

**Note**: Always run `npm run lint` and `npm run types` before commits to ensure code quality.

### Backend Development
```bash
php artisan serve    # PHP development server only
php artisan migrate  # Run database migrations
php artisan test     # Run all PHPUnit tests
php artisan test --filter=TestName  # Run specific test
php artisan test tests/Feature       # Run only Feature tests
php artisan test tests/Unit          # Run only Unit tests
```

## Application Architecture

### Dual User System
- **Public Users**: Register → Create Business → Wait for Admin Approval
- **Admin Users**: Role-based access to admin panel for business verification

### Business Verification Workflow
1. User registers and creates business listing (`is_vierify = false`)
2. Admin reviews business in admin panel
3. Admin verifies/rejects business (`is_vierify = true/false`)
4. Only verified businesses appear on public website

**Note**: The database field `is_vierify` contains a typo (should be `is_verify`) but matches the actual schema.

### Routing Structure
```
/ (public homepage)
/create-business (authenticated users)
/user-dashboard (business owners)
/admin/* (admin-only routes with middleware)
```

### Database Schema
- **Location Hierarchy**: `provinces` → `districts` → `communes` → `villages`
- **Business Directory**: Location-aware business listings with admin verification
- **Permission System**: Users, roles, permissions via Spatie package
- **Review System**: Business ratings and reviews (future)

## Key Directories

```
app/Http/Controllers/
├── Auth/                    # Laravel Breeze authentication
├── Backends/               # Admin panel controllers
│   ├── BusinessController.php # Admin business management
│   ├── UserController.php     # Admin user management
│   └── ...
├── BusinessController.php   # Public business creation
└── Settings/               # User settings

resources/js/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── users/              # User management components
│   ├── roles/              # Role management components
│   ├── permissions/        # Permission management components
│   └── DefaultDataTableFilter.tsx # Reusable filtering
├── pages/
│   ├── admin/              # Admin panel pages
│   │   ├── business/       # Business verification interface
│   │   ├── user/           # User management
│   │   └── ...
│   ├── auth/               # Authentication pages
│   ├── business/           # Business creation
│   ├── user/               # User dashboard
│   └── welcome.tsx         # Public homepage
├── layouts/
│   ├── app-layout.tsx      # Admin panel layout
│   └── website-layout.tsx  # Public website layout
└── types/index.d.ts        # TypeScript definitions
```

## Component Patterns

### Admin Business Management
- **DataTableFilter**: Reusable filtering for admin tables
- **Verification Actions**: One-click verify/reject buttons
- **Status Badges**: Visual indicators for business verification state

### Form Patterns
- **Location Dropdowns**: Cascading Province → District → Commune → Village
- **SearchableSelect**: Custom dropdown with search functionality (`SearchableSelect.tsx`)
- **useForm Hook**: Inertia.js form handling with validation
- **API Endpoints**: Dynamic location data loading
- **Responsive Filters**: Mobile-collapsible sidebar with location controls

### Authentication & Authorization
- **Middleware**: `admin` middleware for role-based access
- **Role Redirection**: Users → `/user-dashboard`, Admins → `/admin/dashboard`
- **Permission Checks**: Frontend guards based on user roles

## Inertia.js Patterns

### Page Structure
- Pages map directly to Laravel routes
- Use `usePage()` for accessing shared Inertia data
- Props typed via TypeScript interfaces in `types/index.d.ts`

### Form Handling
```typescript
const { data, setData, post, processing, errors } = useForm({
    // form fields
});
```

### Route Generation
```typescript
route('businesses.verify', business.id)  // Laravel routes via Ziggy
```

### Data Loading
- Server-side data passed as Inertia props
- Client-side API calls for dynamic content (location dropdowns)
- **Public Location APIs**:
  - `/api/public/districts/{province}` - Get districts for province
  - `/api/public/communes/{district}` - Get communes for district
  - `/api/public/villages/{commune}` - Get villages for commune
  - `/api/public/reverse-geocode` - Convert GPS to location IDs
  - `/api/public/expand-maps-url` - Expand shortened Google Maps URLs

## Code Style & Quality

### TypeScript
- Strict type checking enabled in `tsconfig.json`
- Path aliases: `@/*` maps to `resources/js/*`
- All props and API responses properly typed
- Business interface includes `distance?: string` for proximity results

### React Components
- Functional components with hooks
- shadcn/ui components for consistency
- Proper TypeScript interfaces for all props

### Laravel Backend
- PSR standards and Laravel conventions
- Eloquent relationships for complex queries
- Form Request validation classes
- Observer patterns for model events

## Business Logic

### Location System & Proximity Search
Hierarchical location system for Cambodia with smart proximity-based search:
```
Province (Phnom Penh, Siem Reap, etc.)
└── District (Khan, Srok)
    └── Commune (Sangkat, Khum)  
        └── Village (Phum)
```

**Key Location Features:**
- **GPS-based Search**: Auto-detects user location and shows nearest businesses
- **Distance Calculation**: Uses Haversine formula to calculate real distances
- **Cascading Dropdowns**: Province → District → Commune → Village selection
- **Reverse Geocoding**: Converts GPS coordinates to administrative divisions
- **Fallback System**: Works with or without user location permissions

### Business Search Architecture

**Traditional Admin Search**: Users select province/district/commune/village manually

**Smart Proximity Search**: 
1. User clicks "Use My Location" button
2. Browser requests geolocation permission
3. GPS coordinates sent to `/api/public/reverse-geocode`
4. Backend finds closest businesses using distance calculation
5. Results sorted by proximity with distance badges ("1.2km away")
6. Auto-populates location dropdowns for reference

**Backend Distance Logic** (`PublicController::businesses()`):
- Accepts `user_lat` and `user_lng` parameters
- Calculates distances using SQL Haversine formula
- Filters businesses with coordinates (`latitude` and `longitude` not null)
- Orders results by distance (closest first)

### Business Verification
- New businesses default to `is_vierify = false`
- Admin panel provides verification interface
- Only verified businesses appear on public website
- Real-time status updates in user dashboard

### User Experience Flow
1. **Registration** → Business Creation Form
2. **Business Creation** → Pending Review State
3. **Admin Review** → Verify/Reject Decision
4. **User Notification** → Dashboard Status Update
5. **Public Listing** → Verified businesses only

## Development Workflow

1. **Full Stack Development**: Use `composer dev` for synchronized Laravel + Vite
2. **Code Quality**: Run `npm run lint` and `npm run types` before commits
3. **Database Changes**: Always create migrations for schema changes
4. **Component Development**: Follow existing shadcn/ui patterns
5. **Testing**: Run `composer test` for PHP backend tests

## Important Files

- **CLAUDE.md**: This guidance file
- **routes/web.php**: Application routing with role-based access and public APIs
- **app/Http/Controllers/PublicController.php**: Main public business search with proximity logic
- **app/Http/Middleware/AdminMiddleware.php**: Role-based access control
- **resources/js/types/index.d.ts**: TypeScript definitions including Business interface
- **resources/js/components/ui/searchable-select.tsx**: Reusable dropdown with search
- **resources/js/pages/public/businesses/index.tsx**: Main business directory with location features
- **resources/js/components/DefaultDataTableFilter.tsx**: Reusable admin filtering
- **resources/js/lib/maps-utils.ts**: Maps URL parsing and geolocation utilities
- **phpunit.xml**: PHPUnit testing configuration with SQLite in-memory database

## Location Search Implementation

### Frontend Architecture (`pages/public/businesses/index.tsx`)
- **Responsive Sidebar**: Mobile-collapsible filters with toggle button
- **GPS Integration**: `getCurrentLocation()` function with error handling
- **Auto-Search**: Triggers proximity search when GPS obtained
- **Distance Display**: Shows "1.2km away" badges on business cards
- **Smart State Management**: Manages coordinates, loading states, and dropdown selections

### Backend Architecture (`PublicController.php`)
- **Proximity Query**: SQL distance calculation with `user_lat`/`user_lng` parameters
- **Haversine Formula**: Accurate earth-surface distance calculation in kilometers
- **Reverse Geocoding**: Basic proximity-based location matching (can be upgraded to Google Maps API)
- **Filter Compatibility**: Works with traditional province/district filters

### Search UX Patterns
**Without Location**: Traditional admin division search
**With Location**: "Nearest Tire Shops" sorted by distance with green location indicator