import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sprout, LogOut, LayoutDashboard, MessageSquare, CloudSun, HelpCircle, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    });
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: '🏠 Home', path: '/' },
    { label: '📊 Dashboard', path: '/dashboard' },
    { label: '🌤️ Weather', path: '/weather' },
    { label: '🔬 Crop Health', path: '/crop-health' },
    { label: '👥 Community', path: '/community' },
    { label: '❓ Q&A', path: '/queries' },
    { label: '🤖 AI Assistant', path: '/chatbot' },
    { label: '🌐 Network', path: '/network' }
  ];

  return (
    <nav className="border-b bg-card shadow-sm sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 font-bold text-xl text-primary cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Sprout className="w-5 h-5 text-primary-foreground" />
            </div>
            <span>Smart Farmer</span>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link to={item.path} key={item.path}>
                <Button 
                  variant={isActive(item.path) ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          {user && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>👤</span>
                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Farmer'}
                <span style={{ fontSize: '0.8rem' }}>▼</span>
              </button>

              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  minWidth: '200px',
                  zIndex: 50
                }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '600', color: '#1f2937' }}>
                      {user.user_metadata?.full_name || 'Farmer'}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                      {user.email}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/profile');
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      color: '#1f2937',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    ⚙️ Settings
                  </button>
                  
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      handleSignOut();
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'none',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      color: '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Click outside to close dropdown */}
          {showDropdown && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 40
              }}
              onClick={() => setShowDropdown(false)}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
