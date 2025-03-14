# iXplor

[![image](https://ixplor-profile-s3-bucket-02.s3.us-east-2.amazonaws.com/373bfa62bf4ee07e57b4e.png)](https://ixplor.app)

# iXplor App

A Next.js-based adventure activity booking platform that connects travelers with local vendors offering tours, lessons, rentals, and tickets.

## Features

- **Interactive Map Interface**: Browse vendors and activities with a dynamic map
- **Advanced Search**: Filter by activity type, location, and price range
- **Vendor Management**: Complete vendor onboarding and product management system
- **Booking System**: Seamless cart and checkout process
- **Admin Panel**: Comprehensive tools for managing vendors, products, and users
- **Multi-language Support**: Built-in internationalization
- **Real-time Updates**: Live status tracking for bookings and approvals

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI**: Material-UI v5, Tailwind CSS
- **Maps**: Mapbox GL JS, Google Places API
- **State Management**: React Query, Context API
- **Forms**: React Hook Form, Yup validation
- **Authentication**: Custom JWT with social login support
- **Internationalization**: i18next

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ixplor-app.git
```

2. Install dependencies:
```bash
cd ixplor-app
npm install
```

3. Set up environment variables:
```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_IS_SIGN_UP_ENABLED=true
```

4. Run development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── app/                   # App router pages and layouts
├── components/           # Reusable UI components
├── services/            # API services and utilities
├── hooks/               # Custom React hooks
└── types/              # TypeScript type definitions
```

## Development Guidelines

- Follow TypeScript best practices
- Use Material-UI components and styling system
- Implement responsive design patterns
- Write unit tests for critical components
- Document complex functions and components

## Environment Variables

Required environment variables:

- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_MAPBOX_TOKEN`: Mapbox access token
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Google OAuth client ID

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

[MIT License](LICENSE)
