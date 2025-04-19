import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        const result = await login(formData);
        setIsSubmitting(false);
        if (!result.success) {
            setError(result.message || 'Αποτυχία σύνδεσης.');
        } else {
            navigate('/');
        }
    };
    
    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Σύνδεση</h2>
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Κωδικός Πρόσβασης</label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={isSubmitting}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full btn btn-primary py-2 px-4"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Γίνεται σύνδεση...' : 'Σύνδεση'}
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
                Δεν έχετε λογαριασμό;{' '}
                <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Εγγραφείτε εδώ
                </Link>
            </p>
        </div>
    );
}

export default LoginPage;