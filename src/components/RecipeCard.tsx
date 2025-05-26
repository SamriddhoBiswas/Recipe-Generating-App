
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Eye } from "lucide-react";

interface RecipeCardProps {
  recipe: {
    id: string;
    title: string;
    cuisine: string;
    cookTime: string;
    servings: number;
    difficulty: string;
    image?: string;
    tags: string[];
  };
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-gray-200 hover:border-health-green-300 animate-fade-in">
      {/* Recipe Image */}
      <div className="relative h-48 bg-gradient-to-br from-health-green-100 to-health-orange-100 overflow-hidden rounded-t-lg">
        {recipe.image ? (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-6xl opacity-20">🍽️</div>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-white/90 text-health-green-700">
            {recipe.cuisine}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-800 group-hover:text-health-green-700 transition-colors">
          {recipe.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{recipe.cookTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {recipe.tags.slice(0, 3).map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="text-xs text-health-green-600 border-health-green-300"
            >
              {tag}
            </Badge>
          ))}
          {recipe.tags.length > 3 && (
            <Badge variant="outline" className="text-xs text-gray-500">
              +{recipe.tags.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full bg-health-green-500 hover:bg-health-green-600 text-white"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Recipe
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
