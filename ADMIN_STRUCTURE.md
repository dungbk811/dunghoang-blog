# Admin Structure Overview

## Current Admin Structure

### Main Pages
```
/admin                  → app/admin/page.tsx (uses DashboardContent.tsx)
/admin/learning         → app/admin/learning/page.tsx (uses RoadmapManager)
/admin/coo-work         → app/admin/coo-work/page.tsx (uses RoadmapManager)
/admin/blog             → app/admin/blog/page.tsx (uses BlogManager)
/admin/blog/new         → app/admin/blog/new/page.tsx (uses BlogPostEditor)
/admin/blog/edit/[slug] → app/admin/blog/edit/[slug]/page.tsx (uses BlogPostEditor)
/admin/settings         → app/admin/settings/page.tsx
/admin/contact          → app/admin/contact/page.tsx
```

### Components (app/admin/components/)
- **RoadmapManager.tsx** - Manages learning/COO roadmap items
- **EditItemModal.tsx** - Modal for editing roadmap items ✅ ACTIVE
- **BlogManager.tsx** - Manages blog posts list
- **BlogPostEditor.tsx** - Editor for creating/editing blog posts
- **TopicContentEditor.tsx** - Editor for topic content
- **LanguageSwitcher.tsx** - Language switcher for admin

### Layout Components
- **AdminLayout.tsx** - Main admin layout with sidebar ✅ ACTIVE
- **DashboardContent.tsx** - Dashboard homepage content ✅ ACTIVE

### Removed Files (Duplicates)
- ❌ **AdminDashboard.tsx** - Duplicate, not used (removed)
- ❌ **EditItemModal.tsx** (root) - Duplicate, use components/EditItemModal.tsx (removed)

## Data Files
- **lib/roadmap.ts** - Learning & COO roadmap data
- **lib/profile.ts** - User profile data (name, position, contact)
- **content/posts/** - Blog posts content

## APIs
- **/api/admin/roadmap** - CRUD for roadmap items
- **/api/admin/profile** - Update user profile
- **/api/admin/logout** - Logout endpoint

## Dashboard Cards (4 cards)
1. Learning Topics - Links to /admin/learning
2. COO Work - Links to /admin/coo-work
3. Blog Posts - Links to /admin/blog
4. Contact Info - Links to /admin/contact

## Contexts
- **PositionContext** - User profile context (name, position, phone, email, linkedin)
- **AdminLanguageContext** - Admin UI language context
