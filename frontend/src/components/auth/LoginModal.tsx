import { AuthModal } from './AuthModal';
import { LoginForm } from './LoginForm';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp?: () => void;
}

/**
 * Login modal component for HomePage
 * Combines AuthModal wrapper with LoginForm
 */
export function LoginModal({ isOpen, onClose, onSwitchToSignUp }: LoginModalProps) {
  return (
    <AuthModal isOpen={isOpen} onClose={onClose} title="Welcome back!">
      <LoginForm 
        onSuccess={onClose}
        showSignUpLink={true}
        onSwitchToSignUp={onSwitchToSignUp}
      />
    </AuthModal>
  );
}
