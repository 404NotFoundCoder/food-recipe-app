"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { Recipe, Comment } from "@/app/types/recipe";

import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
  faFileText,
  faUtensils,
  faListOl,
  faToggleOn,
  faToggleOff,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import CommentSection from "@/app/components/CommentSection";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set()
  );
  const [showTodoList, setShowTodoList] = useState(false);

  const fetchRecipe = async () => {
    try {
      const docRef = doc(db, "recipes", id as string);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // 獲取食譜資料
        const recipeData = { id: docSnap.id, ...docSnap.data() } as Recipe;

        // 獲取評論
        const commentsRef = collection(db, "recipes", id as string, "comments");
        const commentsSnap = await getDocs(commentsRef);
        const commentsData = commentsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as Comment[];

        // 合併資料
        setRecipe({
          ...recipeData,
          comments: commentsData,
        });
      }
    } catch (error) {
      console.error("Error fetching recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (recipe) {
        await deleteDoc(doc(db, "recipes", recipe.id));
        toast.success("食譜已刪除");
        router.push("/recipes");
      } else {
        toast.error("食譜不存在，無法刪除");
      }
    } catch (error) {
      toast.error("刪除失敗，請稍後再試");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleIngredient = (index: number) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  const handleAddComment = async (
    rating: number | undefined,
    content: string,
    parentId?: string | null
  ) => {
    if (!user || !recipe) return;

    try {
      const commentData = {
        userId: user.uid,
        userName: user.displayName || "匿名用戶",
        content,
        createdAt: serverTimestamp(),
        ...(rating !== undefined && { rating }),
        ...(parentId && { parentId }),
      };

      // 添加評論到 Firebase
      const docRef = await addDoc(
        collection(db, "recipes", recipe.id, "comments"),
        commentData
      );

      // 更新本地狀態，使用 Timestamp 對象
      const newComment = {
        ...commentData,
        id: docRef.id,
        createdAt: {
          toDate: () => new Date(), // 模擬 Firestore Timestamp 的 toDate 方法
        },
      };

      if (!parentId && rating !== undefined) {
        const newTotalRatings = (recipe.totalRatings || 0) + 1;
        const newAverageRating =
          ((recipe.averageRating || 0) * (recipe.totalRatings || 0) + rating) /
          newTotalRatings;

        await updateDoc(doc(db, "recipes", recipe.id), {
          averageRating: newAverageRating,
          totalRatings: newTotalRatings,
        });

        // 更新本地食譜狀態
        setRecipe({
          ...recipe,
          averageRating: newAverageRating,
          totalRatings: newTotalRatings,
          comments: [...(recipe.comments || []), newComment],
        });
      } else {
        // 更新本地狀態
        setRecipe((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            comments: [...(prev.comments || []), newComment],
          };
        });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("評論發布失敗，請稍後再試");
    }
  };

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
      <div className="mb-6">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4" />
          <span>返回食譜列表</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
            {user?.uid === recipe.authorId && (
              <div className="flex gap-2">
                <button
                  onClick={() => router.push(`/recipes/${recipe.id}/edit`)}
                  className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <FontAwesomeIcon icon={faPenToSquare} className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-500 mb-6">
            <p className="flex items-center gap-2">
              <span className="truncate max-w-[100px]">
                {recipe.authorName}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
              <span className="flex-shrink-0">
                {new Date(recipe.createdAt?.toDate())
                  .toLocaleDateString("zh-TW", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                  .replace(/\//g, "/")}
              </span>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900 mb-3">
              <FontAwesomeIcon
                icon={faFileText}
                className="w-5 h-5 text-orange-500"
              />
              食譜簡介
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {recipe.description}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900">
                <FontAwesomeIcon
                  icon={faUtensils}
                  className="w-5 h-5 text-orange-500"
                />
                食材
              </h2>
              <button
                onClick={() => setShowTodoList(!showTodoList)}
                className="flex items-center gap-3 text-gray-500 hover:text-orange-500 transition-colors rounded-full px-4 py-2 hover:bg-orange-50"
              >
                <span className="text-base font-medium">清單確認</span>
                <FontAwesomeIcon
                  icon={showTodoList ? faToggleOn : faToggleOff}
                  className={`w-8 h-8 scale-150 transform transition-all ${
                    showTodoList ? "text-orange-500" : "text-gray-300"
                  }`}
                  style={{ transformOrigin: "center" }}
                />
              </button>
            </div>

            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                    showTodoList
                      ? "hover:bg-orange-50/50 group"
                      : "hover:bg-gray-50"
                  }`}
                >
                  {showTodoList && (
                    <button
                      onClick={() => toggleIngredient(index)}
                      className={`w-5 h-5 rounded-lg border-2 transition-all ${
                        checkedIngredients.has(index)
                          ? "bg-orange-500 border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-300 group-hover:border-orange-500"
                      }`}
                    >
                      {checkedIngredients.has(index) && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                  <span
                    className={`flex-1 transition-colors ${
                      showTodoList && checkedIngredients.has(index)
                        ? "text-gray-400 line-through"
                        : "text-gray-700"
                    }`}
                  >
                    {ingredient.name}
                  </span>
                  <span
                    className={`transition-colors ${
                      showTodoList && checkedIngredients.has(index)
                        ? "text-gray-400"
                        : "text-gray-500"
                    }`}
                  >
                    {ingredient.amount} {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>

            {showTodoList && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    已備齊 {checkedIngredients.size} 項食材
                  </span>
                  <span className="text-gray-400">
                    共 {recipe.ingredients.length} 項
                  </span>
                </div>
                <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-pink-500 transition-all"
                    style={{
                      width: `${
                        (checkedIngredients.size / recipe.ingredients.length) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-900 mb-6">
              <FontAwesomeIcon
                icon={faListOl}
                className="w-5 h-5 text-orange-500"
              />
              步驟
            </h2>
            <div className="space-y-6">
              {recipe.steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-medium">
                    {index + 1}
                  </div>
                  <p className="flex-1 text-gray-600 leading-relaxed">
                    {step.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 評論區域 */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-6">食譜評價</h2>
        <CommentSection
          recipeId={recipe.id}
          comments={recipe.comments || []}
          averageRating={recipe.averageRating || 0}
          totalRatings={recipe.totalRatings || 0}
          onAddCommentAction={handleAddComment}
        />
      </div>

      {/* 刪除確認彈窗 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl transform transition-all animate-fade-in"
            style={{ maxWidth: "400px" }}
          >
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faTrash}
                  className="w-8 h-8 text-red-500"
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
              刪除食譜
            </h3>
            <p className="text-gray-600 text-center mb-8">
              確定要刪除「{recipe.title}」嗎？
              <br />
              此操作無法復原。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>刪除中</span>
                  </div>
                ) : (
                  "確認刪除"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
