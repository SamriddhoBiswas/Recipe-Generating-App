import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ChefHat, Clock, Users, Star, BookmarkPlus, Youtube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import BackButton from '@/components/BackButton';

const RecipeGenerate = () => {
  const [preferences, setPreferences] = useState({
    cuisine: '',
    cookTime: '',
    servings: '',
    difficulty: '',
    ingredients: '',
    dietaryRestrictions: [] as string[],
  });
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userPreferences, setUserPreferences] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Non-Vegetarian', 'Gluten-free', 'Dairy-free', 'Keto', 
    'Low-carb', 'High-protein', 'Low-sodium', 'Sugar-free'
  ];

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Fetch user preferences
      const { data: preferencesData } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setUserProfile(profileData);
      setUserPreferences(preferencesData);
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  };

  const handleDietaryChange = (option: string, checked: boolean) => {
    if (checked) {
      setPreferences(prev => ({
        ...prev,
        dietaryRestrictions: [...prev.dietaryRestrictions, option]
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        dietaryRestrictions: prev.dietaryRestrictions.filter(item => item !== option)
      }));
    }
  };

  const generateRecipe = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-recipe-with-gemini', {
        body: {
          preferences,
          userProfile: {
            dietary_goals: userProfile?.dietary_goals,
            food_preferences: userPreferences?.food_preferences,
            allergies: userPreferences?.allergies,
            deficiencies: userPreferences?.deficiencies,
          }
        }
      });

      if (error) throw error;

      setGeneratedRecipe(data.recipe);
      toast({
        title: "Recipe Generated!",
        description: "Your personalized recipe is ready!",
      });
    } catch (error: any) {
      console.error('Recipe generation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate recipe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async () => {
    if (!generatedRecipe || !user) return;

    try {
      const { error } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          title: generatedRecipe.title,
          cuisine: generatedRecipe.cuisine,
          cook_time: generatedRecipe.cookTime,
          servings: generatedRecipe.servings,
          difficulty: generatedRecipe.difficulty,
          ingredients: generatedRecipe.ingredients,
          instructions: generatedRecipe.instructions,
          nutritional_info: generatedRecipe.nutritionalInfo,
          youtube_link: generatedRecipe.youtubeLink,
          tags: generatedRecipe.tags,
        });

      if (error) throw error;

      toast({
        title: "Recipe Saved!",
        description: "Recipe has been saved to your collection.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <BackButton />
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold health-text-gradient mb-2">Generate Your Perfect Recipe</h1>
          <p className="text-gray-600">Tell us your preferences and we'll create a personalized healthy recipe for you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preferences Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="h-5 w-5" />
                Recipe Preferences
              </CardTitle>
              <CardDescription>Customize your recipe based on your needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cuisine">Cuisine Type</Label>
                  <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, cuisine: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cuisine" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mediterranean">Mediterranean</SelectItem>
                      <SelectItem value="asian">Asian</SelectItem>
                      <SelectItem value="mexican">Mexican</SelectItem>
                      <SelectItem value="italian">Italian</SelectItem>
                      <SelectItem value="indian">Indian</SelectItem>
                      <SelectItem value="american">American</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cookTime">Cook Time</Label>
                  <Select onValueChange={(value) => setPreferences(prev => ({ ...prev, cookTime: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15 minutes">15 minutes</SelectItem>
                      <SelectItem value="30 minutes">30 minutes</SelectItem>
                      <SelectItem value="45 minutes">45 minutes</SelectItem>
                      <SelectItem value="1 hour">1 hour</SelectItem>
                      <SelectItem value="2+ hours">2+ hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="servings">Servings</Label>
                  <Input
                    id="servings"
                    type="number"
                    placeholder="e.g., 4"
                    value={preferences.servings}
                    onChange={(e) => setPreferences(prev => ({ ...prev, servings: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ingredients">Specific Ingredients (optional)</Label>
                <Textarea
                  id="ingredients"
                  placeholder="e.g., chicken, quinoa, avocado..."
                  value={preferences.ingredients}
                  onChange={(e) => setPreferences(prev => ({ ...prev, ingredients: e.target.value }))}
                />
              </div>

              <div className="space-y-3">
                <Label>Dietary Restrictions</Label>
                <div className="grid grid-cols-2 gap-2">
                  {dietaryOptions.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={option}
                        checked={preferences.dietaryRestrictions.includes(option)}
                        onCheckedChange={(checked) => handleDietaryChange(option, checked as boolean)}
                      />
                      <Label htmlFor={option} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={generateRecipe} disabled={loading} className="w-full">
                {loading ? 'Generating...' : 'Generate Recipe with AI'}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Recipe */}
          {generatedRecipe && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{generatedRecipe.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {generatedRecipe.cookTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {generatedRecipe.servings} servings
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {generatedRecipe.difficulty}
                      </span>
                    </CardDescription>
                  </div>
                  <Button onClick={saveRecipe} variant="outline" size="sm">
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {generatedRecipe.youtubeLink && (
                  <div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(generatedRecipe.youtubeLink, '_blank')}
                    >
                      <Youtube className="h-4 w-4 mr-2" />
                      Watch Tutorial on YouTube
                    </Button>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">Ingredients</h3>
                  <ul className="space-y-1">
                    {generatedRecipe.ingredients?.map((ingredient: string, index: number) => (
                      <li key={index} className="text-sm">• {ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Instructions</h3>
                  <ol className="space-y-2">
                    {generatedRecipe.instructions?.map((step: string, index: number) => (
                      <li key={index} className="text-sm">
                        <span className="font-medium">{index + 1}.</span> {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {generatedRecipe.nutritionalInfo && (
                  <div>
                    <h3 className="font-semibold mb-2">Nutrition (per serving)</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Calories: {generatedRecipe.nutritionalInfo.calories}</div>
                      <div>Protein: {generatedRecipe.nutritionalInfo.protein}</div>
                      <div>Carbs: {generatedRecipe.nutritionalInfo.carbs}</div>
                      <div>Fat: {generatedRecipe.nutritionalInfo.fat}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeGenerate;
