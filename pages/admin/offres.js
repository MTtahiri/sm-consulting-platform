import { useState, useEffect } from 'react';

export default function AdminOffres() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOffres();
  }, []);

  const fetchOffres = async () => {
    try {
      const response = await fetch('/api/admin/offres');
      const data = await response.json();
      
      if (data.success) {
        setOffres(data.offres);
      } else {
        setError('Erreur lors du chargement des offres');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Chargement des offres...</div>;
  if (error) return <div className="p-8 text-red-500">Erreur: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des Offres d'Emploi</h1>
      
      <div className="mb-4">
        <p className="text-gray-600">
          {offres.length} offre(s) trouvée(s)
        </p>
      </div>

      <div className="grid gap-4">
        {offres.map(offre => (
          <div key={offre.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-blue-600">{offre.titre}</h3>
                <p className="text-gray-700">Entreprise: {offre.entreprise}</p>
                <p className="text-gray-600">Type: {offre.type} • {offre.localisation}</p>
                <p className="text-gray-500 text-sm">Expérience: {offre.experience}</p>
              </div>
              {offre.urgent && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                  URGENT
                </span>
              )}
            </div>
            
            <div className="mt-3">
              <div className="flex flex-wrap gap-1 mb-2">
                {offre.technologies.map((tech, index) => (
                  <span key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-gray-600 text-sm">{offre.description}</p>
            </div>
            
            <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
              <span>Publiée le: {offre.date}</span>
              <span className={`px-2 py-1 rounded ${
                offre.statut === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {offre.statut}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}