
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
      navigate('/dashboard');
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

      navigate('/dashboard');
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
    setEmail('');
    setPassword('');
    setFullName('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5" style={{
      fontFamily: 'Montserrat, sans-serif',
      background: 'linear-gradient(to right, #e2e2e2, #c9d6ff)'
    }}>
      <div className={`relative bg-white rounded-[30px] shadow-[0_5px_15px_rgba(0,0,0,0.35)] overflow-hidden w-[768px] max-w-full min-h-[480px] transition-all duration-[0.6s] ease-in-out ${isSignUp ? 'active' : ''}`}>
        
        {/* Sign In Form */}
        <div className={`absolute top-0 h-full transition-all duration-[0.6s] ease-in-out left-0 w-1/2 z-[2] ${isSignUp ? 'translate-x-full' : ''}`}>
          <form onSubmit={handleSignIn} className="bg-white flex items-center justify-center flex-col px-10 h-full">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold mb-5 text-gray-800">Sign In</h1>
            <span className="text-xs text-gray-600 mb-5">Use your email and password</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-100 border-none my-2 px-4 py-3 text-sm rounded-lg w-full outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-100 border-none my-2 px-4 py-3 text-sm rounded-lg w-full outline-none"
            />
            <a href="#" className="text-gray-700 text-sm no-underline my-4">Forgot Your Password?</a>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-[#512da8] text-white text-xs px-11 py-3 border border-transparent rounded-lg font-semibold tracking-wider uppercase mt-3 cursor-pointer hover:bg-[#4527a0] disabled:opacity-50 w-full"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Sign Up Form */}
        <div className={`absolute top-0 h-full transition-all duration-[0.6s] ease-in-out left-0 w-1/2 z-[1] ${isSignUp ? 'translate-x-full opacity-100 z-[5]' : 'opacity-0'}`}>
          <form onSubmit={handleSignUp} className="bg-white flex items-center justify-center flex-col px-10 h-full">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-orange-500 rounded-xl flex items-center justify-center mb-4">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-semibold mb-5 text-gray-800">Create Account</h1>
            <span className="text-xs text-gray-600 mb-5">Use your email for registration</span>
            <input
              type="text"
              placeholder="Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="bg-gray-100 border-none my-2 px-4 py-3 text-sm rounded-lg w-full outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-gray-100 border-none my-2 px-4 py-3 text-sm rounded-lg w-full outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="bg-gray-100 border-none my-2 px-4 py-3 text-sm rounded-lg w-full outline-none"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-[#512da8] text-white text-xs px-11 py-3 border border-transparent rounded-lg font-semibold tracking-wider uppercase mt-3 cursor-pointer hover:bg-[#4527a0] disabled:opacity-50 w-full"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>
        </div>

        {/* Toggle Container */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-[0.6s] ease-in-out rounded-tl-[150px] rounded-bl-[100px] z-[1000] ${isSignUp ? '-translate-x-full rounded-tl-0 rounded-tr-[150px] rounded-br-[100px] rounded-bl-0' : ''}`}>
          <div className={`bg-gradient-to-r from-[#5c6bc0] to-[#512da8] h-full text-white relative -left-full w-[200%] transition-all duration-[0.6s] ease-in-out ${isSignUp ? 'translate-x-1/2' : 'translate-x-0'}`}>
            
            {/* Toggle Left Panel */}
            <div className={`absolute w-1/2 h-full flex items-center justify-center flex-col px-8 text-center top-0 transition-all duration-[0.6s] ease-in-out ${isSignUp ? 'translate-x-0' : '-translate-x-full'}`}>
              <h1 className="text-3xl font-semibold mb-4">Welcome Back!</h1>
              <p className="text-sm leading-5 tracking-wide my-5">
                Enter your personal details to use all site features
              </p>
              <button 
                type="button"
                onClick={toggleMode}
                className="bg-transparent border border-white text-white text-xs px-11 py-3 rounded-lg font-semibold tracking-wider uppercase cursor-pointer hover:bg-white hover:bg-opacity-10"
              >
                Sign In
              </button>
            </div>
            
            {/* Toggle Right Panel */}
            <div className={`absolute right-0 w-1/2 h-full flex items-center justify-center flex-col px-8 text-center top-0 transition-all duration-[0.6s] ease-in-out ${isSignUp ? 'translate-x-full' : 'translate-x-0'}`}>
              <h1 className="text-3xl font-semibold mb-4">Hello, Friend!</h1>
              <p className="text-sm leading-5 tracking-wide my-5">
                Register with your personal details to use all site features
              </p>
              <button 
                type="button"
                onClick={toggleMode}
                className="bg-transparent border border-white text-white text-xs px-11 py-3 rounded-lg font-semibold tracking-wider uppercase cursor-pointer hover:bg-white hover:bg-opacity-10"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
