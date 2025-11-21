import LoginForm from '@/features/auth/components/LoginForm';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <LoginForm />
    </main>
  );
}
