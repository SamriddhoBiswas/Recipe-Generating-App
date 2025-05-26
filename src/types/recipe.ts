
export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  cuisine: string | null;
  cook_time: string | null;
  servings: number | null;
  difficulty: string | null;
  ingredients: string[];
  instructions: string[];
  nutritional_info: {
    calories?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
    fiber?: string;
  } | null;
  youtube_link: string | null;
  tags: string[] | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}
