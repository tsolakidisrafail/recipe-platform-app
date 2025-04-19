import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRecipe } from '../services/ApiService';
import { useAuth } from '../contexts/AuthContext';

function CreateRecipePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title : '',
    description : '',
    prepTime : '',
    cookingTime : '',
    servings : '',
    category : '',
    imageUrl : '',
  });
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', unit: ''}]);
  const [steps, setSteps] = useState(['']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const removeIngredient = (index) => {
    if (ingredients.length <= 1) return;
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  const handleStepChange = (index, value) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

  const addStep = () => {
    setSteps([...steps, '']);
  };

  const removeStep = (index) => {
    if (steps.length <= 1) return;
    const newSteps = steps.filter((_, i) => i !== index);
    setSteps(newSteps);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!formData.title || !formData.description) {
      setError('Ο τίτλος και η περιγραφή είναι υποχρεωτικά.');
      setIsLoading(false);
      return;
    }
    if (ingredients.length === 0 || ingredients.some(ing => !ing.name || !ing.quantity)) {
      setError('Πρέπει να υπάρχει τουλάχιστον ένα υλικό με όνομα και ποσότητα.');
      setIsLoading(false);
      return;
    }
    if (steps.length === 0 || steps.some(step => !step.trim())) {
        setError('Πρέπει να υπάρχει τουλάχιστον ένα βήμα εκτέλεσης.');
        setIsLoading(false);
        return;
    }

    const finalSteps = steps.map(s => s.trim()).filter(s => s !== '');
    const finalIngredients = ingredients.filter(ing => ing.name.trim() && ing.quantity.trim());

    const recipeData = {
        ...formData,
        prepTime: formData.prepTime ? parseInt(formData.prepTime, 10) : undefined,
        cookingTime: formData.cookingTime ? parseInt(formData.cookingTime, 10) : undefined,
        servings: formData.servings ? parseInt(formData.servings, 10) : undefined,
        ingredients: finalIngredients,
        steps: finalSteps,
    };

    try {
        const response = await createRecipe(recipeData);
        if (response.success && response.data?._id) {
            navigate(`/recipes/${response.data._id}`, { state: { message: 'Η συνταγή δημιουργήθηκε επιτυχώς!' }});
        } else {
            throw new Error(response.message || 'Σφάλμα κατά τη δημιουργία της συνταγής.');
        }
    } catch (err) {
        console.error("Error creating recipe:", err);
        setError(err.response?.data?.message || err.message || 'Σφάλμα κατά τη δημιουργία της συνταγής.');
        setIsLoading(false);
    }
};

return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Δημιουργία Νέας Συνταγής</h1>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">

            {/*Βασικές Πληροφορίες*/}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Τίτλος Συνταγής</label>
                <input type="text" name="title" id="title" required value={formData.title} onChange={handleFormChange} className="mt-1 input-style" />
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Περιγραφή</label>
                <textarea name="description" id="description" rows="4" required value={formData.description} onChange={handleFormChange} className="mt-1 input-style"></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700">Χρόνος Προετοιμασίας (λεπτά)</label>
                    <input type="number" name="prepTime" id="prepTime" min="0" value={formData.prepTime} onChange={handleFormChange} className="mt-1 input-style" />
                </div>
                <div>
                    <label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700">Χρόνος Μαγειρέματος (λεπτά)</label>
                    <input type="number" name="cookingTime" id="cookingTime" min="0" value={formData.cookingTime} onChange={handleFormChange} className="mt-1 input-style" />
                </div>
                <div>
                    <label htmlFor="servings" className="block text-sm font-medium text-gray-700">Μερίδες</label>
                    <input type="number" name="servings" id="servings" min="1" value={formData.servings} onChange={handleFormChange} className="mt-1 input-style" />
                </div>
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Κατηγορία</label>
                <input type="text" name="category" id="category" value={formData.category} onChange={handleFormChange} className="mt-1 input-style" placeholder="π.χ., Κυρίως Πιάτο, Ορεκτικό"/>
            </div>
            <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">URL Εικόνας</label>
                <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleFormChange} className="mt-1 input-style" placeholder="π.χ., https://..."/>
            </div>

            {/* Υλικά (Δυναμικά) */}
            <fieldset className="border border-gray-300 p-4 rounded-md">
                <legend className="text-lg font-medium text-gray-700 px-2">Υλικά *</legend>
                {ingredients.map((ing, index) => (
                    <div key={index} className="flex flex-wrap items-end gap-2 mb-3 p-2 border-b border-gray-200 last:border-b-0">
                        <div className="flex-grow sm:flex-basis-1/3">
                            <label htmlFor={`ing-name-${index}`} className="block text-xs font-medium text-gray-700">Όνομα Υλικού</label>
                            <input
                                type="text" id={`ing-name-${index}`} required
                                value={ing.name}
                                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                                className="mt-1 input-style text-sm"
                            />
                        </div>
                        <div className="flex-grow sm:flex-basis-1/4">
                            <label htmlFor={`ing-quantity-${index}`} className="block text-xs font-medium text-gray-600">Ποσότητα</label>
                            <input
                                type="text" id={`ing-quantity-${index}`} required
                                value={ing.quantity}
                                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                                className="mt-1 input-style text-sm" placeholder="π.χ. 2 or 1/2"
                            />
                        </div>
                        <div className="flex-grow sm:flex-basis-1/4">
                            <label htmlFor={`ing-unit-${index}`} className="block text-xs font-medium text-gray-600">Μονάδα</label>
                            <input
                                type="text" id={`ing-unit-${index}`}
                                value={ing.unit}
                                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                                className="mt-1 input-style text-sm" placeholder="π.χ. κιλά, φλιτζάνια"
                            />
                        </div>
                        {ingredients.length > 1 && (
                            <button type="button" onClick={() => removeIngredient(index)}
                                className="px-2 py-1 text-red-600 hover:text-red-800 text-sm">
                                    🗑️
                                </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addIngredient}
                    className="mt-2 text-sm text-indigo-600 hover:text-indigo-800">
                        + Προσθήκη Υλικού
                </button>
            </fieldset>

            {/* Submit Button */}
            <div className="flex justify-end">
                <button type="submit" className="btn btn-primary py-2 px-6" disabled={isLoading}>
                    {isLoading ? 'Αποθήκευση...' : 'Αποθήκευση Συνταγής'}
                </button>
            </div>
        </form>
    </div>
);
}

export default CreateRecipePage;