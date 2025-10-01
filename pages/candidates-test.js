import { useState, useEffect } from 'react';

export default function CandidatesTest() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/candidates')
      .then(res => res.json())
      .then(data => {
        console.log('Candidats reçus:', data);
        setCandidates(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Candidats Test ({candidates.length})</h1>
      <div>
        {candidates.slice(0, 5).map((candidate, index) => (
          <div key={index} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <pre>{JSON.stringify(candidate, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
