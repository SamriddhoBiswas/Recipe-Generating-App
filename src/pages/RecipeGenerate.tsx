import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChefHat, Clock, Users, Star, Save, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BackButton from '@/components/BackButton';

interface GeneratedRecipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  cookTime: string;
  servings: string;
  difficulty: string;
  cuisine: string;
  nutritionalInfo?: Record<string, string>;
  tags?: string[];
  youtubeLink?: string;
}

const RecipeGenerate = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    cuisine: '',
    difficulty: '',
    cookTime: '',
    servings: '',
    dietaryRestrictions: [] as string[],
    ingredients: '',
    mealType: '',
  });
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const cuisineOptions = ['Italian', 'Chinese', 'Mexican', 'Indian', 'Japanese', 'Mediterranean', 'American', 'Thai', 'French', 'Korean'];
  const difficultyOptions = ['Easy', 'Medium', 'Hard'];
  const cookTimeOptions = ['15 minutes', '30 minutes', '45 minutes', '1 hour', '1+ hours'];
  const servingsOptions = ['1-2', '3-4', '5-6', '7+'];
  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-free', 'Dairy-free', 'Keto', 'Low-carb', 'High-protein'];
  const mealTypeOptions = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];

  const handlePreferenceChange = (key: string, value: string | string[]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleDietaryRestrictionChange = (restriction: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      dietaryRestrictions: checked
        ? [...prev.dietaryRestrictions, restriction]
        : prev.dietaryRestrictions.filter(r => r !== restriction)
    }));
  };

  const generateRecipe = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-recipe-with-gemini', {
        body: {
          preferences,
          userId: user.id
        }
      });

      if (error) throw error;

      setGeneratedRecipe(data.recipe);
      toast({
        title: "Recipe Generated!",
        description: "Your personalized recipe is ready.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate recipe",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async () => {
    if (!generatedRecipe || !user) return;
    
    setSaving(true);
    try {
      // Convert servings string to number for database
      const servingsNumber = generatedRecipe.servings.includes('-') 
        ? parseInt(generatedRecipe.servings.split('-')[1]) 
        : parseInt(generatedRecipe.servings.replace('+', ''));

      const { error } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          title: generatedRecipe.title,
          ingredients: generatedRecipe.ingredients,
          instructions: generatedRecipe.instructions,
          cook_time: generatedRecipe.cookTime,
          servings: servingsNumber,
          difficulty: generatedRecipe.difficulty,
          cuisine: generatedRecipe.cuisine,
          nutritional_info: generatedRecipe.nutritionalInfo,
          tags: generatedRecipe.tags,
          youtube_link: generatedRecipe.youtubeLink,
        });

      if (error) throw error;

      toast({
        title: "Recipe Saved!",
        description: "Recipe has been added to your collection.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <BackButton />
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold health-text-gradient mb-2">Generate Recipe</h1>
        <p className="text-gray-600 dark:text-gray-300">Create a personalized healthy recipe based on your preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recipe Generation Form */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <ChefHat className="h-5 w-5" />
              Recipe Preferences
            </CardTitle>
            <CardDescription className="dark:text-gray-300">Customize your recipe generation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="dark:text-white">Cuisine Type</Label>
                <Select value={preferences.cuisine} onValueChange={(value) => handlePreferenceChange('cuisine', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cuisine" />
                  </SelectTrigger>
                  <SelectContent>
                    {cuisineOptions.map(cuisine => (
                      <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className="dark:text-white">Meal Type</Label>
                <Select value={preferences.mealType} onValueChange={(value) => handlePreferenceChange('mealType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    {mealTypeOptions.map(meal => (
                      <SelectItem key={meal} value={meal}>{meal}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="dark:text-white">Difficulty</Label>
                <Select value={preferences.difficulty} onValueChange={(value) => handlePreferenceChange('difficulty', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficultyOptions.map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="dark:text-white">Cook Time</Label>
                <Select value={preferences.cookTime} onValueChange={(value) => handlePreferenceChange('cookTime', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {cookTimeOptions.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="dark:text-white">Servings</Label>
                <Select value={preferences.servings} onValueChange={(value) => handlePreferenceChange('servings', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {servingsOptions.map(serving => (
                      <SelectItem key={serving} value={serving}>{serving}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="dark:text-white">Dietary Restrictions</Label>
              <div className="grid grid-cols-2 gap-2">
                {dietaryOptions.map(option => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={preferences.dietaryRestrictions.includes(option)}
                      onCheckedChange={(checked) => handleDietaryRestrictionChange(option, checked as boolean)}
                    />
                    <Label htmlFor={option} className="text-sm dark:text-white">{option}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="dark:text-white">Specific Ingredients (optional)</Label>
              <Textarea
                placeholder="List any specific ingredients you want to include..."
                value={preferences.ingredients}
                onChange={(e) => handlePreferenceChange('ingredients', e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              onClick={generateRecipe} 
              disabled={loading || !preferences.cuisine}
              className="w-full bg-health-green-600 hover:bg-health-green-700"
            >
              {loading ? 'Generating...' : 'Generate Recipe'}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Recipe Display */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="dark:text-white">Generated Recipe</CardTitle>
            <CardDescription className="dark:text-gray-300">Your personalized healthy recipe</CardDescription>
          </CardHeader>
          <CardContent>
            {!generatedRecipe ? (
              <div className="text-center py-12">
                <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Generate a recipe to see it here</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">{generatedRecipe.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {generatedRecipe.cookTime}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {generatedRecipe.servings}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {generatedRecipe.difficulty}
                    </Badge>
                  </div>
                  {generatedRecipe.tags && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {generatedRecipe.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-2 dark:text-white">Ingredients</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    {generatedRecipe.ingredients?.map((ingredient: string, index: number) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 dark:text-white">Instructions</h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    {generatedRecipe.instructions?.map((instruction: string, index: number) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>

                {generatedRecipe.nutritionalInfo && (
                  <div>
                    <h4 className="font-semibold mb-2 dark:text-white">Nutritional Information (per serving)</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                      {Object.entries(generatedRecipe.nutritionalInfo).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key}:</span>
                          <span>{value as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {generatedRecipe.youtubeLink && (
                  <Button
                    variant="outline"
                    asChild
                    className="w-full"
                  >
                    <a href={generatedRecipe.youtubeLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Watch Tutorial on YouTube
                    </a>
                  </Button>
                )}

                <Button 
                  onClick={saveRecipe} 
                  disabled={saving}
                  className="w-full bg-health-orange-600 hover:bg-health-orange-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Recipe'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecipeGenerate;
