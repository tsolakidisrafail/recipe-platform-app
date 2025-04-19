import React from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Link } from "react-router-dom";

function HomePage() {
    const { isAuthenticated, user } = useAuth();

    return (
        <div className="text-center py-10">
            <h1 className="text-4xl font-bold mb-4 text-indigo-600">Καλώς Ήρθατε στην Πλατφόρμα Συνταγών!</h1>
            <p className="text-lg text-gray-600 mb-6">
                Ανακαλύψτε νέες συνταγές ή {isAuthenticated ? `μοιράσου τις δικές σου, ${user?.username}!` : 'συνδεθείτε για να μοιραστείτε τις δικές σας!'}
            </p>
            <div className="space-x-4">
                <Link to="/recipes" className="btn btn-primary">
                  Δείτε τις Συνταγές
                </Link>
                {!isAuthenticated && (
                    <Link to="/register" className="btn btn-secondary">
                      Εγγραφή
                    </Link>
                )}
                 {!isAuthenticated && (
                    <Link to="/recipes/new" className="btn btn-outline">
                      + Νέα Συνταγή
                    </Link>
                )}
            </div>
        </div>
    );
}

export default HomePage;