// pages/crm/dashboard.js - VERSION CORRIGÉE
import UploadCV from '../../components/UploadCV';
import { useState, useEffect } from 'react';

export default function CRMDashboard() {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConsultants = async () => {
    try {
      const response = await fetch('/api/consultants');
      const result = await response.json();
      
      if (result.success) {
        setConsultants(result.consultants);
      }
    } catch (error) {
      console.error('Error fetching consultants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultants();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          CRM SM Consulting
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne Upload */}
          <div className="lg:col-span-1">
            <UploadCV />
          </div>
          
          {/* Colonne Liste */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">
                Consultants ({consultants.length})
              </h2>
              
              {loading ? (
                <p>Chargement...</p>
              ) : consultants.length === 0 ? (
                <p className="text-gray-500">Aucun consultant pour le moment</p>
              ) : (
                <div className="space-y-4">
                  {consultants.map(consultant => (
                    <div key={consultant._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {consultant.personal.prenom} {consultant.personal.nom}
                          </h3>
                          <p className="text-gray-600">{consultant.professional.poste_recherche}</p>
                          <p className="text-sm text-gray-500">
                            {consultant.professional.specialite} | 
                            Exp: {consultant.professional.annees_experience} ans | 
                            TJM: {consultant.professional.tjm}€
                          </p>
                          <p className="text-sm text-blue-600">
                            📅 {consultant.professional.disponibilite}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          consultant.recruitment.statut === 'nouveau' ? 'bg-blue-100 text-blue-800' :
                          consultant.recruitment.statut === 'entretien' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {consultant.recruitment.statut}
                        </span>
                      </div>
                      
                      {consultant.recruitment.reference_offre && (
                        <p className="text-xs text-gray-500 mt-1">
                          📋 Offre: {consultant.recruitment.reference_offre}
                        </p>
                      )}
                      
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm text-gray-500">
                          📄 {consultant.cv.file_name}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 text-sm">
                          Voir détails
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}