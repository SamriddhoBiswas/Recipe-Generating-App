
import { Button } from "@/components/ui/button";
import { ChefHat, User, Home, Plus, LogOut } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "generate", label: "Generate Recipe", icon: Plus },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-health-green-500 to-health-orange-500 rounded-lg flex items-center justify-center">
              <ChefHat className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold health-text-gradient">HealthyEats</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className={`flex items-center space-x-2 ${
                    activeTab === item.id 
                      ? "bg-health-green-500 hover:bg-health-green-600 text-white" 
                      : "text-gray-600 hover:text-health-green-600 hover:bg-health-green-50"
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="text-health-orange-600 border-health-orange-300 hover:bg-health-orange-50"
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
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                size="sm"
                className={`flex items-center space-x-1 ${
                  activeTab === item.id 
                    ? "bg-health-green-500 hover:bg-health-green-600 text-white" 
                    : "text-gray-600 hover:text-health-green-600 hover:bg-health-green-50"
                }`}
                onClick={() => setActiveTab(item.id)}
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
