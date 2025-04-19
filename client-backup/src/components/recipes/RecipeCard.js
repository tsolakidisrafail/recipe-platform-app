import React from 'react';
import { Link } from 'react-router-dom';

const placeholderImage = 'https://via.placeholder.com/400x300.png?text=Recipe';

function RecipeCard({ recipe }) {
    const truncateDescription = (text, maxLength = 100) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <Link to={`/recipes/${recipe._id}`} className="block group"> {/* Link ολόκληρη την κάρτα */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-xl flex flex-col h-full">
                <div className="w-full h-48 overflow-hidden">
                    <img
                        src={recipe.imageUrl || placeholderImage}
                        alt={recipe.title}
                        className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                        onError={(e) => { e.target.onerror = null; e.target.src=placeholderImage }}
                    />
                </div>

                <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate group:hover:text-indigo-600">
                        {recipe.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 flex-grow">
                        {truncateDescription(recipe.description)}
                    </p>

                    <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-200">
                        <span>
                        🕒 { (recipe.prepTime || 0) + (recipe.cookingTime || 0) } min
                        </span>
                        {recipe.averageRating > 0 && (
                            <span className="flex items-center">
                                ⭐ {recipe.averageRating.toFixed(1)}
                                <span className="ml-1">({recipe.numberOfRatings})</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default RecipeCard;
