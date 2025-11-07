import ContactClient from './ContactClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Liên Hệ | Dung Hoang - COO',
  description: 'Kết nối với Dung Hoang - COO qua điện thoại, email, Zalo hoặc LinkedIn',
};

export default function ContactPage() {
  return <ContactClient />;
}
