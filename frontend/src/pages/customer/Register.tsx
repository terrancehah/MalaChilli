import { useParams, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { RegisterForm } from "../../components/auth";

export default function Register() {
  const { referralCode: urlReferralCode } = useParams();
  const location = useLocation();

  // Support both URL param (backward compat) and location state (from future Join page)
  const referralCode = location.state?.referralCode || urlReferralCode;
  const reward = location.state?.reward; // Future feature - not used yet

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#111827",
          },
          success: {
            iconTheme: {
              primary: "#0A5F0A",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#DC2626",
              secondary: "#fff",
            },
          },
        }}
      />
      <div className="min-h-screen auth-gradient-bg flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-card shadow-2xl p-12">
          {/* Logo */}
          <div className="text-center mb-10">
            <h1 className="font-display text-5xl mb-2">
              <span className="text-gray-900">Mala</span>
              <span className="text-primary">Chilli</span>
            </h1>
            <p className="text-sm text-gray-600">Join and start saving!</p>
          </div>

          {/* Register Form Component */}
          <RegisterForm showLoginLink={true} referralCode={referralCode} />
        </div>
      </div>
    </>
  );
}
