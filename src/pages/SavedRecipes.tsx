import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, Users, Star, Search, Trash2, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import BackButton from '@/components/BackButton';
import { Recipe } from '@/types/recipe';

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchRecipes();
  }, [user]);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchTerm]);

  const fetchRecipes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match our Recipe type
      const transformedRecipes: Recipe[] = (data || []).map(recipe => ({
        ...recipe,
        ingredients: Array.isArray(recipe.ingredients) 
          ? recipe.ingredients.filter((item): item is string => typeof item === 'string')
          : [],
        instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
        tags: Array.isArray(recipe.tags) ? recipe.tags : [],
        nutritional_info: recipe.nutritional_info ? recipe.nutritional_info as Recipe['nutritional_info'] : null,
      }));

      setRecipes(transformedRecipes);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch recipes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    if (!searchTerm) {
      setFilteredRecipes(recipes);
      return;
    }

    const filtered = recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.cuisine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredRecipes(filtered);
  };

  const deleteRecipe = async (recipeId: string) => {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId);

      if (error) throw error;

      setRecipes(prev => prev.filter(recipe => recipe.id !== recipeId));
      toast({
        title: "Recipe Deleted",
        description: "Recipe has been removed from your collection.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-health-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton />
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold health-text-gradient mb-2">Saved Recipes</h1>
          <p className="text-gray-600 dark:text-gray-300">Your collection of healthy recipes</p>
        </div>

        {/* Search */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Recipes Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {recipes.length === 0 ? "No saved recipes yet. Start by generating your first recipe!" : "No recipes match your search."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="hover:shadow-lg transition-shadow dark:bg-gray-800">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-2 dark:text-white">{recipe.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        {recipe.cook_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {recipe.cook_time}
                          </span>
                        )}
                        {recipe.servings && (
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {recipe.servings}
                          </span>
                        )}
                        {recipe.difficulty && (
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4" />
                            {recipe.difficulty}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteRecipe(recipe.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recipe.ingredients && recipe.ingredients.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 dark:text-white">Key Ingredients</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                        {recipe.ingredients.slice(0, 3).join(', ')}
                        {recipe.ingredients.length > 3 && '...'}
                      </p>
                    </div>
                  )}

                  {recipe.nutritional_info && (
                    <div>
                      <h4 className="font-semibold text-sm mb-2 dark:text-white">Nutrition (per serving)</h4>
                      <div className="grid grid-cols-2 gap-1 text-xs text-gray-600 dark:text-gray-300">
                        {recipe.nutritional_info.calories && (
                          <div>Calories: {recipe.nutritional_info.calories}</div>
                        )}
                        {recipe.nutritional_info.protein && (
                          <div>Protein: {recipe.nutritional_info.protein}</div>
                        )}
                      </div>
                    </div>
                  )}

                  {recipe.tags && recipe.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {recipe.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {recipe.youtube_link && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="w-full"
                    >
                      <a href={recipe.youtube_link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Watch Video
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default SavedRecipes;
