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
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    birthday: ''
  });
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    birthday: false
  });
  const [loading, setLoading] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { referralCode } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      fullName: true,
      email: true,
      password: true,
      birthday: true
    });

    // Validate all fields
    const newErrors = {
      fullName: validateField('fullName', formData.fullName),
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
      birthday: validateField('birthday', formData.birthday)
    };

    setErrors(newErrors);

    // Check if any errors exist
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (hasErrors) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    setLoading(true);


    try {
      await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        birthday: formData.birthday,
        role: 'customer',
      });
      
      toast.success('Account created successfully! Redirecting...');
      
      // Redirect after short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
      
    } catch (err: any) {
      // Handle specific error cases
      let errorMessage = 'Failed to create account. Please try again.';
      
      if (err.message?.includes('already registered') || err.message?.includes('already exists')) {
        errorMessage = 'This email is already registered. Please login or use a different email.';
      } else if (err.message?.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.message?.includes('Password')) {
        errorMessage = 'Password must be at least 8 characters.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Full name must be at least 2 characters';
        return '';
      
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
      
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return '';
      
      case 'birthday':
        if (!value) return 'Birthday is required';
        const birthDate = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        if (age < 18) return 'You must be at least 18 years old';
        if (age > 120) return 'Please enter a valid birthday';
        return '';
      
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (touched[name as keyof typeof touched]) {
      setErrors({
        ...errors,
        [name]: validateField(name, value)
      });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    setErrors({
      ...errors,
      [name]: validateField(name, value)
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
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="Jaslin Shah"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input-field-minimal ${
                touched.fullName && errors.fullName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {touched.fullName && errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="jaslin.shah@gmail.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input-field-minimal ${
                touched.email && errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {touched.email && errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input-field-minimal ${
                touched.password && errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {touched.password && errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            {!errors.password && (
              <p className="text-gray-500 text-xs mt-1">Minimum 8 characters</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Birthday <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input-field-minimal ${
                touched.birthday && errors.birthday ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {touched.birthday && errors.birthday && (
              <p className="text-red-500 text-xs mt-1">{errors.birthday}</p>
            )}
            {!errors.birthday && (
              <p className="text-gray-500 text-xs mt-1">You must be 18 or older</p>
            )}
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
