import { Toaster } from 'react-hot-toast';
import { LoginForm } from '../../components/auth';

export default function Login() {

  return (
    <>
      <Toaster position="top-right" toastOptions={{
        duration: 4000,
        style: {
          background: '#fff',
          color: '#111827',
        },
        success: {
          iconTheme: {
            primary: '#0A5F0A',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#DC2626',
            secondary: '#fff',
          },
        },
      }} />
      <div className="min-h-screen auth-gradient-bg flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-card shadow-2xl p-12">
          {/* Logo */}
          <div className="text-center mb-10">
            <h1 className="font-display text-5xl mb-2">
              <span className="text-gray-900">Mala</span>
              <span className="text-primary">Chilli</span>
            </h1>
            <p className="text-sm text-gray-600">Welcome back!</p>
          </div>

          {/* Login Form Component */}
          <LoginForm showSignUpLink={true} />
        </div>
      </div>
    </>
  );
}
