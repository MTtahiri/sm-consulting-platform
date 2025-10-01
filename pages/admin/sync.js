// pages/admin/sync.js
import { useState } from 'react';

export default function SyncAdmin() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const syncConsultants = async (action) => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/sync-consultants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🔄 Synchronisation Consultants</h1>
      
      <div style={{ margin: '20px 0' }}>
        <button 
          onClick={() => syncConsultants('check')}
          disabled={loading}
          style={styles.button}
        >
          🔍 Vérifier la connexion
        </button>
        
        <button 
          onClick={() => syncConsultants('sync')}
          disabled={loading}
          style={styles.button}
        >
          📥 Synchroniser les données
        </button>
      </div>

      {loading && <p>⏳ Synchronisation en cours...</p>}
      
      {result && (
        <div style={styles.result}>
          <h3>Résultat :</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

const styles = {
  button: {
    padding: '10px 20px',
    margin: '0 10px',
    backgroundColor: '#0a66c2',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  result: {
    backgroundColor: '#f5f5f5',
    padding: '15px',
    borderRadius: '5px',
    marginTop: '20px'
  }
};