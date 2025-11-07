# Hướng dẫn Setup và Deploy

## 1. Cài đặt Dependencies

```bash
npm install
```

## 2. Chạy Development Server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem website.

## 3. Setup Giscus Comments

Để bật tính năng comments, làm theo các bước sau:

### Bước 1: Tạo GitHub Repository

1. Tạo repository public trên GitHub (hoặc dùng repo hiện tại)
2. Enable GitHub Discussions:
   - Vào Settings → Features
   - Check "Discussions"

### Bước 2: Cấu hình Giscus

1. Truy cập https://giscus.app
2. Nhập repository của bạn (format: `username/repo-name`)
3. Chọn Discussion Category (nên chọn "General" hoặc tạo category "Comments")
4. Chọn mapping: "Discussion title contains page pathname"
5. Copy các giá trị được tạo

### Bước 3: Update Component

Mở file `components/Comments.tsx` và update các giá trị:

```typescript
script.setAttribute('data-repo', 'YOUR_GITHUB_USERNAME/YOUR_REPO_NAME');
script.setAttribute('data-repo-id', 'YOUR_REPO_ID');
script.setAttribute('data-category', 'General');
script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID');
```

## 4. Tạo Blog Posts

Tạo file `.mdx` trong folder `content/posts/`:

```mdx
---
title: "Tiêu đề bài viết"
date: "2025-11-05"
description: "Mô tả ngắn"
tags: ["tag1", "tag2"]
category: "Category Name"
---

# Nội dung bài viết

Viết nội dung ở đây...
```

## 5. Deploy lên Vercel

### Cách 1: Deploy qua GitHub

1. Push code lên GitHub repository
2. Truy cập [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import repository từ GitHub
5. Click "Deploy"

### Cách 2: Deploy qua CLI

```bash
# Cài Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 6. Custom Domain (Optional)

### Nếu dùng subdomain miễn phí của Vercel:
- Website của bạn sẽ có địa chỉ: `your-project-name.vercel.app`

### Nếu muốn dùng domain riêng:

1. Mua domain từ Namecheap, GoDaddy, etc.
2. Vào Vercel Dashboard → Settings → Domains
3. Add domain của bạn
4. Cập nhật DNS records theo hướng dẫn của Vercel

## 7. Tùy chỉnh

### Thay đổi thông tin cá nhân:

- `app/layout.tsx`: Metadata (title, description)
- `app/page.tsx`: Phần giới thiệu
- `app/about/page.tsx`: Trang About
- `components/Header.tsx`: Navigation
- `components/Footer.tsx`: Footer links

### Thay đổi style:

- `app/globals.css`: Global styles
- Tailwind CSS classes trong các components

## 8. Build Production

```bash
npm run build
```

## 9. Analytics (Optional)

### Vercel Analytics (Miễn phí):

Thêm vào `app/layout.tsx`:

```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Google Analytics:

1. Tạo GA4 property
2. Thêm tracking code vào layout

## Troubleshooting

### Lỗi build:
```bash
rm -rf .next
npm run build
```

### Lỗi TypeScript:
```bash
npm run build
```
Sửa các lỗi TypeScript được highlight.

## Tài liệu tham khảo

- [Next.js Docs](https://nextjs.org/docs)
- [MDX](https://mdxjs.com/)
- [Giscus](https://giscus.app)
- [Vercel Docs](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
