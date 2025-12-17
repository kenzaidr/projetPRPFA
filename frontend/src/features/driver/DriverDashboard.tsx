import React from 'react';
import { Link } from 'react-router-dom';

const DriverDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
            <Link 
              to="/" 
              className="px-4 py-2 text-morocco-red hover:bg-morocco-red/5 rounded-lg transition-colors"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Bienvenue sur le tableau de bord du conducteur</h2>
          <p className="text-gray-600">
            Cette page est en cours de développement.
          </p>
        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;




