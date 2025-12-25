import { LoginForm } from '../../components/auth';
import { SEO } from '../../components/shared';

export default function Login() {

  return (
    <>
      <SEO title="Login" description="Login to your MakanTak account." />
      <div className="min-h-screen auth-gradient-bg flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-card shadow-2xl p-12">
          {/* Logo */}
          <div className="text-center mb-10">
            <h1 className="font-display text-5xl mb-2">
              <span className="text-gray-900">Makan</span>
              <span className="text-primary">Tak</span>
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
