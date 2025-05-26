
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Sparkles, TrendingUp, Clock, Star } from "lucide-react";
import Header from "@/components/Header";
import RecipeCard from "@/components/RecipeCard";
import UserPreferences from "@/components/UserPreferences";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock saved recipes data - this will come from Supabase later
  const savedRecipes = [
    {
      id: "1",
      title: "Vegan Quinoa Bowl",
      cuisine: "Mediterranean",
      cookTime: "25 min",
      servings: 2,
      difficulty: "Easy",
      tags: ["Vegan", "High Protein", "Gluten-Free", "Iron-Rich"]
    },
    {
      id: "2",
      title: "Gluten-Free Chicken Curry",
      cuisine: "Indian",
      cookTime: "35 min",
      servings: 4,
      difficulty: "Medium",
      tags: ["Gluten-Free", "High Protein", "Anti-Inflammatory"]
    },
    {
      id: "3",
      title: "Iron-Rich Spinach Pasta",
      cuisine: "Italian",
      cookTime: "20 min",
      servings: 3,
      difficulty: "Easy",
      tags: ["Iron-Rich", "Vegetarian", "Quick Meal"]
    }
  ];

  const filteredRecipes = savedRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-health-green-500 to-health-orange-500 rounded-xl p-6 text-white">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Ready to Create Something Delicious?</h2>
                  <p className="text-green-100">Generate personalized recipes tailored to your health goals and preferences.</p>
                </div>
                <Button 
                  size="lg"
                  className="bg-white text-health-green-600 hover:bg-gray-100 font-semibold"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Recipe
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-health-green-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-health-green-100 rounded-lg">
                      <Star className="h-6 w-6 text-health-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-health-green-600">{savedRecipes.length}</p>
                      <p className="text-sm text-gray-600">Saved Recipes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-health-orange-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-health-orange-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-health-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-health-orange-600">12</p>
                      <p className="text-sm text-gray-600">Recipes This Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Clock className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-700">45</p>
                      <p className="text-sm text-gray-600">Minutes Saved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Saved Recipes Section */}
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                <h3 className="text-2xl font-bold text-gray-800">Your Saved Recipes</h3>
                <div className="flex items-center space-x-3 w-full md:w-auto">
                  <div className="relative flex-1 md:flex-initial">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search recipes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-full md:w-64 border-gray-300 focus:border-health-green-500"
                    />
                  </div>
                  <Button 
                    variant="outline"
                    className="text-health-green-600 border-health-green-300 hover:bg-health-green-50"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Recipe
                  </Button>
                </div>
              </div>

              {/* Recipe Grid */}
              {filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredRecipes.map((recipe) => (
                    <RecipeCard key={recipe.id} recipe={recipe} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center border-dashed border-2 border-gray-300">
                  <div className="text-6xl mb-4">🍽️</div>
                  <h4 className="text-lg font-semibold text-gray-600 mb-2">No recipes found</h4>
                  <p className="text-gray-500 mb-4">
                    {searchQuery ? "Try adjusting your search terms" : "Start by generating your first recipe!"}
                  </p>
                  <Button className="bg-health-green-500 hover:bg-health-green-600">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Your First Recipe
                  </Button>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <UserPreferences />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
