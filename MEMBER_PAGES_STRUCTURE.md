# Member/Public Pages Structure

## Public Pages Overview

### Main Routes
```
/                       → app/(public)/page.tsx (Homepage/Dashboard)
/learning               → app/(public)/learning/page.tsx (Learning roadmap list)
/learning/[id]          → app/(public)/learning/[id]/page.tsx (Topic detail)
/coo-work               → app/(public)/coo-work/page.tsx (COO work list)
/coo-work/[id]          → app/(public)/coo-work/[id]/page.tsx (Task detail)
/blog                   → app/(public)/blog/page.tsx (Blog posts list)
/blog/[slug]            → app/(public)/blog/[slug]/page.tsx (Blog post detail)
/about                  → app/(public)/about/page.tsx (About page)
/contact                → app/(public)/contact/page.tsx (Contact page)
```

### Page Components

#### Homepage (Dashboard)
- **page.tsx** - Server component, fetches data
- **DashboardClient.tsx** - Client component for UI

#### Learning Section
- **page.tsx** - Learning roadmap list page
- **LearningPageClient.tsx** - List view client component
- **LearningClient.tsx** - Learning component
- **LearningHeader.tsx** - Header for learning section
- **[id]/page.tsx** - Topic detail page
- **[id]/TopicDetailClient.tsx** - Topic detail client component

#### COO Work Section
- **page.tsx** - COO work list page
- **COOWorkPageClient.tsx** - List view client component
- **COOWorkClient.tsx** - COO work component
- **COOWorkHeader.tsx** - Header for COO section
- **[id]/page.tsx** - Task detail page
- **[id]/TaskDetailClient.tsx** - Task detail client component

#### Blog Section
- **page.tsx** - Blog posts list page
- **BlogClient.tsx** - Blog list client component
- **[slug]/page.tsx** - Blog post detail page

#### Static Pages
- **about/page.tsx** - About page
- **about/AboutClient.tsx** - About page client component
- **contact/page.tsx** - Contact page
- **contact/ContactClient.tsx** - Contact page client component

### Layout
- **layout.tsx** - Public pages layout (includes Header, Footer)

### Components Used
- **components/Header.tsx** - Site header with navigation
- **components/Footer.tsx** - Site footer
- Uses **lib/i18n** for internationalization
- Uses **contexts/PositionContext** for user profile

### Data Sources
- **lib/roadmap.ts** - Learning & COO roadmap data
- **lib/profile.ts** - User profile data
- **content/posts/** - Blog posts (MDX files)
- **lib/posts.ts** - Blog post utilities

### Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode support
- ✅ Multi-language support (vi, en, ja)
- ✅ SEO optimized (metadata, sitemap, robots.txt)
- ✅ Dynamic routing for blog posts and roadmap items
- ✅ Server-side rendering
