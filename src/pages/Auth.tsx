
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChefHat } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Check your email for the confirmation link.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    // Clear form when switching
    setEmail('');
    setPassword('');
    setFullName('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-health-green-50 to-health-orange-50 flex items-center justify-center p-4">
      <div className={`relative w-full max-w-4xl h-[600px] bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 ${isSignUp ? 'auth-container-active' : ''}`}>
        
        {/* Sign Up Form */}
        <div className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center transition-all duration-700 ${isSignUp ? 'translate-x-0 opacity-100 z-20' : 'translate-x-full opacity-0 z-10'}`}>
          <div className="w-full max-w-sm px-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-health-green-500 to-health-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold health-text-gradient mb-2">Create Account</h1>
              <p className="text-gray-600">Join HealthyEats today</p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-12 rounded-xl border-gray-200 focus:border-health-green-500 focus:ring-health-green-500"
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl border-gray-200 focus:border-health-green-500 focus:ring-health-green-500"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-12 rounded-xl border-gray-200 focus:border-health-green-500 focus:ring-health-green-500"
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-health-green-500 to-health-orange-500 hover:from-health-green-600 hover:to-health-orange-600 text-white font-semibold"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
          </div>
        </div>

        {/* Sign In Form */}
        <div className={`absolute top-0 right-0 w-1/2 h-full flex items-center justify-center transition-all duration-700 ${!isSignUp ? 'translate-x-0 opacity-100 z-20' : '-translate-x-full opacity-0 z-10'}`}>
          <div className="w-full max-w-sm px-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-health-green-500 to-health-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold health-text-gradient mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl border-gray-200 focus:border-health-green-500 focus:ring-health-green-500"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl border-gray-200 focus:border-health-green-500 focus:ring-health-green-500"
              />
              <div className="text-center">
                <a href="#" className="text-sm text-health-green-600 hover:text-health-green-700">
                  Forgot your password?
                </a>
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-health-green-500 to-health-orange-500 hover:from-health-green-600 hover:to-health-orange-600 text-white font-semibold"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </div>
        </div>

        {/* Toggle Panel */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full bg-gradient-to-br from-health-green-500 to-health-orange-500 transition-all duration-700 ${isSignUp ? '-translate-x-full' : 'translate-x-0'}`}>
          <div className="relative w-full h-full flex items-center justify-center text-white">
            <div className={`text-center px-8 transition-all duration-700 ${isSignUp ? 'opacity-0' : 'opacity-100'}`}>
              <h1 className="text-4xl font-bold mb-4">Hello, Friend!</h1>
              <p className="text-lg mb-8 leading-relaxed">
                Register with your personal details to start your healthy cooking journey
              </p>
              <Button 
                onClick={toggleMode}
                variant="outline"
                className="px-8 py-3 rounded-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-health-green-600 transition-all duration-300"
              >
                Sign Up
              </Button>
            </div>

            <div className={`absolute inset-0 flex items-center justify-center text-center px-8 transition-all duration-700 ${isSignUp ? 'opacity-100' : 'opacity-0'}`}>
              <div>
                <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                <p className="text-lg mb-8 leading-relaxed">
                  Enter your personal details to continue your healthy cooking journey
                </p>
                <Button 
                  onClick={toggleMode}
                  variant="outline"
                  className="px-8 py-3 rounded-full border-2 border-white text-white bg-transparent hover:bg-white hover:text-health-green-600 transition-all duration-300"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .health-text-gradient {
          background: linear-gradient(135deg, #10b981, #f59e0b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
};

export default Auth;
