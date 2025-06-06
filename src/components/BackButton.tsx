
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
      className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Dashboard
    </Button>
  );
};

export default BackButton;
