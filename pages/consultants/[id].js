import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function ConsultantProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/consultants/${id}`)
        .then(res => res.json())
        .then(data => {
          setConsultant(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error:", error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Chargement du profil...</div>;
  if (!consultant) return <div style={{ padding: '20px', textAlign: 'center' }}>Consultant non trouvé</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#0a66c2', marginBottom: '20px' }}>Profil Consultant</h1>
      
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
        <h2 style={{ color: '#333', marginBottom: '15px' }}>{consultant.titre || 'Consultant'}</h2>
        
        <div style={{ display: 'grid', gap: '10px' }}>
          <p><strong>Années d'expérience:</strong> {consultant.annees_experience || 'Non spécifié'}</p>
          <p><strong>Compétences:</strong> {consultant.competences || 'Non spécifié'}</p>
          <p><strong>Formation:</strong> {consultant.formation || 'Non spécifié'}</p>
          <p><strong>Secteur recherché:</strong> {consultant.secteur_recherche || 'Non spécifié'}</p>
          <p><strong>Mobilité:</strong> {consultant.mobilite || 'Non spécifié'}</p>
        </div>
        
        {consultant.experience_resume && (
          <div style={{ marginTop: '15px' }}>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>Expérience résumée:</h3>
            <p style={{ lineHeight: '1.5' }}>{consultant.experience_resume}</p>
          </div>
        )}
      </div>
    </div>
  );
}
