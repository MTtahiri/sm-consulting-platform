import React, { useState, useEffect } from 'react';
import CandidateCard from '../../components/CandidateCard';
import DownloadCvButton from '../../components/DownloadCvButton';

const CandidatesPage = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    specialite: '',
    niveau: '',
    localisation: ''
  });

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        setLoading(true);
        
        // Essayer d'abord l'API principale
        let response = await fetch('/api/candidates');
        let data = await response.json();
        
        // Si l'API principale échoue, essayer l'API backup
        if (!data.success) {
          console.log('🔄 API principale échoue, tentative avec API backup...');
          response = await fetch('/api/candidates-backup');
          data = await response.json();
        }
        
        console.log('📊 Données reçues:', data);

        if (data.success || Array.isArray(data)) {
          const consultantsData = data.consultants || data;
          console.log('✅ Consultants chargés:', consultantsData.length);
          setConsultants(Array.isArray(consultantsData) ? consultantsData : []);
        } else {
          throw new Error('Aucune donnée valide reçue');
        }
        
      } catch (err) {
        console.error('💥 Erreur fetch:', err);
        setError('Erreur de chargement: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  // Filtrer les consultants
  const filteredConsultants = consultants.filter(consultant => {
    return (
      (filters.specialite === '' || consultant.specialite === filters.specialite) &&
      (filters.niveau === '' || consultant.niveau_expertise === filters.niveau) &&
      (filters.localisation === '' || consultant.localisation.includes(filters.localisation))
    );
  });

  // Options pour les filtres
  const specialites = [...new Set(consultants.map(c => c.specialite).filter(Boolean))];
  const niveaux = [...new Set(consultants.map(c => c.niveau_expertise).filter(Boolean))];
  const localisations = [...new Set(consultants.map(c => c.localisation).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des consultants...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Erreur:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Nos Consultants
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Découvrez notre réseau de consultants experts pour vos projets
          </p>
          
          {/* Compteur */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {filteredConsultants.length} consultant(s) disponible(s)
                </h2>
                <p className="text-gray-600">
                  {filteredConsultants.length === consultants.length 
                    ? 'Tous nos consultants' 
                    : `${filteredConsultants.length} sur ${consultants.length} consultants`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filtrer les consultants</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtre Spécialité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Spécialité
              </label>
              <select
                value={filters.specialite}
                onChange={(e) => setFilters({...filters, specialite: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Toutes les spécialités</option>
                {specialites.map(specialite => (
                  <option key={specialite} value={specialite}>
                    {specialite}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre Niveau */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau d'expertise
              </label>
              <select
                value={filters.niveau}
                onChange={(e) => setFilters({...filters, niveau: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Tous les niveaux</option>
                {niveaux.map(niveau => (
                  <option key={niveau} value={niveau}>
                    {niveau}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre Localisation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localisation
              </label>
              <select
                value={filters.localisation}
                onChange={(e) => setFilters({...filters, localisation: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="">Toutes les localisations</option>
                {localisations.map(localisation => (
                  <option key={localisation} value={localisation}>
                    {localisation}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bouton reset */}
          {(filters.specialite || filters.niveau || filters.localisation) && (
            <div className="mt-4">
              <button
                onClick={() => setFilters({ specialite: '', niveau: '', localisation: '' })}
                className="text-orange-500 hover:text-orange-600 font-medium"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>

        {/* Grille des consultants */}
        {filteredConsultants.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredConsultants.map(consultant => (
              <CandidateCard 
                key={consultant.id} 
                consultant={consultant} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Aucun consultant trouvé
            </h3>
            <p className="text-gray-500">
              Aucun consultant ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatesPage;
