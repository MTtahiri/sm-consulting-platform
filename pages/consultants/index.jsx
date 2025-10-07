// pages/consultants/index.jsx
import { useState, useEffect } from 'react';
import ConsultantCard from '../../components/ConsultantCard';

const ConsultantsPage = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    specialite: '',
    competences: '',
    disponibilite: ''
  });

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const response = await fetch('/api/consultants');
        const data = await response.json();
        setConsultants(data.consultants || []);
      } catch (error) {
        console.error('Erreur chargement consultants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Chargement des profils consultants...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nos Consultants Experts
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez notre réseau de consultants spécialisés pour vos projets de transformation digitale
          </p>
        </div>

        {/* Filtres (à implémenter) */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Filtrer les consultants</h3>
          <div className="flex gap-4">
            <select className="border rounded-lg px-4 py-2">
              <option>Toutes les spécialités</option>
              {/* Options dynamiques */}
            </select>
            <input 
              type="text" 
              placeholder="Compétences..."
              className="border rounded-lg px-4 py-2 flex-1"
            />
          </div>
        </div>

        {/* Grille de consultants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {consultants.map((consultant) => (
            <ConsultantCard 
              key={consultant.id} 
              consultant={consultant} 
            />
          ))}
        </div>

        {consultants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun consultant trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultantsPage;