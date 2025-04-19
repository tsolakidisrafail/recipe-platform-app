import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PrivateRoute from './components/routing/PrivateRoute';
import '.styles/global.css';

function App() {
  return (
    <Router>
      <div className="App flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/recipes" element={<RecipeListPage />} />
                <Route path="/recipes/:id" element={<RecipeDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/recipes/new" element={
                    <PrivateRoute>
                        <CreateRecipePage />
                    </PrivateRoute>
                } />
                <Route element={<PrivateRoute />}>
                    <Route path="/recipes/new" element={<CreateRecipePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/recipes/:id/edit" element={<EditRecipePage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;