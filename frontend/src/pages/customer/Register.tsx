import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Upload } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    birthday: ''
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register:', formData);
    // TODO: Implement Supabase registration
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
        <div className="text-center mb-8">
          <h1 className="font-display text-5xl mb-2">
            <span className="text-gray-900">Mala</span>
            <span className="text-primary">Chilli</span>
          </h1>
          <p className="text-sm text-gray-600">Join and start saving!</p>
        </div>

        {/* Profile Image Upload */}
        <div className="mb-8">
          <div className="relative w-32 h-32 mx-auto">
            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-primary/10 to-primary-light/10">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserPlus className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <label
              htmlFor="profile-upload"
              className="absolute bottom-0 right-0 w-10 h-10 bg-primary hover:bg-primary-dark transition-colors rounded-full border-3 border-white flex items-center justify-center cursor-pointer shadow-lg"
            >
              <Upload className="w-5 h-5 text-white" />
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
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
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3.5 px-8 rounded-pill transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Sign Up Now!
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
  );
}
