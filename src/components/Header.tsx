
import { Button } from "@/components/ui/button";
import { ChefHat, User, Home, Plus, LogOut, BookOpen } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState(location.pathname.substring(1) || "dashboard");

  const navigationItems = [
    { id: "generate", label: "Generate Recipe", icon: Plus, path: "/generate" },
    { id: "saved", label: "Saved Recipes", icon: BookOpen, path: "/saved" },
    { id: "profile", label: "Profile", icon: User, path: "/profile" },
  ];

  const handleNavigation = (item: any) => {
    setActiveTab(item.id);
    navigate(item.path);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-health-green-500 to-health-orange-500 rounded-lg flex items-center justify-center">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold health-text-gradient">FlavorAI</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`flex items-center space-x-2 ${
                    isActive 
                      ? "bg-health-green-500 hover:bg-health-green-600 text-white" 
                      : "text-gray-600 dark:text-gray-300 hover:text-health-green-600 hover:bg-health-green-50 dark:hover:bg-health-green-900/20"
                  }`}
                  onClick={() => handleNavigation(item)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="outline"
              className="text-health-orange-600 border-health-orange-300 hover:bg-health-orange-50 dark:hover:bg-health-orange-900/20"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex space-x-1 pb-3">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={`flex items-center space-x-1 ${
                  isActive 
                    ? "bg-health-green-500 hover:bg-health-green-600 text-white" 
                    : "text-gray-600 dark:text-gray-300 hover:text-health-green-600 hover:bg-health-green-50 dark:hover:bg-health-green-900/20"
                }`}
                onClick={() => handleNavigation(item)}
              >
                <Icon className="h-3 w-3" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;
