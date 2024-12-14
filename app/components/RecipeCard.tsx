import { Recipe } from "@/app/types/recipe";
import Link from "next/link";
import { useAuth } from "@/app/contexts/AuthContext";
import { db } from "@/app/lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

interface RecipeCardProps {
  recipe: Recipe;
  onDelete?: () => void;
}

export default function RecipeCard({ recipe, onDelete }: RecipeCardProps) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, "recipes", recipe.id));
      toast.success("食譜已刪除");
      onDelete?.();
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("刪除失敗，請稍後再試");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <Link href={`/recipes/${recipe.id}`}>
              <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
            </Link>
            {user?.uid === recipe.authorId && (
              <div className="flex gap-2">
                <Link
                  href={`/recipes/${recipe.id}/edit`}
                  className="p-2 text-gray-600 hover:text-orange-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faPenToSquare} className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isDeleting}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {recipe.description}
          </p>
          <div className="text-sm text-gray-500">
            <p>作者：{recipe.authorName}</p>
            <p>
              發布時間：
              {new Date(recipe.createdAt?.toDate()).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* 刪除確認彈窗 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-xl transform transition-all"
            style={{ maxWidth: "400px" }}
          >
            <div className="mb-6 flex justify-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faTrash}
                  className="w-6 h-6 text-red-600"
                />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
              刪除食譜
            </h3>
            <p className="text-gray-600 text-center mb-8">
              確定要刪除「{recipe.title}」嗎？此操作無法復原。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
    </>
  );
}