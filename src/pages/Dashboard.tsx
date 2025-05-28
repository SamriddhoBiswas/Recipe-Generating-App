import Header from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";
import UserPreferences from "@/components/UserPreferences";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Clock, Users, Star, Plus, BookOpen, TrendingUp, Target, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [recentRecipes, setRecentRecipes] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRecipes: 0,
    thisWeek: 0,
    avgCookTime: 0,
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPreferences();
      fetchRecentRecipes();
      fetchStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(data);
    } catch (error) {
      console.log('Profile not found, will be created on first save');
    }
  };

  const fetchPreferences = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      setPreferences(data);
    } catch (error) {
      console.log('Preferences not found, will be created on first save');
    }
  };

  const fetchRecentRecipes = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);
      
      setRecentRecipes(data || []);
    } catch (error) {
      console.log('Error fetching recipes:', error);
    }
  };

  const fetchStats = async () => {
    if (!user) return;
    
    try {
      const { data: allRecipes } = await supabase
        .from('recipes')
        .select('cook_time, created_at')
        .eq('user_id', user.id);
      
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const thisWeekRecipes = allRecipes?.filter(recipe => 
        new Date(recipe.created_at) > weekAgo
      ) || [];
      
      setStats({
        totalRecipes: allRecipes?.length || 0,
        thisWeek: thisWeekRecipes.length,
        avgCookTime: 30, // Mock average for now
      });
    } catch (error) {
      console.log('Error fetching stats:', error);
    }
  };

  const quickActionCards = [
    {
      title: "Generate New Recipe",
      description: "Get a personalized healthy recipe based on your preferences",
      icon: Plus,
      action: () => navigate("/generate"),
      color: "bg-health-green-500 hover:bg-health-green-600",
    },
    {
      title: "View Saved Recipes",
      description: "Browse your collection of saved recipes",
      icon: BookOpen,
      action: () => navigate("/saved"),
      color: "bg-health-orange-500 hover:bg-health-orange-600",
    },
    {
      title: "Update Profile",
      description: "Manage your dietary preferences and goals",
      icon: Users,
      action: () => navigate("/profile"),
      color: "bg-blue-500 hover:bg-blue-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold health-text-gradient mb-2">
            Welcome back{profile?.full_name ? `, ${profile.full_name}` : ''}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Ready to discover some healthy and delicious recipes today?
          </p>
        </div>

        {/* Profile Summary Cards */}
        {(profile?.dietary_goals?.length > 0 || preferences?.food_preferences?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {profile?.dietary_goals?.length > 0 && (
              <Card className="dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-white">Your Goals</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {profile.dietary_goals.slice(0, 3).map((goal: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {goal}
                      </Badge>
                    ))}
                    {profile.dietary_goals.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{profile.dietary_goals.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {preferences?.food_preferences?.length > 0 && (
              <Card className="dark:bg-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium dark:text-white">Food Preferences</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {preferences.food_preferences.slice(0, 3).map((pref: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {pref}
                      </Badge>
                    ))}
                    {preferences.food_preferences.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{preferences.food_preferences.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Total Recipes</CardTitle>
              <ChefHat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{stats.totalRecipes}</div>
              <p className="text-xs text-muted-foreground">
                Your recipe collection
              </p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{stats.thisWeek}</div>
              <p className="text-xs text-muted-foreground">
                New recipes generated
              </p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium dark:text-white">Avg Cook Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold dark:text-white">{stats.avgCookTime}m</div>
              <p className="text-xs text-muted-foreground">
                Your preferred duration
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActionCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow dark:bg-gray-800" onClick={card.action}>
                  <CardHeader>
                    <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg dark:text-white">{card.title}</CardTitle>
                    <CardDescription className="dark:text-gray-300">{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Recipes */}
        {recentRecipes.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold dark:text-white">Recent Recipes</h2>
              <Button variant="ghost" onClick={() => navigate("/saved")}>
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentRecipes.map((recipe) => (
                <Card key={recipe.id} className="dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg dark:text-white">{recipe.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {recipe.cook_time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {recipe.servings}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {recipe.difficulty}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recipe.tags && recipe.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {recipe.tags.slice(0, 3).map((tag: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Show setup prompt if no profile data */}
        {!profile?.dietary_goals?.length && !preferences?.food_preferences?.length && (
          <Card className="bg-gradient-to-r from-health-green-50 to-health-orange-50 dark:from-health-green-900/20 dark:to-health-orange-900/20 border-health-green-200 dark:border-health-green-700">
            <CardHeader>
              <CardTitle className="text-health-green-700 dark:text-health-green-300">Complete Your Profile</CardTitle>
              <CardDescription className="text-health-green-600 dark:text-health-green-400">
                Set up your dietary goals and preferences to get personalized recipe recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/profile")} className="bg-health-green-600 hover:bg-health-green-700">
                Set Up Profile
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
