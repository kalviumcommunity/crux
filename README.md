# CruX - GenAI News App

CruX is a modern, AI-powered news application that combines traditional news consumption with advanced AI-driven features for a more engaging and interactive news reading experience.

## Features

### 1. News Feed
- Real-time news updates from reliable sources
- Clean, modern interface for easy reading
- Article filtering and search capabilities
- Responsive design for all device sizes

### 2. AI-Powered Chat Features
- **Global Chat**: Engage in conversations about any news topic or current event
- **Contextual Chat**: Article-specific discussions with AI that understands the context of what you're reading
- Real-time AI responses powered by advanced language models
- Authentication required for chat features to ensure quality interactions

### 3. User Authentication
- Secure user registration and login system
- JWT-based authentication
- Protected routes and API endpoints
- Persistent user sessions

### 4. Article Interaction
- Detailed article views with rich media support
- Share functionality for social media and link sharing
- Reading time estimates
- Source attribution and timestamps

## Technical Implementation

### Frontend
- **Framework**: Next.js 14+ with App Router
- **UI Components**: Custom components built with shadcn/ui
- **Styling**: Tailwind CSS with custom theme configuration
- **Fonts**: Geist Sans and Geist Mono for modern typography
- **Icons**: Lucide icon library integration

### Backend
- **API Routes**: Next.js API routes for serverless functionality
- **Authentication**: Custom JWT implementation
- **News Integration**: Integration with NewsAPI for real-time news data
- **AI Integration**: Advanced AI models for chat functionality

### Key Technologies
- TypeScript for type-safe development
- React Server Components for optimal performance
- Modern React patterns including hooks and context
- Responsive design principles
- Progressive Web App capabilities

### Project Structure
```
├── app/                  # Next.js app router pages
├── components/          # Reusable React components
│   ├── article/        # Article-related components
│   ├── auth/          # Authentication components
│   └── ui/            # Shared UI components
├── contexts/           # React context providers
├── hooks/             # Custom React hooks
├── lib/               # Utility functions and services
└── public/            # Static assets
```

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
NEWS_API_KEY=your_news_api_key
JWT_SECRET=your_jwt_secret
```

4. Run the development server:
```bash
pnpm dev
```

## Environment Variables

- `NEWS_API_KEY`: Your NewsAPI access key
- `JWT_SECRET`: Secret key for JWT token generation
- `DATABASE_URL`: Your database connection string (if applicable)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- Built with Next.js
- UI components from shadcn/ui
- Icons from Lucide
- Fonts from Geist

---

For more information, please visit the project documentation or contact the maintainers.
