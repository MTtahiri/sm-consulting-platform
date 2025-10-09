import pdfParse from 'pdf-parse';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { pdfBuffer } = req.body;
    
    if (!pdfBuffer) {
      return res.status(400).json({ error: 'No PDF buffer provided' });
    }

    // Extraction du texte du PDF
    const data = await pdfParse(Buffer.from(pdfBuffer));
    const text = data.text;

    // Analyse basique des compétences
    const skills = extractSkills(text);
    const experience = extractExperience(text);

    // CV format A4 avec branding SMConsulting
    const cvA4 = `
CV ANONYMISÉ - CONSULTANT SM CONSULTING

SM CONSULTING - Votre partenaire recrutement IT
📧 contact@rh-prospects.fr | 📞 +33 619257588
🌐 www.sm-consulting.fr

COMPÉTENCES EXTRACTES:
${skills.join(', ')}

EXPÉRIENCE:
${experience}

--- Extraction automatique SM Consulting ---
    `;

    res.status(200).json({
      success: true,
      extractedText: text,
      skills: skills,
      experience: experience,
      formattedCV: cvA4
    });

  } catch (error) {
    console.error('Error extracting CV:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l extraction du CV',
      details: error.message 
    });
  }
}

function extractSkills(text) {
  const commonSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'AWS', 'Docker', 
    'Kubernetes', 'SQL', 'MongoDB', 'TypeScript', 'Vue.js', 'Angular',
    'PHP', 'Symfony', 'Laravel', 'C#', '.NET', 'Spring', 'React Native'
  ];
  
  return commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

function extractExperience(text) {
  // Logique basique d'extraction d'expérience
  if (text.match(/\d+\+?\s*(ans|années|years)/i)) {
    const match = text.match(/(\d+\+?\s*(ans|années|years))/i);
    return match ? match[0] : 'Expérience non spécifiée';
  }
  return 'Expérience à déterminer';
}
