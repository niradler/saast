import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import { Button } from '../ui';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Settings, 
  LogOut, 
  MessageSquare,
  User,
  ChevronDown,
  Palette
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  sidebar?: ReactNode;
  className?: string;
}

export function Layout({ children, showSidebar = false, sidebar, className = '' }: LayoutProps) {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme, availableThemes, setThemeById } = useSettingsStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
      setIsThemeMenuOpen(false);
    };

    if (isUserMenuOpen || isThemeMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isUserMenuOpen, isThemeMenuOpen]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const handleThemeSelect = (themeId: string) => {
    setThemeById(themeId);
    setIsThemeMenuOpen(false);
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-950 ${className}`}>
      {/* Header */}
      <header className="glass border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side */}
            <div className="flex items-center">
              {showSidebar && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden mr-2 p-2"
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              )}
              
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                  Saast
                </span>
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Theme selector */}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsThemeMenuOpen(!isThemeMenuOpen);
                  }}
                  className="p-2 hidden sm:flex"
                  aria-label="Change theme"
                >
                  <Palette className="w-5 h-5" />
                </Button>

                {/* Theme dropdown */}
                {isThemeMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" />
                    <div className="absolute right-0 mt-2 w-48 glass-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                      <div className="py-2">
                        {availableThemes.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => handleThemeSelect(t.id)}
                            className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                              theme.id === t.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <div 
                              className="w-3 h-3 rounded-full mr-3"
                              style={{ backgroundColor: t.colors.primary }}
                            />
                            {t.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Quick theme toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2 sm:hidden"
                aria-label={theme.mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme.mode === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>

              {user ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }}
                    className="flex items-center space-x-2 p-2"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium max-w-24 truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-4 h-4 hidden sm:block" />
                  </Button>

                  {/* User dropdown menu */}
                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" />
                      <div className="absolute right-0 mt-2 w-56 glass-card border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                        <div className="py-1">
                          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {user.email}
                            </p>
                          </div>
                          
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4 mr-3" />
                            Profile & Settings
                          </Link>
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/auth/login">
                    <Button variant="ghost" size="sm" className="text-sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/auth/register">
                    <Button variant="primary" size="sm" className="text-sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        {showSidebar && sidebar && (
          <>
            {/* Mobile sidebar overlay */}
            {isMobileMenuOpen && (
              <div
                className="fixed inset-0 z-30 lg:hidden bg-gray-900/50 backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-hidden="true"
              />
            )}
            
            {/* Sidebar */}
            <aside className={`
              fixed inset-y-16 left-0 z-40 w-80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
              ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
              <div className="flex flex-col h-full glass-card border-r border-gray-200 dark:border-gray-800">
                {sidebar}
              </div>
            </aside>
          </>
        )}

        {/* Main content area */}
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}