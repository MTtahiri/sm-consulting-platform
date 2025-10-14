// pages/test-upload.js
import { useState } from 'react';

export default function TestUpload() {
  const [formData, setFormData] = useState({
    prenom: 'Jean',
    nom: 'Dupont',
    email: 'jean.dupont@email.com',
    telephone: '0123456789',
    poste: 'Développeur Fullstack',
    competences: 'JavaScript, React, Node.js'
  });
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Veuillez sélectionner un fichier PDF');
      return;
    }

    setLoading(true);
    setResult(null);

    const uploadData = new FormData();
    uploadData.append('cv', file);
    uploadData.append('consultantData', JSON.stringify(formData));

    try {
      const response = await fetch('/api/consultants/upload', {
        method: 'POST',
        body: uploadData,
      });
      
      const resultData = await response.json();
      setResult(resultData);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🧪 Test Upload Consultant + CV</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="text"
          placeholder="Prénom"
          value={formData.prenom}
          onChange={(e) => setFormData({...formData, prenom: e.target.value})}
          required
          style={{ padding: '8px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Nom"
          value={formData.nom}
          onChange={(e) => setFormData({...formData, nom: e.target.value})}
          required
          style={{ padding: '8px', border: '1px solid #ccc' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
          style={{ padding: '8px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Téléphone"
          value={formData.telephone}
          onChange={(e) => setFormData({...formData, telephone: e.target.value})}
          style={{ padding: '8px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Poste recherché"
          value={formData.poste}
          onChange={(e) => setFormData({...formData, poste: e.target.value})}
          style={{ padding: '8px', border: '1px solid #ccc' }}
        />
        <textarea
          placeholder="Compétences"
          value={formData.competences}
          onChange={(e) => setFormData({...formData, competences: e.target.value})}
          style={{ padding: '8px', border: '1px solid #ccc', minHeight: '60px' }}
        />
        
        <div>
          <label>
            <strong>CV (PDF) :</strong>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              required
              style={{ marginTop: '5px' }}
            />
          </label>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '10px', 
            backgroundColor: loading ? '#ccc' : '#007acc',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Upload en cours...' : '📤 Uploader Consultant'}
        </button>
      </form>

      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: result.success ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.success ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '5px'
        }}>
          <h3>{result.success ? '✅ SUCCÈS' : '❌ ERREUR'}</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h3>📋 Instructions de test :</h3>
        <ol>
          <li>Sélectionnez un fichier PDF (CV test)</li>
          <li>Les champs sont pré-remplis, modifiez si besoin</li>
          <li>Cliquez sur "Uploader Consultant"</li>
          <li>Vérifiez le résultat ci-dessus</li>
        </ol>
      </div>
    </div>
  );
}