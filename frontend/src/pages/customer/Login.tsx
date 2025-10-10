import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', formData);
    // TODO: Implement Supabase login
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen auth-gradient-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-card shadow-2xl p-12">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-display text-5xl mb-2">
            <span className="text-gray-900">Mala</span>
            <span className="text-primary">Chilli</span>
          </h1>
          <p className="text-sm text-gray-600">Welcome back!</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              className="input-field-minimal"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="input-field-minimal"
              required
            />
            <div className="text-right mt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary-dark"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white border-2 border-primary text-primary hover:bg-primary/5 font-semibold py-3.5 px-8 rounded-pill transition-all duration-200"
          >
            Login
          </button>
        </form>

        {/* Sign Up Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">Don't have an account?</p>
          <Link to="/register">
            <button className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 px-8 rounded-pill transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5">
              Sign Up
            </button>
          </Link>
        </div>

        {/* Decorative Food Image Placeholder */}
        <div className="mt-8 text-center opacity-80">
          <p className="text-xs text-gray-500">🍛 Nasi Lemak • Satay • Teh Tarik 🍜</p>
        </div>
      </div>
    </div>
  );
}
