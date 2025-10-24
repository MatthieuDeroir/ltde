import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-center text-3xl font-bold">Connexion</h1>
        <LoginForm />
      </div>
    </div>
  );
}
