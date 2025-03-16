export type Ingredient = {
  _id: string;
  ingredientId: string;
  ingredientName: string;
  ingredientAllergies: string[];
  ingredientImageUrl?: string;
  subIngredients?: string[];
  createdAt: string;
  updatedAt: string;
  id: string;
};

export type CreateIngredientDto = {
  ingredientName: string;
  ingredientAllergies: string[];
  ingredientImageUrl?: string;
  subIngredients?: string[];
};

export type UpdateIngredientDto = Partial<CreateIngredientDto>;
