import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    birthday: ''
  });
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { referralCode } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Calculate age from birthday
    let age = null;
    if (formData.birthday) {
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      // Validate age (must be 18+)
      if (age < 18) {
        toast.error('You must be at least 18 years old to register.');
        setLoading(false);
        return;
      }
    }

    try {
      await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        birthday: formData.birthday || null,
        age: age,
        role: 'customer',
      });
      
      toast.success('Account created successfully! Redirecting...');
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (err: any) {
      toast.error(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
      <div className="min-h-screen auth-gradient-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-card shadow-2xl p-12">
        {/* Logo */}
        <div className="text-center mb-4">
          {referralCode && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-xs mb-3">
              🎉 You're using referral code: <strong>{referralCode}</strong>
            </div>
          )}
          <h1 className="font-display text-5xl mb-2">
            <span className="text-gray-900">Mala</span>
            <span className="text-primary">Chilli</span>
          </h1>
          <p className="text-sm text-gray-600">Join and start saving!</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Jaslin Shah"
              value={formData.fullName}
              onChange={handleChange}
              className="input-field-minimal"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="jaslin.shah@gmail.com"
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
              minLength={8}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Birthday (Optional)
            </label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              className="input-field-minimal"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 px-8 rounded-pill transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up Now!'}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary-dark font-medium underline">
            Login
          </Link>
        </p>
      </div>
    </div>
    </>
  );
}
