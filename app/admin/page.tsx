import { redirect } from 'next/navigation';

export default function AdminIndexPage() {
  // forward anyone who lands on /admin to the login screen
  redirect('/admin/login');
}
