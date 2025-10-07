// components/CandidateCard.js - VERSION STYLE SM CONSULTING
import React from 'react';

const CandidateCard = ({ consultant }) => {
  const {
    titre,
    specialite,
    niveau_expertise,
    technologies_cles = [],
    localisation,
    disponibilite,
    tjm_min,
    tjm_max,
    lien_cv,
    annees_experience
  } = consultant;

  // Voir le profil (page complète)
  const handleViewProfile = () => {
    window.location.href = `/candidates/${consultant.id}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-l-4 border-orange-500 p-6 hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px]">
      {/* En-tête */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{titre}</h3>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-blue-600 font-medium">{annees_experience} ans exp.</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">{specialite}</span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          disponibilite === 'Disponible' 
            ? 'bg-green-100 text-green-800 border border-green-300' 
            : 'bg-orange-100 text-orange-800 border border-orange-300'
        }`}>
          {disponibilite}
        </span>
      </div>

      {/* Niveau */}
      <div className="mb-4">
        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
          {niveau_expertise}
        </span>
      </div>

      {/* Technologies */}
      {technologies_cles.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {technologies_cles.slice(0, 4).map((tech, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium border">
                {tech}
              </span>
            ))}
            {technologies_cles.length > 4 && (
              <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-lg text-xs">
                +{technologies_cles.length - 4}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Localisation */}
      <div className="mb-4 flex items-center text-gray-600">
        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {localisation}
      </div>

      {/* Footer avec TJM et bouton */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <div className="text-right">
          <p className="text-lg font-bold text-orange-600">
            {tjm_min}€ - {tjm_max}€
          </p>
          <p className="text-gray-500 text-sm">TJM</p>
        </div>
        
        <button
          onClick={handleViewProfile}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center shadow-md hover:shadow-lg"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Voir le Profil
        </button>
      </div>
    </div>
  );
};

export default CandidateCard;
