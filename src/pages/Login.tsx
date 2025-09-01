import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, User, Lock, PenTool, Sparkles } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [animateElements, setAnimateElements] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animations after component mounts
    setTimeout(() => setAnimateElements(true), 100);
  }, []);

     const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setError('');
     setSuccess('');
     setLoading(true);

    console.log('Form submitted:', { isLogin, username, password });

    // Debug: Check if inputs are working
    console.log('Current state:', { username, password, isLogin });

    // Basic validation
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password.length < 3) {
      setError('Password must be at least 3 characters long');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Login logic
        const response = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('token', data.token);
          navigate('/'); // Redirect to main page
        } else {
          const errorData = await response.json();
          setError(errorData.error || 'Login failed');
        }
      } else {
        // Register logic
        const response = await fetch('http://localhost:3001/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

                 if (response.ok) {
           // Registration successful - show success message and switch to login
           setError('');
           setSuccess('Account created successfully! Please login with your credentials.');
           setIsLogin(true);
           setUsername('');
           setPassword('');
         } else {
          const errorData = await response.json();
          setError(errorData.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Gold Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-yellow-400 rounded-full opacity-60 animate-pulse`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/20 via-transparent to-yellow-400/20 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Floating Geometric Shapes */}
        <div className={`absolute top-20 left-20 w-32 h-32 border border-yellow-400/30 rotate-45 transition-all duration-1000 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} />
        <div className={`absolute bottom-20 right-20 w-24 h-24 border border-yellow-400/20 rounded-full transition-all duration-1000 delay-300 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} />
        <div className={`absolute top-1/2 left-10 w-16 h-16 border border-yellow-400/40 rotate-12 transition-all duration-1000 delay-500 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className={`w-full max-w-md transition-all duration-1000 ${animateElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-4 shadow-2xl shadow-yellow-400/25 animate-float">
              <PenTool className="w-10 h-10 text-black" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent mb-2">
              Feather Press
            </h1>
            <p className="text-gray-400 text-sm">Your Creative Writing Platform</p>
          </div>

          {/* Login Card */}
          <Card className="bg-black/80 backdrop-blur-xl border border-yellow-400/20 shadow-2xl shadow-yellow-400/10">
            <CardHeader className="text-center pb-6">
                             <CardTitle className="text-2xl font-bold text-white">
                 {isLogin ? 'Welcome Back' : 'Create Account'}
               </CardTitle>
              <CardDescription className="text-gray-400">
                {isLogin 
                  ? 'Sign in to your Feather Press account' 
                  : 'Join Feather Press and start blogging'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
                             <form onSubmit={handleSubmit} className="space-y-6">
                 {error && (
                   <Alert variant="destructive" className="bg-red-900/50 border-red-500/50">
                     <AlertDescription className="text-red-200">{error}</AlertDescription>
                   </Alert>
                 )}
                 {success && (
                   <Alert className="bg-green-900/50 border-green-500/50">
                     <AlertDescription className="text-green-200">{success}</AlertDescription>
                   </Alert>
                 )}

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-300">Username</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-4 w-4 text-yellow-400 group-focus-within:text-yellow-300 transition-colors" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-yellow-400/20 transition-all duration-300 relative z-10"
                      required
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 rounded-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-yellow-400 group-focus-within:text-yellow-300 transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-500 focus:border-yellow-400 focus:ring-yellow-400/20 transition-all duration-300 relative z-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-yellow-400 z-20"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 rounded-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold py-3 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-yellow-400/25" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4" />
                      <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    </div>
                  )}
                </Button>
              </form>

              <div className="relative">
                <Separator className="bg-gray-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black px-4">
                    <span className="text-gray-500 text-sm">or</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-400 mb-2">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </p>
                <Button
                  variant="link"
                  className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors duration-300"
                                     onClick={() => {
                     setIsLogin(!isLogin);
                     setError('');
                     setSuccess('');
                     setUsername('');
                     setPassword('');
                   }}
                >
                  {isLogin ? 'Create account below' : 'Sign in instead'}
                </Button>
              </div>

              {/* Test credentials info */}
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 rounded-lg border border-yellow-400/20">
                <p className="text-xs text-yellow-400 font-medium mb-2 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Test Credentials:
                </p>
                <p className="text-xs text-gray-400">Username: admin | Password: admin123</p>
                <p className="text-xs text-gray-400">Username: user | Password: password123</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50" />
    </div>
  );
};

export default Login;
