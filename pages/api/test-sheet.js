// pages/api/test-sheet.js - VERSION CORRIGÉE
export default async function handler(req, res) {
  try {
    const SHEET_ID = '***REMOVED***';
    const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Base_Candidats_Optimisee_2025`; // ← NOM CORRIGÉ
    
    console.log('🔗 URL testée:', SHEET_URL);
    
    const response = await fetch(SHEET_URL);
    console.log('📊 Status response:', response.status);
    
    if (!response.ok) {
      return res.status(500).json({ 
        error: 'Erreur fetch', 
        status: response.status
      });
    }

    const csvData = await response.text();
    const lines = csvData.split('\n').filter(line => line.trim() !== '');
    
    console.log('📋 Nombre de lignes:', lines.length);
    console.log('📖 En-têtes:', lines[0]);
    
    res.status(200).json({
      success: true,
      sheetName: 'Base_Candidats_Optimisee_2025',
      lineCount: lines.length,
      headers: lines[0] || 'Aucune donnée',
      firstCandidate: lines[1] || 'Aucune donnée'
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    res.status(500).json({ error: error.message });
  }
}