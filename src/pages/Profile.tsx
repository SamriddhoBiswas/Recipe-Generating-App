import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    age: '',
    height_cm: '',
    weight_kg: '',
    dietary_goals: [] as string[],
  });
  const [preferences, setPreferences] = useState({
    food_preferences: [] as string[],
    allergies: [] as string[],
    deficiencies: [] as string[],
    cuisine_preferences: [] as string[],
  });

  const dietaryGoals = ['Weight Loss', 'Weight Gain', 'Muscle Building', 'Heart Health', 'Diabetes Management', 'General Health'];
  const foodPreferences = ['Vegetarian', 'Vegan', 'Non-Vegetarian', 'Gluten-free', 'Dairy-free', 'Keto', 'Low-carb', 'High-protein'];
  const allergies = ['Nuts', 'Shellfish', 'Eggs', 'Dairy', 'Soy', 'Gluten', 'Fish'];
  const deficiencies = ['Iron', 'Vitamin D', 'B12', 'Calcium', 'Omega-3', 'Protein'];
  const cuisines = ['Mediterranean', 'Asian', 'Mexican', 'Italian', 'Indian', 'American', 'Middle Eastern'];

  useEffect(() => {
    fetchProfile();
    fetchPreferences();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || user.email || '',
          age: data.age?.toString() || '',
          height_cm: data.height_cm?.toString() || '',
          weight_kg: data.weight_kg?.toString() || '',
          dietary_goals: data.dietary_goals || [],
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch profile",
        variant: "destructive",
      });
    }
  };

  const fetchPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setPreferences({
          food_preferences: data.food_preferences || [],
          allergies: data.allergies || [],
          deficiencies: data.deficiencies || [],
          cuisine_preferences: data.cuisine_preferences || [],
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch preferences",
        variant: "destructive",
      });
    }
  };

  const handleArrayChange = (arrayName: keyof typeof preferences | keyof typeof profile, value: string, checked: boolean) => {
    if (arrayName in preferences) {
      setPreferences(prev => ({
        ...prev,
        [arrayName]: checked 
          ? [...prev[arrayName as keyof typeof preferences], value]
          : prev[arrayName as keyof typeof preferences].filter((item: string) => item !== value)
      }));
    } else if (arrayName in profile) {
      setProfile(prev => ({
        ...prev,
        [arrayName]: checked 
          ? [...(prev[arrayName as keyof typeof profile] as string[]), value]
          : (prev[arrayName as keyof typeof profile] as string[]).filter((item: string) => item !== value)
      }));
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.full_name,
          email: profile.email,
          age: profile.age ? parseInt(profile.age) : null,
          height_cm: profile.height_cm ? parseInt(profile.height_cm) : null,
          weight_kg: profile.weight_kg ? parseInt(profile.weight_kg) : null,
          dietary_goals: profile.dietary_goals,
        });

      if (profileError) throw profileError;

      // Update preferences using the correct upsert with onConflict
      const { error: prefsError } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          food_preferences: preferences.food_preferences,
          allergies: preferences.allergies,
          deficiencies: preferences.deficiencies,
          cuisine_preferences: preferences.cuisine_preferences,
        }, {
          onConflict: 'user_id'
        });

      if (prefsError) throw prefsError;

      toast({
        title: "Profile Updated",
        description: "Your profile and preferences have been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold health-text-gradient mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your profile and dietary preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={profile.full_name}
                onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                disabled
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={profile.height_cm}
                  onChange={(e) => setProfile(prev => ({ ...prev, height_cm: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={profile.weight_kg}
                  onChange={(e) => setProfile(prev => ({ ...prev, weight_kg: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label>Dietary Goals</Label>
              <div className="grid grid-cols-2 gap-2">
                {dietaryGoals.map((goal) => (
                  <div key={goal} className="flex items-center space-x-2">
                    <Checkbox
                      id={goal}
                      checked={profile.dietary_goals.includes(goal)}
                      onCheckedChange={(checked) => 
                        handleArrayChange('dietary_goals', goal, checked as boolean)
                      }
                    />
                    <Label htmlFor={goal} className="text-sm">{goal}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dietary Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Dietary Preferences</CardTitle>
            <CardDescription>Customize your dietary preferences and restrictions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Food Preferences</Label>
              <div className="grid grid-cols-2 gap-2">
                {foodPreferences.map((pref) => (
                  <div key={pref} className="flex items-center space-x-2">
                    <Checkbox
                      id={pref}
                      checked={preferences.food_preferences.includes(pref)}
                      onCheckedChange={(checked) => 
                        handleArrayChange('food_preferences', pref, checked as boolean)
                      }
                    />
                    <Label htmlFor={pref} className="text-sm">{pref}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Allergies</Label>
              <div className="grid grid-cols-2 gap-2">
                {allergies.map((allergy) => (
                  <div key={allergy} className="flex items-center space-x-2">
                    <Checkbox
                      id={allergy}
                      checked={preferences.allergies.includes(allergy)}
                      onCheckedChange={(checked) => 
                        handleArrayChange('allergies', allergy, checked as boolean)
                      }
                    />
                    <Label htmlFor={allergy} className="text-sm">{allergy}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Nutritional Deficiencies</Label>
              <div className="grid grid-cols-2 gap-2">
                {deficiencies.map((def) => (
                  <div key={def} className="flex items-center space-x-2">
                    <Checkbox
                      id={def}
                      checked={preferences.deficiencies.includes(def)}
                      onCheckedChange={(checked) => 
                        handleArrayChange('deficiencies', def, checked as boolean)
                      }
                    />
                    <Label htmlFor={def} className="text-sm">{def}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Cuisine Preferences</Label>
              <div className="grid grid-cols-2 gap-2">
                {cuisines.map((cuisine) => (
                  <div key={cuisine} className="flex items-center space-x-2">
                    <Checkbox
                      id={cuisine}
                      checked={preferences.cuisine_preferences.includes(cuisine)}
                      onCheckedChange={(checked) => 
                        handleArrayChange('cuisine_preferences', cuisine, checked as boolean)
                      }
                    />
                    <Label htmlFor={cuisine} className="text-sm">{cuisine}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <Button onClick={saveProfile} disabled={loading} size="lg">
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Profile'}
        </Button>
      </div>
    </div>
  );
};

export default Profile;
