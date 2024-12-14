export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface Step {
  number: number;
  content: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  rating?: number;
  content: string;
  createdAt: any;
  parentId?: string;
  replies?: Comment[];
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
  averageRating?: number;
  totalRatings?: number;
  comments?: Comment[];
}
