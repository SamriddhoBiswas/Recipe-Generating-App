
# FlavorAI 🍳

FlavorAI is an AI-powered recipe generator that helps you create amazing recipes with personalized recommendations. Transform your ingredients into delicious meals with our intelligent recipe generator that provides cooking tips and nutritional insights tailored just for you.

## 🌐 Live Demo

[🔗 Demo Link](https://flavor-ai.lovable.app/) 

## ✨ Features

- **AI-Powered Recipe Generation**: Create personalized recipes based on your ingredients and preferences
- **Recipe Management**: Save and organize your favorite recipes
- **User Authentication**: Secure sign-up and login functionality
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes for better user experience
- **Nutritional Information**: Get detailed nutritional insights for each recipe
- **Search & Filter**: Find recipes quickly with advanced search capabilities

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router DOM
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation
- **Theme Management**: next-themes
  
<!-- 
## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Git**
-->

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/SamriddhoBiswas/Recipe-Generating-App.git
cd Recipe-Generating-App
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:8080`

### 5. Build for Production

```bash
npm run build
# or
yarn build
```

### 6. Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   ├── BackButton.tsx  # Navigation back button
│   └── ...
├── pages/              # Page components
│   ├── Landing.tsx     # Landing page
│   ├── Auth.tsx        # Authentication page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── RecipeGenerate.tsx # Recipe generation page
│   ├── SavedRecipes.tsx   # Saved recipes page
│   └── ...
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
│   └── supabase/       # Supabase configuration
├── lib/                # Utility functions
├── types/              # TypeScript type definitions
└── App.tsx             # Main application component
```
<!--
## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Deployment

This project can be deployed on various platforms :

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Other Platforms
The built files in the `dist` folder can be deployed to any static hosting service.

## 🔐 Authentication & Database

This project uses Supabase for :
- User authentication (email/password)
- Database storage for recipes and user data
- Real-time subscriptions
- Row Level Security (RLS) for data protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
-->


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

<!-- - Built with [Lovable](https://lovable.dev) - AI-powered web development platform -->
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Powered by [Supabase](https://supabase.com/)

---

**FlavorAI** - Transform your cooking experience with AI! 🚀
