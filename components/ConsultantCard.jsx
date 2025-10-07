// components/ConsultantCard.jsx
import { useState } from 'react';

const ConsultantCard = ({ consultant }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* En-tête de la carte */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{consultant.titre}</h3>
            <p className="text-sm text-blue-600 font-semibold mt-1">
              {consultant.specialite}
            </p>
          </div>
          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
            {consultant.annees_experience} ans d'exp.
          </span>
        </div>

        {/* Compétences principales */}
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {consultant.competences.slice(0, 4).map((competence, index) => (
              <span 
                key={index}
                className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full"
              >
                {competence}
              </span>
            ))}
            {consultant.competences.length > 4 && (
              <span className="text-gray-500 text-xs">
                +{consultant.competences.length - 4} autres
              </span>
            )}
          </div>
        </div>

        {/* TJM et disponibilité */}
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-700">
            TJM: <strong>{consultant.tjm_min}€ - {consultant.tjm_max}€</strong>
          </span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            consultant.disponibilite === 'Disponible' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            {consultant.disponibilite}
          </span>
        </div>
      </div>

      {/* Section dépliante */}
      {showDetails && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
          {/* Technologies clés */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Technologies maîtrisées</h4>
            <div className="flex flex-wrap gap-2">
              {consultant.technologies_cles.map((tech, index) => (
                <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Soft skills */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Soft Skills</h4>
            <div className="flex flex-wrap gap-2">
              {consultant.soft_skills.map((skill, index) => (
                <span key={index} className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Réalisations */}
          {consultant.realisations_chiffrees && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Réalisations</h4>
              <p className="text-sm text-gray-600">{consultant.realisations_chiffrees}</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100">
        <div className="flex gap-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {showDetails ? 'Moins de détails' : 'Plus de détails'}
          </button>
          <button
            onClick={() => window.open(consultant.lien_cv, '_blank')}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Voir CV
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultantCard;