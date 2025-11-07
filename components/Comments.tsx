'use client';

import { useEffect, useRef } from 'react';

export default function Comments() {
  const commentsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only load Giscus if it hasn't been loaded yet
    if (!commentsRef.current || commentsRef.current.hasChildNodes()) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    // TODO: Update these values after setting up Giscus on your GitHub repo
    // Visit https://giscus.app to generate your configuration
    script.setAttribute('data-repo', 'YOUR_GITHUB_USERNAME/YOUR_REPO_NAME');
    script.setAttribute('data-repo-id', 'YOUR_REPO_ID');
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', 'vi');
    script.setAttribute('data-loading', 'lazy');

    commentsRef.current.appendChild(script);
  }, []);

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <div ref={commentsRef} className="giscus" />
    </div>
  );
}
