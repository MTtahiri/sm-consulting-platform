// pages/api/candidates/[id].js - Version optimisée
export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  // Cache control pour éviter les requêtes répétées
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  
  try {
    console.log(`🔍 Recherche du consultant: ${id}`);

    // URL directe vers votre sheet corrigée
    const SHEET_ID = '1H4bSpOvOEMQ8ftg3aZyf8XJmtDFi9JIN8WaRTuwtUzQ';
    const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Master_KPI_Candidats`;

    const response = await fetch(SHEET_URL);
    
    if (!response.ok) {
      return res.status(500).json({ 
        success: false, 
        error: 'Impossible de charger les données' 
      });
    }

    const csvData = await response.text();
    
    // Parser simplifié et optimisé
    const consultant = findConsultantInCSV(csvData, id);
    
    if (!consultant) {
      return res.status(404).json({ 
        success: false, 
        error: 'Consultant non trouvé' 
      });
    }

    console.log(`✅ Consultant trouvé: ${consultant.prenom}`);
    
    res.status(200).json({
      success: true,
      candidate: consultant
    });

  } catch (error) {
    console.error('❌ Erreur API:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erreur serveur',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

// Parser ultra-simplifié
function findConsultantInCSV(csvData, targetId) {
  const lines = csvData.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return null;

  for (let i = 1; i < lines.length; i++) {
    try {
      const values = lines[i].split(',').map(v => v.replace(/^"|"$/g, '').trim());
      
      // Structure attendue après votre correction :
      // [Nom, Courriel, Telephone, Role, Experience, Localisation, ...]
      if (values.length >= 5) {
        const email = values[1] || '';
        const id = email || `consultant-${i}`;
        
        if (id === targetId || email === targetId) {
          return {
            id: id,
            prenom: extractFirstName(values[0]),
            roleRecherche: values[3] || 'Consultant IT',
            experienceAnnees: values[4] || '3-5 ans',
            localisation: values[5] || 'Non spécifié',
            competencesClees: values[7] || 'Compétences à définir',
            disponibilite: values[11] || 'À discuter',
            typeContrat: values[13] || 'CDI',
            // Métadonnées
            certifications: values[6] || '',
            stack: values[8] || '',
            specialites: values[9] || '',
            niveau: values[10] || '',
            tjm: values[15] || '',
            dateInscription: new Date().toISOString()
          };
        }
      }
    } catch (error) {
      continue; // Ignorer les lignes erronées
    }
  }
  return null;
}

function extractFirstName(fullName) {
  if (!fullName) return 'Consultant';
  return fullName.split(' ')[0];
}