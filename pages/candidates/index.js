// pages/candidates/index.js - VERSION OPTIMISÉE
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function CandidatesPage() {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchConsultants() {
      try {
        const res = await fetch('/api/consultants');
        const data = await res.json();
        console.log('🎯 Données reçues:', data.consultants);
        setConsultants(data.consultants || []);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchConsultants();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 px-6 py-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des experts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      {/* En-tête */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-orange-600 mb-4">
          Nos Experts SMConsulting
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Découvrez notre réseau de consultants spécialisés pour vos projets de transformation digitale
        </p>
      </div>

      {/* Statistiques */}
      {consultants.length > 0 && (
        <div className="text-center mb-8">
          <p className="text-gray-600">
            <strong>{consultants.length}</strong> consultant(s) disponible(s)
          </p>
        </div>
      )}

      {/* Grille des consultants */}
      {consultants.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Aucun consultant disponible
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez par ajouter vos premiers consultants via l'upload de CV.
            </p>
            <button
              onClick={() => router.push('/upload-cv')}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
            >
              📤 Ajouter un consultant
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {consultants.map((consultant) => (
            <div
              key={consultant.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-orange-500"
            >
              <div className="p-6">
                {/* En-tête de la carte */}
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {consultant.titre}
                  </h2>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                    {consultant.annees_experience} ans exp.
                  </span>
                </div>

                {/* Informations principales */}
                <div className="space-y-2 mb-4">
                  <p className="text-gray-700">
                    <span className="font-semibold">Spécialité:</span> {consultant.specialite}
                  </p>
                  
                  <p className="text-gray-700">
                    <span className="font-semibold">Niveau:</span> {consultant.niveau_expertise}
                  </p>

                  {consultant.technologies_cles && consultant.technologies_cles.length > 0 && (
                    <div>
                      <span className="font-semibold text-gray-700">Technologies:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {consultant.technologies_cles.slice(0, 4).map((tech, index) => (
                          <span 
                            key={index}
                            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                        {consultant.technologies_cles.length > 4 && (
                          <span className="text-gray-500 text-xs">
                            +{consultant.technologies_cles.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <p className="text-gray-700">
                    <span className="font-semibold">Localisation:</span> {consultant.mobilite_geographique}
                  </p>

                  <p className="text-gray-700">
                    <span className="font-semibold">Disponibilité:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      consultant.disponibilite.includes('Disponible') 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {consultant.disponibilite}
                    </span>
                  </p>

                  {(consultant.tjm_min > 0 || consultant.tjm_max > 0) && (
                    <p className="text-gray-700">
                      <span className="font-semibold">TJM:</span> {consultant.tjm_min}€ - {consultant.tjm_max}€
                    </p>
                  )}
                </div>

                {/* Bouton Voir CV */}
                <button
                  onClick={() => router.push(`/cv/${consultant.id}`)}
                  className="w-full bg-orange-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-orange-600 transition duration-200 flex items-center justify-center"
                >
                  🧾 Voir le CV du profil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      {consultants.length > 0 && (
        <div className="text-center mt-12">
          <button
            onClick={() => router.push('/upload-cv')}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-semibold"
          >
            ➕ Ajouter un nouveau consultant
          </button>
        </div>
      )}
    </div>
  );
}