
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { preferences, userProfile } = await req.json();

    // Build prompt based on user preferences and profile
    let prompt = `Generate a healthy recipe with the following requirements:
    
Cuisine: ${preferences.cuisine || 'Any'}
Cook Time: ${preferences.cookTime || '30 minutes'}
Servings: ${preferences.servings || '4'}
Difficulty: ${preferences.difficulty || 'Medium'}
Specific Ingredients: ${preferences.ingredients || 'None specified'}
Dietary Restrictions: ${preferences.dietaryRestrictions?.join(', ') || 'None'}`;

    if (userProfile) {
      if (userProfile.dietary_goals?.length > 0) {
        prompt += `\nDietary Goals: ${userProfile.dietary_goals.join(', ')}`;
      }
      if (userProfile.food_preferences?.length > 0) {
        prompt += `\nFood Preferences: ${userProfile.food_preferences.join(', ')}`;
      }
      if (userProfile.allergies?.length > 0) {
        prompt += `\nAllergies to avoid: ${userProfile.allergies.join(', ')}`;
      }
      if (userProfile.deficiencies?.length > 0) {
        prompt += `\nNutritional deficiencies to address: ${userProfile.deficiencies.join(', ')}`;
      }
    }

    prompt += `

Please provide a response in the following JSON format:
{
  "title": "Recipe name",
  "cuisine": "Cuisine type",
  "cookTime": "Cooking time",
  "servings": 4,
  "difficulty": "Easy/Medium/Hard",
  "ingredients": ["ingredient 1", "ingredient 2", ...],
  "instructions": ["step 1", "step 2", ...],
  "nutritionalInfo": {
    "calories": 300,
    "protein": "25g",
    "carbs": "30g",
    "fat": "10g",
    "fiber": "8g"
  },
  "tags": ["healthy", "vegetarian", ...]
}

Make sure the recipe is healthy, balanced, and meets the specified requirements.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate recipe');
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No response from Gemini API');
    }

    // Extract JSON from the response
    let recipeData;
    try {
      // Try to find JSON in the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recipeData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      // If JSON parsing fails, create a fallback recipe
      recipeData = {
        title: "Healthy Generated Recipe",
        cuisine: preferences.cuisine || "International",
        cookTime: preferences.cookTime || "30 minutes",
        servings: parseInt(preferences.servings) || 4,
        difficulty: preferences.difficulty || "Medium",
        ingredients: [
          "2 cups quinoa",
          "1 cup mixed vegetables",
          "2 tbsp olive oil",
          "Salt and pepper to taste",
          "Fresh herbs"
        ],
        instructions: [
          "Cook quinoa according to package instructions",
          "Sauté vegetables in olive oil",
          "Combine quinoa and vegetables",
          "Season with salt, pepper, and herbs",
          "Serve hot"
        ],
        nutritionalInfo: {
          calories: 320,
          protein: "12g",
          carbs: "45g",
          fat: "12g",
          fiber: "6g"
        },
        tags: ["healthy", "nutritious"]
      };
    }

    return new Response(JSON.stringify({ recipe: recipeData }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-recipe-with-gemini function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
