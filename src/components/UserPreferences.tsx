
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Target, AlertTriangle, Heart, Edit } from "lucide-react";

const UserPreferences = () => {
  // Mock user data - this will come from Supabase later
  const userPreferences = {
    name: "Sarah Johnson",
    dietaryGoals: ["Weight Loss", "Muscle Gain", "Better Energy"],
    allergies: ["Nuts", "Dairy"],
    deficiencies: ["Iron", "Vitamin D"],
    cuisinePreferences: ["Mediterranean", "Asian", "Mexican"],
    foodPreferences: ["Vegetarian", "Low Carb", "High Protein"]
  };

  return (
    <div className="space-y-4">
      {/* User Info */}
      <Card className="border-health-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-health-green-700">
            <User className="h-5 w-5" />
            <span>Welcome Back!</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium text-gray-800">{userPreferences.name}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 text-health-orange-600 hover:text-health-orange-700 hover:bg-health-orange-50 p-0"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* Dietary Goals */}
      <Card className="border-health-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-health-green-700">
            <Target className="h-5 w-5" />
            <span>Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {userPreferences.dietaryGoals.map((goal, index) => (
              <Badge 
                key={index} 
                className="bg-health-green-100 text-health-green-700 hover:bg-health-green-200"
              >
                {goal}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Allergies & Deficiencies */}
      <Card className="border-health-orange-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-health-orange-700">
            <AlertTriangle className="h-5 w-5" />
            <span>Health Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Allergies:</p>
            <div className="flex flex-wrap gap-1">
              {userPreferences.allergies.map((allergy, index) => (
                <Badge 
                  key={index} 
                  variant="destructive"
                  className="text-xs"
                >
                  {allergy}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Deficiencies:</p>
            <div className="flex flex-wrap gap-1">
              {userPreferences.deficiencies.map((deficiency, index) => (
                <Badge 
                  key={index} 
                  className="bg-health-orange-100 text-health-orange-700 text-xs"
                >
                  {deficiency}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border-health-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-health-green-700">
            <Heart className="h-5 w-5" />
            <span>Preferences</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Cuisine:</p>
            <div className="flex flex-wrap gap-1">
              {userPreferences.cuisinePreferences.map((cuisine, index) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="text-xs text-health-green-600 border-health-green-300"
                >
                  {cuisine}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Diet:</p>
            <div className="flex flex-wrap gap-1">
              {userPreferences.foodPreferences.map((pref, index) => (
                <Badge 
                  key={index} 
                  variant="outline"
                  className="text-xs text-health-green-600 border-health-green-300"
                >
                  {pref}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPreferences;
