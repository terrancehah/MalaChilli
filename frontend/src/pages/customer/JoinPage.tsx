import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// FUTURE FEATURE: Viral Referral Landing Page (Dormant)
// TODO: This page will display reward details when voucher redemption is finalized
// For now, it just redirects to Register to preserve existing /join links

export default function JoinPage() {
  const { referralCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to register with code in URL
    // This preserves backward compatibility with existing /join/:slug/:code links
    if (referralCode) {
      navigate(`/register/${referralCode}`, { replace: true });
    } else {
      navigate("/register", { replace: true });
    }
  }, [referralCode, navigate]);

  return (
    <div className="min-h-screen auth-gradient-bg flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
  );
}
