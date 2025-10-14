// pages/api/cv/generate.js
import Airtable from 'airtable';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const { candidateId } = req.body;

    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.AIRTABLE_BASE_ID);

    const record = await base('Table 1').find(candidateId);
    const fields = record.fields;

    const cvData = {
      candidateNumber: 'Candidat #${record.id.slice(-3)}',
      titre: fields.poste || 'Consultant SM Consulting',
      competences: fields.competences ? fields.competences.split(',').map(c => c.trim()) : ['Compétences à définir'],
      experience: fields.experience_detail || 'Expérience non précisée',
      formations: fields.formations || 'Formation non précisée',
      langues: fields.langues || 'Français',
      description: fields.description || 'Consultant expérimenté disponible pour vos missions.',
      projets: fields.projets || 'Projets non précisés',
      certifications: fields.certifications ? fields.certifications.split(',').map(c => c.trim()) : [],
      localisation: 'Île-de-France',
      disponibilite: fields.statut === 'Nouveau' ? 'Disponible immédiatement' : (fields.statut || 'Disponible')
    };

    res.status(200).json({
      success: true,
      cvData: cvData,
      pdfReady: false,
      message: 'Données CV récupérées - Prêt pour génération PDF'
    });

  } catch (error) {
    console.error('❌ Erreur génération CV:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la génération du CV'
    });
  }
}
