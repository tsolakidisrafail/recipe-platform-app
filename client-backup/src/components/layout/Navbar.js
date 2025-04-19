import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function NavBar() {
    const { isAuthenticated, user, logout, loading } = useAuth();

    const handleLogout = () => {
        logout();
    };

    const navLinkClasses = ({ isActive }) => 
        `px-3 py-2 rounded-md text-sm font-medium ${
            isActive
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        }`;

    return (
        <nav className="bg-gradient-to-r from-indigo-600 to-purple-700 shadow-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-white text-2xl font-bold">
                        🍳 Recipe Platform App
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <NavLink to="/" className={navLinkClasses} end>
                            Αρχική
                            </NavLink>
                            <NavLink to="/recipes" className={navLinkClasses}>
                            Συνταγές
                            </NavLink>
                            {isAuthenticated && (
                                <NavLink to="/recipes/new" className={navLinkClasses}>
                                    Νέα Συνταγή ✨
                                </NavLink>
                            )}
                        </div>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            {loading ? (
                                <span className="text-gray-300 text-sm">Loading...</span>
                            ) : isAuthenticated && user ? (
                                <>
                                <span className="text-gray-300 mr-3">
                                    Γεια σου, <strong className="font-medium text-white">{user.username}!</strong> ({user.points || 0} pts)
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="ml-3 px-3 py-2 rounded-md text-sm font-medium text-gray-300 bg:gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                    >
                                        Αποσύνδεση
                                    </button>
                                </>
                            ) : (
                                <div className="space-x-2">
                                    <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 bg:gray-700 hover:bg-gray-600 hover:text-white">
                                    Σύνδεση
                                    </Link>
                                    <Link to="/register" className="px-3 py-2 rounded-md text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-400">
                                    Εγγραφή
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                            <span className="sr-only">Open main menu</span>
                            <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        </button>
                    </div>

                </div>
            </div>

            <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3"> ... links ...</div>
                <div className="pt-4 pb-3 border-t border-gray-700"> ... auth links ...</div>
            </div>
        </nav>
    );
                    
}

export default NavBar;