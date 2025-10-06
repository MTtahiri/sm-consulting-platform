import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      nom,
      prenom,
      email,
      telephone,
      competences,
      annees_experience,
      experience_resume,
      formation,
      secteur_recherche,
      mobilite,
      lien_cv,
      specialite,
      niveau_expertise,
      technologies_cles,
      secteurs_experience,
      soft_skills,
      realisations_chiffrees,
      teletravail,
      mobilite_geographique,
      tjm_min,
      tjm_max,
      disponibilite,
      projets_realises,
      pdfFileName  // C'est ici qu'on reçoit le nom du fichier PDF
    } = req.body;

    console.log('📥 Données reçues pour add-consultant:', {
      nom, prenom, pdfFileName, competences
    });

    // Authentification Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

    // Récupérer le dernier ID pour l'incrémenter
    const existingData = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'consultants!A:A', // Colonne ID
    });

    const existingRows = existingData.data.values || [];
    const lastId = existingRows.length > 1 ? parseInt(existingRows[existingRows.length - 1][0]) || 0 : 0;
    const newId = lastId + 1;

    // PRÉPARER LES DONNÉES - COLONNE 8 EST "lien_cv" (colonne H)
    const rowData = [
      newId.toString(), // ID auto-incrémenté (colonne A)
      `${prenom} ${nom}`.trim() || 'Non spécifié', // titre (colonne B)
      competences || '', // competences (colonne C)
      annees_experience || '', // annees_experience (colonne D)
      experience_resume || '', // experience_resume (colonne E)
      formation || '', // formation (colonne F)
      secteur_recherche || '', // secteur_recherche (colonne G)
      mobilite || '', // mobilite (colonne H)
      pdfFileName || '', // lien_cv - IMPORTANT: colonne I (index 8) - C'EST ICI QU'ON STOCKE LE NOM DU PDF
      specialite || '', // specialite (colonne J)
      niveau_expertise || '', // niveau_expertise (colonne K)
      technologies_cles || '', // technologies_cles (colonne L)
      secteurs_experience || '', // secteurs_experience (colonne M)
      soft_skills || '', // soft_skills (colonne N)
      realisations_chiffrees || '', // realisations_chiffrees (colonne O)
      teletravail || '', // teletravail (colonne P)
      mobilite_geographique || '', // mobilite_geographique (colonne Q)
      tjm_min || '', // tjm_min (colonne R)
      tjm_max || '', // tjm_max (colonne S)
      disponibilite || '', // disponibilite (colonne T)
      projets_realises || '' // projets_realises (colonne U)
    ];

    console.log('📤 Ajout consultant ID:', newId, 'Fichier PDF:', pdfFileName);

    // Ajouter la ligne à Google Sheets
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'consultants!A:U',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData],
      },
    });

    console.log('✅ Consultant ajouté avec ID:', newId, 'PDF:', pdfFileName);

    res.status(200).json({ 
      success: true, 
      message: 'Consultant ajouté avec succès',
      consultantId: newId,
      pdfFileName: pdfFileName,
      updates: response.data
    });

  } catch (error) {
    console.error('❌ Erreur détaillée:', error);
    res.status(500).json({ 
      error: 'Erreur lors de l\'ajout du consultant',
      details: error.message 
    });
  }
}
