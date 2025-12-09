import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../../components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { SEO } from '../../components/shared';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the token from URL
        const token = searchParams.get('token');
        const type = searchParams.get('type');

        if (!token) {
          setStatus('error');
          setMessage('Invalid verification link. Please try again.');
          return;
        }

        // Verify the email using Supabase
        if (type === 'signup') {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          });

          if (error) throw error;

          setStatus('success');
          setMessage('Email verified successfully! Redirecting to login...');
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setStatus('error');
          setMessage('Invalid verification type.');
        }
      } catch (error) {
        console.error('Email verification error:', error);
        setStatus('error');
        setMessage('Failed to verify email. The link may have expired.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <SEO title="Verify Email" description="Verify your email address for MakanTak." />
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Verifying Email
              </h1>
              <p className="text-muted-foreground">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Email Verified!
              </h1>
              <p className="text-muted-foreground">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Verification Failed
              </h1>
              <p className="text-muted-foreground mb-4">{message}</p>
              <button
                onClick={() => navigate('/signup')}
                className="text-primary hover:underline"
              >
                Back to Sign Up
              </button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
