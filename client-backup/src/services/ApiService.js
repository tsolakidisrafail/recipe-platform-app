import axios from 'axios';
import config from '../config';

const ApiService = axios.create({
    baseURL: config.apiBaseUrl, // π.χ., 'http://localhost:5001/api'
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

ApiService.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        console.error('Request Error Interceptor:', error);
        return Promise.reject(error);
    }
);

ApiService.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.error('Response Error Interceptor:', error.response?.status, error.response?.data || error.message);
        return Promise.reject(error.response?.data || error);
    }
);

export const fetchRecipes = (params = {}) => {
    return ApiService.get('/recipes', { params });
}

export const fetchRecipeById = (id) => {
    if (!id) return Promise.reject(new Error('Recipe ID is required'));
    return ApiService.get(`/recipes/${id}`);
};

export const createRecipe = (recipeData) => {
    return ApiService.post('/recipes', recipeData);
};

export const updateRecipe = (id, recipeData) => {
    if (!id) return Promise.reject(new Error('Recipe ID is required'));
    return ApiService.put(`/recipes/${id}`, recipeData);
};

export const deleteRecipe = (id) => {
    if (!id) return Promise.reject(new Error('Recipe ID is required'));
    return ApiService.delete(`/recipes/${id}`);
};

export const registerUser = (userData) => {
    return ApiService.post('/auth/register', userData);
};

export const loginUser = (credentials) => {
    return ApiService.post('/auth/login', credentials);
};

export const logoutUser = () => {
    return ApiService.post('/auth/logout');
};

export const fetchCurrentUser = () => {
    return ApiService.get('/auth/me');
};

export const fetchUserProfile = (userId) => {
    if (!userId) return Promise.reject(new Error('User ID is required'));
    return ApiService.get(`/users/${userId}`);
};

export const fetchUserRecipes = (userId) => {
    if (!userId) return Promise.reject(new Error('User ID is required'));
    return ApiService.get(`/users/${userId}/recipes`);
};

export const updateUserProfile = (userData) => {
    return ApiService.put('/users/profile/update', userData);
};

// Export the configured Axios instance as default (προαιρετικό, αλλά συνηθίζεται)
// export default ApiService;

// Export named functions

export {
    ApiService, // Η Axios instance αν χρειαστεί
    fetchRecipes,
    fetchRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    registerUser,
    loginUser,
    logoutUser,
    fetchCurrentUser,
    fetchUserProfile,
    fetchUserRecipes,
    updateUserProfile,
};