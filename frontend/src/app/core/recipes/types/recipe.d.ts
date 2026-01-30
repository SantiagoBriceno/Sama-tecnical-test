export interface Recipe {
  title: string;
  description: string;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

export interface RecipeSummary {
  id: string;
  title: string;
  description: string;
  author: RecipeParticipant;
  created_at: string;
}

export interface RecipeDetails extends RecipeSummary {
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  collaborators: RecipeCollaborator[];
}

export interface RecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface RecipeStep {
  instruction: string;
  stepNumber: number;
}

export interface RecipeParticipant {
  credentials: {
    username: string;
  },
  lastLogin: string;
}

export interface RecipeCollaborator {
  id: string; // Id unico del registro en la tabla de colaboradores
  user: RecipeParticipant;
}
