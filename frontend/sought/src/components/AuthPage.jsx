import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mail, Lock, User, Search, Bell, Settings, 
         Calendar, MessageSquare, Shield, Home } from 'lucide-react';

const TopNav = () => (
  <div className="w-full flex items-center justify-between mb-6 px-4">
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#f5f5f7] transition-colors">
        <ArrowLeft className="h-5 w-5" />
      </Button>
    </div>
    <div className="flex items-center gap-2">
      {[Home, Calendar, MessageSquare, Shield, Settings].map((Icon, i) => (
        <Button key={i} variant="ghost" size="icon" 
                className="rounded-full hover:bg-[#f5f5f7] transition-colors">
          <Icon className="h-5 w-5 text-[#4a4a4a]" />
        </Button>
      ))}
      <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#f5f5f7] transition-colors">
        <Search className="h-5 w-5 text-[#4a4a4a]" />
      </Button>
      <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#f5f5f7] transition-colors">
        <Bell className="h-5 w-5 text-[#4a4a4a]" />
      </Button>
    </div>
  </div>
);


const AuthPage = () => {
    const navigate = useNavigate();
    const [isSignIn, setIsSignIn] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
  
    // Keep this handleSubmit inside the component
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
      
        const endpoint = isSignIn 
            ? '/api/login'   
            : '/api/signup'; 
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
              ...(isSignIn ? {} : { username }),
            }),
          });
      
          const data = await response.json();
      
          if (!response.ok) {
            // Use the error message from the API response
            throw new Error(data.error || data.message || 'Something went wrong');
          }
      
          // Store the token if returned
          if (data.uid) {
            localStorage.setItem('uid', data.uid);
          }
      
          // Navigate to home page on success
          navigate('/home', { state: { uid: data.uid } });
      
        } catch (err) {
          setError(err.message || 'An error occurred. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center p-4">
      <TopNav />
      
      <div className="flex items-center space-x-3 mb-12"> {/* Added mb-12 here */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4285F4] to-[#6EA1FF] flex items-center justify-center shadow-md">
            <span className="text-2xl font-bold text-white font-sans" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>S</span>
        </div>
        <span className="text-2xl font-semibold text-[#1a1a1a]">Sought</span>
    </div>
      
      <Card className="w-full max-w-md bg-white rounded-2xl shadow-sm border-0 transition-all duration-200 hover:shadow-md">
        <CardHeader className="px-6 pt-6 pb-0">
          <Tabs defaultValue="signin" className="w-full" onValueChange={(value) => setIsSignIn(value === 'signin')}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger 
                value="signin" 
                className="rounded-lg data-[state=active]:bg-[#374151] data-[state=active]:text-white transition-all"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="rounded-lg data-[state=active]:bg-[#374151] data-[state=active]:text-white transition-all"
              >
                Create Account
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="px-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isSignIn && (
              <div className="space-y-2">
                <label className="text-sm text-[#4a4a4a] font-medium">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#4a4a4a]" />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-11 pl-11 rounded-xl bg-[#f5f5f7] border-0 focus:ring-2 focus:ring-[#2d2d2d] transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm text-[#4a4a4a] font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#4a4a4a]" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-11 rounded-xl bg-[#f5f5f7] border-0 focus:ring-2 focus:ring-[#2d2d2d] transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#4a4a4a] font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#4a4a4a]" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pl-11 rounded-xl bg-[#f5f5f7] border-0 focus:ring-2 focus:ring-[#2d2d2d] transition-all"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            <>
                {error && (
                    <div className="text-red-500 text-sm mb-4 text-center">
                    {error}
                    </div>
                )}
                <Button 
                    type="submit" 
                    className="w-full h-11 mt-6 bg-[#4B5563] hover:bg-[#6B7280] text-white rounded-xl font-medium
                            transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    disabled={isLoading}
                >
                    {isLoading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </span>
                    ) : (
                    isSignIn ? 'Sign In' : 'Create Account'
                    )}
                </Button>
            </>
            
            <div className="pt-4 text-center">
              <button
                type="button"
                className="text-sm text-[#4a4a4a] hover:text-[#2d2d2d] transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;