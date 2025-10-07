import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ConsultantCV() {
  const router = useRouter();
  const { id } = router.query;
  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchConsultant() {
      try {
        const res = await fetch('/api/consultants');
        const data = await res.json();
        const found = data.consultants.find(c => c.id === id);
        setConsultant(found || null);
      } catch (error) {
        console.error('Erreur chargement CV:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchConsultant();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Chargement du profil...</p>;
  if (!consultant) return <p className="text-center mt-10 text-red-600">Consultant introuvable.</p>;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold text-orange-600 mb-2">🧾 CV CONSULTANT — SMCONSULTING</h1>
      <p className="text-sm text-gray-600 mb-6">📍 Paris | 📧 ***REMOVED***</p>

      <h2 className="text-xl font-semibold text-blue-700 mb-4">🧑‍💼 CONSULTANT ANONYME</h2>

      <ul className="mb-6 text-gray-700 space-y-1">
        <li><strong>Poste cible :</strong> {consultant.specialite}</li>
        <li><strong>Expérience :</strong> +{consultant.annees_experience} ans</li>
        <li><strong>Disponibilité :</strong> {consultant.disponibilite}</li>
        <li><strong>Localisation :</strong> {consultant.mobilite_geographique || '—'}</li>
        <li><strong>Langues :</strong> {consultant.langues?.join(', ') || 'Français'}</li>
      </ul>

      <section className="mb-6">
        <h3 className="text-orange-600 font-bold mb-2">🎯 PROFIL SYNTHÉTIQUE</h3>
        <p>{consultant.experience_resume}</p>
      </section>

      <section className="mb-6">
        <h3 className="text-orange-600 font-bold mb-2">🧩 COMPÉTENCES TECHNIQUES</h3>
        <ul className="list-disc ml-6 space-y-1">
          <li><strong>Compétences :</strong> {consultant.competences?.join(', ')}</li>
          <li><strong>Technologies clés :</strong> {consultant.technologies_cles?.join(', ')}</li>
          <li><strong>Secteurs d’expérience :</strong> {consultant.secteurs_experience?.join(', ')}</li>
          <li><strong>Soft Skills :</strong> {consultant.soft_skills?.join(', ')}</li>
          <li><strong>Méthodologies :</strong> {consultant.niveau_expertise}</li>
        </ul>
      </section>

      <section className="mb-6">
        <h3 className="text-orange-600 font-bold mb-2">🧠 EXPÉRIENCES PROFESSIONNELLES</h3>
        <p>{consultant.projets_realises?.join(' • ')}</p>
      </section>

      <section className="mb-6">
        <h3 className="text-orange-600 font-bold mb-2">🎓 FORMATION & CERTIFICATIONS</h3>
        <p>{consultant.formation}</p>
      </section>

      {consultant.realisations_chiffrees && (
        <section className="mb-6">
          <h3 className="text-orange-600 font-bold mb-2">📊 RÉALISATIONS CHIFFRÉES</h3>
          <p>{consultant.realisations_chiffrees}</p>
        </section>
      )}

      <section className="mb-6">
        <h3 className="text-orange-600 font-bold mb-2">💬 RÉFÉRENCES</h3>
        <p>Disponibles sur demande (identité communiquée uniquement après short-list du client)</p>
      </section>

      <div className="flex gap-4 mt-8">
        {consultant.lien_cv && (
          <a
            href={consultant.lien_cv}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            📄 Télécharger le CV PDF
          </a>
        )}
        <button
          onClick={() => window.print()}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
        >
          🖨️ Version imprimable
        </button>
      </div>
    </div>
  );
}
