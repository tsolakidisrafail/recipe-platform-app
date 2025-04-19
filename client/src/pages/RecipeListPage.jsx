import React, { useState, useEffect } from 'react';
import { fetchRecipes } from '../services/ApiService';
import RecipeCard from '../components/recipes/RecipeCard';
import { useAuth } from '../contexts/AuthContext';

function RecipeListPage() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const loadRecipes = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetchRecipes();
                if (response.success) {
                    setRecipes(response.data);
                } else {
                    throw new Error(response.message || 'Failed to fetch recipes');
                }
            } catch (err) {
                console.error("Error fetching recipes:", err);
                setError(err.message || 'Σφάλμα κατά την ανάκτηση των συνταγών.');
            } finally {
                setLoading(false);
            }
        };

        loadRecipes();
    }, []);
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Όλες οι συνταγές</h1>
                {isAuthenticated && (
                    <Link to="/recipes/new" className="btn btn-primary">
                        + Νέα Συνταγή
                    </Link>
                )}
            </div>

            {loading && <p className="text-center text-gray-500">Φόρτωση συνταγών...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            
            {!loading && !error && recipes.length === 0 && (
                <p className="text-center text-gray-500">Δεν υπάρχουν διαθέσιμες συνταγές.</p>
            )}

            {!loading && !error && recipes.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {recipes.map(recipe => (
                        <RecipeCard key={recipe._id} recipe={recipe} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default RecipeListPage;