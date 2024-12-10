import React from 'react';
import { Button } from "@/components/ui/Button";
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Search, Bell, Settings, 
         Calendar, MessageSquare, Shield, Home, 
         BarChart2, Users, Package, Grid } from 'lucide-react';

const BlurredLanding = () => {
  const navigate = useNavigate()
  
  const navigateToAuth = () => {
    navigate('/auth')
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Top Navigation */}
      <nav className="w-full px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4285F4] to-[#6EA1FF] flex items-center justify-center shadow-md">
                <span className="text-2xl font-bold text-white font-sans" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>S</span>
            </div>
            <span className="text-2xl font-semibold text-[#1a1a1a]">Sought</span>
          </div>
          <div className="flex items-center gap-2">
            {[Search, Bell, Settings].map((Icon, i) => (
              <Button key={i} variant="ghost" size="icon" 
                      className="rounded-full hover:bg-[#f5f5f7] transition-colors">
                <Icon className="h-5 w-5 text-[#4a4a4a]" />
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="relative">
        {/* Blurred Mock Content */}
        <div className="filter blur-sm pointer-events-none">
          <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Analytics Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Analytics Overview</h3>
                <BarChart2 className="h-5 w-5 text-gray-500" />
              </div>
              <div className="h-40 bg-gray-100 rounded-lg"></div>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Recent Activity</h3>
                <Grid className="h-5 w-5 text-gray-500" />
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            </div>

            {/* Team Members Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Team Members</h3>
                <Users className="h-5 w-5 text-gray-500" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Centered Auth CTA */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/5">
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full mx-4 transform transition-all duration-200 hover:shadow-xl">
            <h2 className="text-2xl font-medium text-[#1a1a1a] mb-3">Welcome to Sought</h2>
            <p className="text-gray-600 mb-6">Sign in to access your dashboard and start managing your listings.</p>
            <Button 
              onClick={navigateToAuth}
              className="bg-[#4B5563] text-white px-8 py-3 rounded-xl font-medium
                       transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                       hover:bg-[#6B7280] flex items-center justify-center gap-2 w-full"
            >
              Sign In
              <ArrowRight className="h-5 w-5" />
            </Button>
            <p className="mt-4 text-sm text-gray-500">
              Don't have an account?{' '}
              <button 
                onClick={navigateToAuth}
                className="text-[#1a1a1a] font-medium hover:underline"
              >
                Create one now
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlurredLanding;