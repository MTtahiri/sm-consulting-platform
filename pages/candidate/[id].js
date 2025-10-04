// pages/candidate/[id].js
import { useRouter } from 'next/router';

export default function CandidatePage() {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return <div>Chargement...</div>;
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>Profil Consultant</h1>
      <p><strong>ID:</strong> {id}</p>
      <p style={{ color: 'green' }}>✅ Page fonctionnelle !</p>
      <a href="/candidates">← Retour à la liste</a>
    </div>
  );
}