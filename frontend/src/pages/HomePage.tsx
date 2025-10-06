import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            ShareSaji
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Earn rewards by sharing. Save on every meal.
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/demo"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg"
            >
              🎨 View Demo Dashboard
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">5% Guaranteed Discount</h3>
            <p className="text-gray-600">
              Get an instant 5% discount on your first visit at any participating restaurant.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Share & Earn</h3>
            <p className="text-gray-600">
              Share your code with friends. Earn virtual currency when they dine.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Redeem Rewards</h3>
            <p className="text-gray-600">
              Use your earned virtual currency for discounts on future meals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
