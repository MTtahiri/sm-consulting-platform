// pages/api/upload-cv.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { candidateData, cvFile } = req.body;

  try {
    // Simulation upload réussi
    console.log('📤 Upload CV vers Drive pour:', candidateData.name);
    
    // Ici intégrer l'API Google Drive
    // Pour l'instant simulation
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.status(200).json({
      success: true,
      message: 'CV uploadé avec succès vers Google Drive',
      driveUrl: 'https://drive.google.com/drive/folders/...'
    });

  } catch (error) {
    console.error('Erreur upload Drive:', error);
    res.status(500).json({ error: 'Erreur lors de l upload du CV' });
  }
}
