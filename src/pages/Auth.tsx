
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
    setEmail('');
    setPassword('');
    setFullName('');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        
        .auth-container {
          font-family: 'Montserrat', sans-serif;
          background: linear-gradient(to right, #e2e2e2, #c9d6ff);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .auth-wrapper {
          background-color: #fff;
          border-radius: 30px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.35);
          position: relative;
          overflow: hidden;
          width: 768px;
          max-width: 100%;
          min-height: 480px;
        }
        
        .auth-wrapper.active .sign-in-form {
          transform: translateX(100%);
        }
        
        .auth-wrapper.active .sign-up-form {
          transform: translateX(100%);
          opacity: 1;
          z-index: 5;
          animation: move 0.6s;
        }
        
        @keyframes move {
          0%, 49.99% {
            opacity: 0;
            z-index: 1;
          }
          50%, 100% {
            opacity: 1;
            z-index: 5;
          }
        }
        
        .form-container {
          position: absolute;
          top: 0;
          height: 100%;
          transition: all 0.6s ease-in-out;
        }
        
        .sign-in-form {
          left: 0;
          width: 50%;
          z-index: 2;
        }
        
        .sign-up-form {
          left: 0;
          width: 50%;
          opacity: 0;
          z-index: 1;
        }
        
        .auth-form {
          background-color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 40px;
          height: 100%;
        }
        
        .auth-input {
          background-color: #eee;
          border: none;
          margin: 8px 0;
          padding: 10px 15px;
          font-size: 13px;
          border-radius: 8px;
          width: 100%;
          outline: none;
        }
        
        .auth-button {
          background-color: #512da8;
          color: #fff;
          font-size: 12px;
          padding: 10px 45px;
          border: 1px solid transparent;
          border-radius: 8px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-top: 10px;
          cursor: pointer;
          width: 100%;
        }
        
        .auth-button:hover {
          background-color: #4527a0;
        }
        
        .auth-button.hidden {
          background-color: transparent;
          border-color: #fff;
        }
        
        .auth-button.hidden:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .toggle-container {
          position: absolute;
          top: 0;
          left: 50%;
          width: 50%;
          height: 100%;
          overflow: hidden;
          transition: all 0.6s ease-in-out;
          border-radius: 150px 0 0 100px;
          z-index: 1000;
        }
        
        .auth-wrapper.active .toggle-container {
          transform: translateX(-100%);
          border-radius: 0 150px 100px 0;
        }
        
        .toggle {
          background: linear-gradient(to right, #5c6bc0, #512da8);
          height: 100%;
          color: #fff;
          position: relative;
          left: -100%;
          width: 200%;
          transform: translateX(0);
          transition: all 0.6s ease-in-out;
        }
        
        .auth-wrapper.active .toggle {
          transform: translateX(50%);
        }
        
        .toggle-panel {
          position: absolute;
          width: 50%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 30px;
          text-align: center;
          top: 0;
          transform: translateX(0);
          transition: all 0.6s ease-in-out;
        }
        
        .toggle-left {
          transform: translateX(-200%);
        }
        
        .auth-wrapper.active .toggle-left {
          transform: translateX(0);
        }
        
        .toggle-right {
          right: 0;
          transform: translateX(0);
        }
        
        .auth-wrapper.active .toggle-right {
          transform: translateX(200%);
        }
        
        .auth-title {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 20px;
          color: #333;
        }
        
        .auth-subtitle {
          font-size: 12px;
          color: #666;
          margin: 20px 0;
        }
        
        .auth-link {
          color: #333;
          font-size: 13px;
          text-decoration: none;
          margin: 15px 0 10px;
        }
        
        .brand-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #10b981, #f59e0b);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
      `}</style>
      
      <div className="auth-container">
        <div className={`auth-wrapper ${isSignUp ? 'active' : ''}`}>
          {/* Sign In Form */}
          <div className="form-container sign-in-form">
            <form onSubmit={handleSignIn} className="auth-form">
              <div className="brand-icon">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <h1 className="auth-title">Sign In</h1>
              <span className="auth-subtitle">Use your email and password</span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
              />
              <a href="#" className="auth-link">Forgot Your Password?</a>
              <button 
                type="submit" 
                disabled={loading}
                className="auth-button"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          {/* Sign Up Form */}
          <div className="form-container sign-up-form">
            <form onSubmit={handleSignUp} className="auth-form">
              <div className="brand-icon">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <h1 className="auth-title">Create Account</h1>
              <span className="auth-subtitle">Use your email for registration</span>
              <input
                type="text"
                placeholder="Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="auth-input"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="auth-input"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="auth-input"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="auth-button"
              >
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
            </form>
          </div>

          {/* Toggle Container */}
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
                <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '16px' }}>Welcome Back!</h1>
                <p style={{ fontSize: '14px', lineHeight: '20px', letterSpacing: '0.3px', margin: '20px 0' }}>
                  Enter your personal details to use all site features
                </p>
                <button 
                  type="button"
                  onClick={toggleMode}
                  className="auth-button hidden"
                >
                  Sign In
                </button>
              </div>
              <div className="toggle-panel toggle-right">
                <h1 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '16px' }}>Hello, Friend!</h1>
                <p style={{ fontSize: '14px', lineHeight: '20px', letterSpacing: '0.3px', margin: '20px 0' }}>
                  Register with your personal details to use all site features
                </p>
                <button 
                  type="button"
                  onClick={toggleMode}
                  className="auth-button hidden"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
