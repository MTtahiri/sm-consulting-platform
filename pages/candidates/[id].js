import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ConsultantProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/consultants/${id}`)
      .then(r => r.json())
      .then(setData);
  }, [id]);

  if (!data) return <div style={{padding: '50px'}}>Chargement...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <Link href="/candidates">← Retour</Link>
      <h1>{data.titre}</h1>
      <p>Expérience : {data.annees_experience} ans</p>
    </div>
  );
}