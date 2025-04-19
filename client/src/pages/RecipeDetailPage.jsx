import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchRecipeById, deleteRecipe } from '../services/ApiService';
import { useAuth } from '../contexts/AuthContext';

const placeholderImage = 'https://via.placeholder.com/800x600.png?text=Recipe+Details';

function RecipeDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadRecipe = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetchRecipeById(id);
            if (response.success) {
                setRecipe(response.data);
            } else {
                throw new Error(response.message || 'Failed to fetch recipe details');
            }
        } catch (err) {
            console.error("Error fetching recipe details:", err);
            setError(err.message || 'Σφάλμα κατά την ανάκτηση των λεπτομερειών της συνταγής.');
        } finally {
            setLoading(false);
        }
    };

    loadRecipe();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή τη συνταγή;')) {
      return;
    }
    setIsDeleting(true);
    setDeleteError(null);
    try {
        const response = await deleteRecipe(id);
        if (response.success) {
            navigate('/recipes', { state: { message: 'Η συνταγή διαγράφηκε επιτυχώς!' } });
        } else {
            throw new Error(response.message || 'Σφάλμα κατά τη διαγραφή της συνταγής.');
        }
    } catch (err) {
        console.error("Error deleting recipe:", err);
        setDeleteError(err.message || 'Σφάλμα κατά τη διαγραφή της συνταγής.');
        setIsDeleting(false);
    }
    };
    
    const isOwner = isAuthenticated && recipe && user && user._id === recipe.createdBy?._id;


    if (loading) return <p className="text-center mt-10">Φόρτωση συνταγής...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
    if (!recipe) return <p className="text-center mt-10">Δεν βρέθηκε η συνταγή.</p>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                    src={recipe.imageUrl || placeholderImage}
                    alt={recipe.title}
                    className="w-full h-64 md:h-96 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src=placeholderImage }}
                />

                <div className="p-6 md:p-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{recipe.title}</h1>
                    <div className="flex flex-wrap text-sm text-gray-500 mb-6 space-x-4">
                        <span>Δημιουργός: <strong className="text-gray-700">{recipe.createdBy?.username || 'Άγνωστος'}</strong></span>
                        <span>Κατηγορία: <strong className="text-gray-700">{recipe.category || 'Δεν ορίστηκε'}</strong></span>
                        <span>🕒 Προετοιμασία: {recipe.prepTime || '?'} min</span>
                        <span>🍳 Μαγείρεμα: {recipe.cookingTime || '?'} min</span>
                        <span>🍽️ Μερίδες: {recipe.servings || '?'}</span>
                        {recipe.averageRating > 0 && (
                            <span className="flex items-center">
                                * <strong className="ml-1 text-gray-700">{recipe.averageRating.toFixed(1)}</strong> ({recipe.numberOfRatings})
                            </span>
                        )}
                    </div>

                    {isOwner && (
                        <div className="mb-6 flex space-x-3">
                            <Link to={`/recipes/${id}/edit`} className="btn btn-outline px-3 py-1 text-sm">
                                Επεξεργασία
                            </Link>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="btn bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-sm focus:ring-red-500 disabled:bg-red-300"
                            >
                                {isDeleting ? 'Διαγραφή...' : 'Διαγραφή'}
                            </button>
                            {deleteError && <p className="text-red-500 text-sm ml-4 self-center">{deleteError}</p>}
                        </div>
                    )}

                    <div className="prose max-w-none mb-8">
                        <h2 className="text-xl font-semibold mb-2">Περιγραφή</h2>
                        <p>{recipe.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div className="md:col-span-1">
                            <h2 className="text-xl font-semibold mb-3 text-gray-700">Υλικά</h2>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                {recipe.ingredients && recipe.ingredients.length > 0 ? (
                                    recipe.ingredients.map((ing, index) => (
                                        <li key={index}>
                                            {ing.quantity} {ing.unit || ''} {ing.name}
                                        </li>
                                    ))
                                ) : (
                                    <li>Δεν έχουν οριστεί υλικά.</li>
                                )}
                            </ul>
                        </div>

                        <div className="md:col-span-2">
                            <h2 className="text-xl font-semibold mb-3 text-gray-700">Εκτέλεση</h2>
                            <ol className="list-decimal list-outside space-y-3 text-gray-600 pl-5"> 
                                {recipe.steps && recipe.steps.length > 0 ? (
                                    recipe.steps.map((step, index) => (
                                        <li key={index} className="pl-2">{step}</li>
                                    ))
                                ) : (
                                    <li>Δεν έχουν οριστεί βήματα εκτέλεσης.</li>
                                )}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default RecipeDetailPage;