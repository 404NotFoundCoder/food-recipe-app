export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface Step {
  number: number;
  content: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  steps: Step[];
  authorId: string;
  authorName: string;
  createdAt: any;
  updatedAt?: any;
}
