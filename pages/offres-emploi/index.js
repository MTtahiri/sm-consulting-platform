// pages/offres-emploi/index.js - VERSION ULTRA ROBUSTE
import React, { useState, useEffect } from 'react';

const JobsPage = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer les offres depuis l'API
  useEffect(() => {
    const fetchOffres = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("🔄 Début chargement offres...");
        
        const API_URL = '/api/offres';
        console.log("📡 URL API:", API_URL);
        
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log("📨 Statut réponse:", response.status, response.statusText);
        
        // Vérifier si la réponse est du JSON
        const contentType = response.headers.get('content-type');
        console.log("📋 Content-Type:", contentType);
        
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error("❌ Réponse non-JSON reçue:", text.substring(0, 200));
          throw new Error("L'API a retourné une réponse non-JSON");
        }
        
        const data = await response.json();
        console.log("📊 Données JSON reçues:", data);

        if (data.success && Array.isArray(data.offres)) {
          setOffres(data.offres);
          console.log("✅ Offres chargées avec succès:", data.offres.length);
        } else {
          throw new Error(data.error || "Format de données invalide");
        }
        
      } catch (err) {
        console.error("💥 Erreur lors du chargement:", err);
        setError("Erreur: " + err.message);
        
        // Données de secours garanties
        const offresSecours = [
          {
            id: "secours-1",
            titre: "Développeur Fullstack JavaScript",
            entreprise: "SM Consulting",
            type: "CDI",
            experience: "2+ ans",
            technologies: ["JavaScript", "React", "Node.js"],
            localisation: "Paris/Remote",
            date: "2025-01-01",
            description: "Rejoignez notre équipe pour des projets innovants.",
            urgent: false
          }
        ];
        
        setOffres(offresSecours);
        console.log("🛡️  Données de secours activées");
      } finally {
        setLoading(false);
      }
    };

    fetchOffres();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des offres d'emploi...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Offres d'Emploi
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez nos opportunités de carrière et rejoignez une équipe dynamique
          </p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-8">
            <strong>Information:</strong> {error}
          </div>
        )}

        {/* Compteur */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {offres.length} offre(s) d'emploi disponible(s)
          </h2>
          <p className="text-gray-600 mt-2">
            Trouvez le poste qui correspond à vos compétences et aspirations
          </p>
        </div>

        {/* Grille des offres */}
        {offres.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {offres.map(offre => (
              <div key={offre.id} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{offre.titre}</h3>
                  <p className="text-blue-600 font-semibold">{offre.entreprise}</p>
                </div>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm">{offre.type}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm">{offre.experience}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm">{offre.localisation}</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 text-sm">{offre.description}</p>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200">
                  Postuler maintenant
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucune offre d'emploi disponible
            </h3>
            <p className="text-gray-500">
              Revenez bientôt pour découvrir nos nouvelles opportunités.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
