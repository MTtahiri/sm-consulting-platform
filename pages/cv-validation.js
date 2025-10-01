// pages/cv-validation.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function CVValidation() {
  const router = useRouter();
  const [availableCVs, setAvailableCVs] = useState([]);
  const [selectedCV, setSelectedCV] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Charger la liste des CVs disponibles
  useEffect(() => {
    const fetchAvailableCVs = async () => {
      try {
        // Liste des CVs disponibles dans le dossier
        const cvList = [
          "Anicette Toure DA Dispo 450€.pdf",
          "Consultant Func SAP FICO_Taieb_Belkahla.pdf", 
          "CV Dev java Omar.pdf",
          "AZARIA TANDJA Dispo DS 500€.pdf",
          "ABDELDJALIL CHERRAGUI Dev IA Dispo 300€ (1).pdf"
        ];
        setAvailableCVs(cvList);
      } catch (err) {
        console.error('Erreur chargement CVs:', err);
      }
    };
    fetchAvailableCVs();
  }, []);

  // Extraire les données du CV sélectionné
  const extractCVData = async () => {
    if (!selectedCV) {
      setError('Veuillez sélectionner un CV');
      return;
    }

    setLoading(true);
    setError('');
    setExtractedData(null);

    try {
      console.log('📤 Envoi du fichier pour extraction:', selectedCV);
      
      const response = await fetch('/api/extract-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfFileName: selectedCV // CORRIGÉ: Bien envoyer le filename
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Données extraites avec succès:', data);
        setExtractedData(data);
        setSuccess('Données extraites avec succès!');
      } else {
        throw new Error(data.error || 'Erreur lors de l\'extraction');
      }
    } catch (err) {
      console.error('❌ Erreur extraction:', err);
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter le consultant à Google Sheets
  const addToGoogleSheets = async () => {
    if (!extractedData) {
      setError('Aucune donnée à ajouter');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('📤 Ajout à Google Sheets avec données:', {
        ...extractedData,
        pdfFileName: selectedCV // CORRIGÉ: Inclure le filename
      });
      
      const response = await fetch('/api/add-consultant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...extractedData,
          pdfFileName: selectedCV // CORRIGÉ: Bien inclure le nom du fichier
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setSuccess('Consultant ajouté avec succès à Google Sheets!');
        // Redirection vers la liste après succès
        setTimeout(() => {
          router.push('/candidates');
        }, 2000);
      } else {
        throw new Error(result.error || 'Erreur lors de l\'ajout');
      }
    } catch (err) {
      console.error('❌ Erreur ajout Google Sheets:', err);
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Validation de CV</h1>
      
      {/* Sélection du CV */}
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="cv-select" style={{ display: 'block', marginBottom: '10px' }}>
          Sélectionner un CV:
        </label>
        <select 
          id="cv-select"
          value={selectedCV} 
          onChange={(e) => {
            console.log('📝 CV sélectionné:', e.target.value);
            setSelectedCV(e.target.value);
          }}
          style={{ 
            width: '100%', 
            padding: '10px', 
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        >
          <option value="">Choisir un CV...</option>
          {availableCVs.map((cv, index) => (
            <option key={index} value={cv}>
              {cv}
            </option>
          ))}
        </select>
      </div>

      {/* Bouton d'extraction */}
      <button 
        onClick={extractCVData}
        disabled={!selectedCV || loading}
        style={{
          padding: '10px 20px',
          backgroundColor: selectedCV && !loading ? '#0070f3' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: selectedCV && !loading ? 'pointer' : 'not-allowed',
          marginBottom: '20px'
        }}
      >
        {loading ? 'Extraction en cours...' : 'Extraire les données du CV'}
      </button>

      {/* Messages d'erreur/succès */}
      {error && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          border: '1px solid #ffcdd2',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          ❌ {error}
        </div>
      )}

      {success && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: '#e8f5e8', 
          color: '#2e7d32',
          border: '1px solid #c8e6c9',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          ✅ {success}
        </div>
      )}

      {/* Affichage des données extraites */}
      {extractedData && (
        <div style={{ 
          padding: '20px', 
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9',
          marginBottom: '20px'
        }}>
          <h3>Données extraites:</h3>
          <pre style={{ 
            whiteSpace: 'pre-wrap',
            fontSize: '14px',
            backgroundColor: '#fff',
            padding: '15px',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}>
            {JSON.stringify(extractedData, null, 2)}
          </pre>
          
          {/* Bouton d'ajout à Google Sheets */}
          <button 
            onClick={addToGoogleSheets}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#ccc' : '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Ajout en cours...' : 'Ajouter à Google Sheets'}
          </button>
        </div>
      )}
    </div>
  );
}
