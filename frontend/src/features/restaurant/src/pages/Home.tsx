import React, { useState } from 'react';
import { MapPin, User, UserPlus } from 'lucide-react';

const Home: React.FC = () => {
  const [address, setAddress] = useState('');

  const handleUseLocation = () => {
    alert('Utilisation de la localisation actuelle...');
  };

  const handleSearch = () => {
    if (address) {
      alert(`Recherche pour: ${address}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-700 to-green-600 relative overflow-hidden">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-12 py-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <MapPin className="text-red-600" size={28} />
          </div>
          <span className="text-white text-4xl font-bold tracking-wider">MMKH</span>
        </div>

        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition-all hover:scale-105 shadow-lg">
            <User size={20} />
            Login
          </button>
          <button className="flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-all hover:scale-105 shadow-lg">
            <UserPlus size={20} />
            Signup
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-16 relative z-10 gap-10 md:gap-0">
        {/* Left side - Image */}
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-96 h-96">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-600 rounded-3xl shadow-2xl transform rotate-12 animate-bounce-slow">
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="text-white" size={80} />
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full shadow-lg animate-float flex items-center justify-center text-3xl">🍔</div>
            <div className="absolute top-20 right-10 w-16 h-16 bg-white rounded-full shadow-lg animate-float-delayed flex items-center justify-center text-2xl">🛒</div>
            <div className="absolute bottom-20 left-20 w-16 h-16 bg-white rounded-full shadow-lg animate-float flex items-center justify-center text-2xl">💊</div>
            <div className="absolute bottom-10 right-20 w-20 h-20 bg-white rounded-full shadow-lg animate-float-delayed flex items-center justify-center text-3xl">🥗</div>
          </div>
        </div>

        {/* Right side - Text and Search */}
        <div className="md:w-1/2 text-white flex flex-col gap-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Livraison rapide<br />au Maroc
          </h1>
          <p className="text-xl md:text-2xl text-green-100">
            Nourriture, courses, pharmacies, tout!
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-full p-2 flex items-center shadow-2xl">
            <MapPin className="text-gray-400 ml-4" size={24} />
            <input
              type="text"
              placeholder="Quelle est votre adresse?"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 px-4 py-3 text-gray-800 outline-none text-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleUseLocation}
              className="bg-red-600 text-white px-6 py-3 rounded-full font-bold hover:bg-red-700 transition-all whitespace-nowrap"
            >
              Utiliser ma position
            </button>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-white rounded-t-[100%]"></div>

      {/* Animations */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translate(-50%, -50%) rotate(12deg) translateY(0); }
          50% { transform: translate(-50%, -50%) rotate(12deg) translateY(-20px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-25px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 3.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;
