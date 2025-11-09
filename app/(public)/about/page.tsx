import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About | Dung Hoang',
  description: 'Thông tin về Dung Hoang',
};

export default function AboutPage() {
  return <AboutClient />;
}
