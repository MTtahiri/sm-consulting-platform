// pages/api/generate-full-cv.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { candidate } = req.body;

  if (!candidate) {
    return res.status(400).json({ error: 'Candidate data required' });
  }

  try {
    const fullCV = \
CONSULTANT IT EXPERT - SM\
\

📧 contact@rh-prospects.fr | 📞 +33 619257588
📍 \
🔖 ID Consultant: SM-\

RÉSUMÉ PROFESSIONNEL
\
Consultant IT passionné par les technologies innovantes et le développement d'applications performantes.

COMPÉTENCES TECHNIQUES
\
\

EXPÉRIENCES PROFESSIONNELLES
\
\

DIPLÔMES ET FORMATIONS
\
\

LANGUES
\
• Français: Langue maternelle
• Anglais: Courant professionnel

SOFT SKILLS
\
• Rigueur et méthodologie
• Autonomie et proactivité
• Esprit d'équipe
• Communication efficace

\
SM CONSULTING - Votre partenaire recrutement IT
🌐 www.saveursmaghrebines.com
\
    \.trim();

    res.status(200).json({
      success: true,
      cvContent: fullCV,
      fileName: \CV_Complet_SM\.txt\
    });

  } catch (error) {
    console.error('Erreur génération CV complet:', error);
    res.status(500).json({ error: 'Erreur génération CV' });
  }
}
