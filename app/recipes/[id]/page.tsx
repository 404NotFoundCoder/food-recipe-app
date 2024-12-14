"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { Recipe } from "@/app/types/recipe";

import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, "recipes", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRecipe({ id: docSnap.id, ...docSnap.data() } as Recipe);
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          找不到這個食譜
        </h1>
        <Link href="/recipes" className="text-orange-600 hover:text-orange-700">
          返回食譜列表
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
          {user?.uid === recipe.authorId && (
            <div className="flex gap-4">
              <Link
                href={`/recipes/${recipe.id}/edit`}
                className="text-orange-600 hover:text-orange-700"
              >
                編輯食譜
              </Link>
            </div>
          )}
        </div>
        <p className="text-gray-600 mt-4">{recipe.description}</p>
        <div className="text-sm text-gray-500 mt-2">
          <p>作者：{recipe.authorName}</p>
          <p>
            發布時間
            {new Date(recipe.createdAt?.toDate()).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">食材</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center gap-2">
                <span>{ingredient.name}</span>
                <span className="text-gray-500">
                  {ingredient.amount} {ingredient.unit}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">步驟</h2>
          <div className="space-y-4">
            {recipe.steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-medium">
                  {index + 1}
                </div>
                <p className="flex-1">{step.content}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
