import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-gray-300 text-center p-4 mt-auto">
      <div className="container mx-auto">
        <p>&copy; {currentYear} Recipe Platform App. Με επιφύλαξη παντός δικαιώματος.</p>
        <div className="mt-2">
          <Link to="/about" className="text-gray-400 hover:text-white mx-2">About</Link>
          <Link to="/contact" className="text-gray-400 hover:text-white mx-2">Contact</Link>
          <Link to="/privacy" className="text-gray-400 hover:text-white mx-2">Privacy Policy</Link>
          <Link to="/terms" className="text-gray-400 hover:text-white mx-2">Terms of Service</Link>
        </div>
    </div>
    </footer>
  );
}

export default Footer;