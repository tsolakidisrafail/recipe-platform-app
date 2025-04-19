import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
    return (
        <div className="text-center py-10">
            <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Η Σελίδα Δεν Βρέθηκε</h2>
            <p className="text-gray-600 mb-6">Λυπούμαστε, η σελίδα που αναζητάτε δεν υπάρχει.</p>
            <Link to="/" className="btn btn-primary">
                Επιστροφή στην Αρχική Σελίδα
            </Link>
        </div>
    );
}

export default NotFoundPage;