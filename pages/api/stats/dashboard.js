// pages/api/stats/dashboard.js
import Airtable from 'airtable';

export default async function handler(req, res) {
  try {
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.AIRTABLE_BASE_ID);

    // Compter les consultants
    const consultants = await base('Consultants')
      .select({ fields: ['prenom'] })
      .all();

    // Compter les recruteurs  
    const recruteurs = await base('Recruteurs')
      .select({ fields: ['name'] })
      .all();

    // Compter les contacts
    const contacts = await base('Contacts')
      .select({ fields: ['nom'] })
      .all();

    // Analyser les technologies des consultants
    const technologies = new Set();
    consultants.forEach(consultant => {
      if (consultant.fields.competences) {
        consultant.fields.competences.split(/[,|]/).forEach(skill => {
          const trimmedSkill = skill.trim();
          if (trimmedSkill && trimmedSkill.length > 2) {
            technologies.add(trimmedSkill);
          }
        });
      }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalCandidates: `${consultants.length}+`,
        totalRecruiters: `${recruteurs.length}+`, 
        totalContacts: `${contacts.length}+`,
        totalTechnologies: `${technologies.size}+`
      }
    });

  } catch (error) {
    console.error('Erreur stats dashboard:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
