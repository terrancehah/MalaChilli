import { AuthModal } from './AuthModal';
import { RegisterForm } from './RegisterForm';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
  referralCode?: string;
}

/**
 * Register modal component for HomePage
 * Combines AuthModal wrapper with RegisterForm
 */
export function RegisterModal({ isOpen, onClose, onSwitchToLogin, referralCode }: RegisterModalProps) {
  return (
    <AuthModal isOpen={isOpen} onClose={onClose} title="Join and start saving!">
      <RegisterForm 
        onSuccess={onClose}
        showLoginLink={true}
        onSwitchToLogin={onSwitchToLogin}
        referralCode={referralCode}
      />
    </AuthModal>
  );
}
