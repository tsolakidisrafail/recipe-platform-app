import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
     const[isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.password !== formData.confirmPassword) {
            setError('Οι κωδικοί πρόσβασης δεν ταιριάζουν.');
            return;
        }
        if (formData.password.length < 6) {
            setError('Ο κωδικός πρόσβασης πρέπει να έχει τουλάχιστον 6 χαρακτήρες.');
            return;
        }
        
        setIsSubmitting(true);

        const result = await register({
            username: formData.username,
            email: formData.email,
            password: formData.password,
        });
        setIsSubmitting(false);

        if (!result.success) {
            setError(result.message || 'Σφάλμα κατά την εγγραφή. Δοκιμάστε ξανά.');
        } else {
            navigate('/');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">Εγγραφή</h2>
             {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Όνομα Χρήστη</label>
                    <input type="text" name="username" id="username" required className="w-full input-style" value={formData.username} onChange={handleChange} disabled={isSubmitting} />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" id="email" required className="w-full input-style" value={formData.email} onChange={handleChange} disabled={isSubmitting} />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Κωδικός Πρόσβασης (τουλ. 6 χαρακτήρες)</label>
                    <input type="password" name="password" id="password" required className="w-full input-style" value={formData.password} onChange={handleChange} disabled={isSubmitting} />
                </div>
                <div className="mb-6">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Επιβεβαίωση Κωδικού</label>
                    <input type="password" name="confirmPassword" id="confirmPassword" required className="w-full input-style" value={formData.confirmPassword} onChange={handleChange} disabled={isSubmitting} />
                </div>
                <button type="submit" className="w-full btn btn-primary py-2 px-4" disabled={isSubmitting}>
                    {isSubmitting ? 'Γίνεται εγγραφή...' : 'Εγγραφή'}
                </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
                Έχετε ήδη λογαριασμό;{' '}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Συνδεθείτε εδώ
                </Link>
            </p>
        </div>
    );
}

export default RegisterPage;