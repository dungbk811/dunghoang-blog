# Dung Hoang Blog - Project Structure

## Overview
Personal blog/portfolio site with admin panel for managing learning roadmap, COO work, and blog posts.

## Technology Stack
- **Framework**: Next.js 16.0.1 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: npm
- **Features**: SSR, SEO, i18n (vi, en, ja), Dark mode

## Directory Structure

```
dunghoang-blog/
├── app/
│   ├── (public)/              # Public-facing pages
│   │   ├── page.tsx           # Homepage
│   │   ├── layout.tsx         # Public layout
│   │   ├── learning/          # Learning roadmap
│   │   ├── work-item/         # Work item details (all roles)
│   │   ├── coo-work/          # Legacy redirects to work-item
│   │   ├── coo/               # COO work list
│   │   ├── cpo/               # CPO work list
│   │   ├── cfo/               # CFO work list
│   │   ├── clo/               # CLO work list
│   │   ├── blog/              # Blog posts
│   │   ├── about/             # About page
│   │   └── contact/           # Contact page
│   │
│   ├── admin/                 # Admin panel
│   │   ├── page.tsx           # Admin dashboard
│   │   ├── layout.tsx         # Admin layout
│   │   ├── components/        # Admin-specific components
│   │   ├── learning/          # Manage learning roadmap
│   │   ├── coo-work/          # Manage COO work
│   │   ├── cpo-work/          # Manage CPO work
│   │   ├── cfo-work/          # Manage CFO work
│   │   ├── clo-work/          # Manage CLO work
│   │   ├── blog/              # Manage blog posts
│   │   ├── settings/          # Profile settings
│   │   └── contact/           # Contact info settings
│   │
│   ├── api/                   # API routes
│   │   └── admin/             # Admin API endpoints
│   │       ├── roadmap/       # CRUD for roadmap items
│   │       └── profile/       # Update user profile
│   │
│   ├── layout.tsx             # Root layout
│   └── globals.css            # Global styles
│
├── components/                # Shared components
│   ├── Header.tsx             # Site header
│   ├── Footer.tsx             # Site footer
│   ├── ThemeSwitcher.tsx      # Dark mode toggle
│   ├── LanguageSwitcher.tsx   # Language selector
│   ├── dashboard/             # Dashboard components
│   └── topic/                 # Topic detail components
│
├── contexts/                  # React contexts
│   ├── PositionContext.tsx    # User profile context
│   └── AdminLanguageContext.tsx # Admin language context
│
├── lib/                       # Utilities and data
│   ├── roadmap.ts             # Learning & COO roadmap data
│   ├── profile.ts             # User profile data
│   ├── posts.ts               # Blog post utilities
│   ├── i18n.ts                # Internationalization
│   ├── auth.ts                # Authentication
│   └── github.ts              # GitHub integration
│
├── content/                   # Content files
│   └── posts/                 # Blog posts (MDX)
│
├── translations/              # i18n translations
│   ├── vi.json                # Vietnamese
│   ├── en.json                # English
│   ├── ja.json                # Japanese
│   └── admin/                 # Admin translations
│
└── public/                    # Static assets
    ├── profile.jpg
    └── ...
```

## Key Features

### Public Site
- 🏠 Homepage with dashboard view
- 📚 Learning roadmap with filtering/search
- 💼 COO work tasks tracking
- 📝 Blog with MDX support
- 👤 About page
- 📧 Contact page
- 🌍 Multi-language (vi, en, ja)
- 🌓 Dark mode
- 📱 Responsive design

### Admin Panel
- 📊 Dashboard with stats
- ➕ CRUD operations for:
  - Learning topics
  - COO work tasks
  - Blog posts
- ⚙️ Settings (profile, contact)
- 🔐 Authentication required
- 🚀 Auto-deploy via GitHub

### Data Management
- **Roadmap Items**: Stored in `lib/roadmap.ts`
- **User Profile**: Stored in `lib/profile.ts`
- **Blog Posts**: MDX files in `content/posts/`
- **Persistence**: Changes pushed to GitHub → Auto rebuild

## Routes

### Public Routes
```
/                    # Homepage
/learning            # Learning roadmap list
/learning/[id]       # Topic detail
/coo, /cpo, /cfo, /clo  # Role-specific work lists
/work-item/[id]      # Work item detail (all roles)
/coo-work            # Legacy redirect to /coo
/coo-work/[id]       # Legacy redirect to /work-item/[id]
/blog                # Blog posts
/blog/[slug]         # Post detail
/about               # About page
/contact             # Contact page
```

### Admin Routes
```
/admin               # Dashboard
/admin/learning      # Manage learning
/admin/coo-work      # Manage COO work
/admin/blog          # Manage blog
/admin/blog/new      # Create post
/admin/blog/edit/[slug] # Edit post
/admin/settings      # Profile settings
/admin/contact       # Contact settings
```

## Components Organization

### Shared Components (components/)
- Used by both public and admin
- Reusable UI components
- Theme/Language switchers
- Layout components

### Admin Components (app/admin/components/)
- Admin-only functionality
- Roadmap manager
- Blog editor
- Edit modals

### Public Components (app/(public)/*Client.tsx)
- Client-side rendered components
- Interactive UI for public pages

## State Management

### Contexts
1. **PositionContext** (UserProfile)
   - Stores: name, position, phone, email, linkedin
   - Used by: Header, About, Contact
   - Persistence: localStorage + API

2. **AdminLanguageContext**
   - Admin UI language
   - Separate from public i18n

### Data Flow
```
User Edit → Admin UI → API Route → File Update → Git Commit → Auto Rebuild
```

## Recent Updates
- ✅ Added profile persistence API
- ✅ Integrated Settings & Contact with Git
- ✅ Cleaned up duplicate files
- ✅ Fixed admin dashboard structure
- ✅ Added Contact card to dashboard
