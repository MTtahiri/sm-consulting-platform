// api/airtable.js - REMPLACER votre version existante
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      return await handleGetCandidates(req, res);
    } else if (req.method === 'POST') {
      return await handleCreateCandidate(req, res);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Erreur API Airtable:', error);
    res.status(500).json({ 
      error: 'Erreur interne du serveur',
      details: error.message
    });
  }
}

// GET - Récupérer tous les candidats avec pagination
async function handleGetCandidates(req, res) {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID || 'appNwg9iP8ub0cDCn';
  const tableName = process.env.AIRTABLE_TABLE_NAME || 'Candidats';

  if (!apiKey || !baseId) {
    return res.status(500).json({ 
      error: 'Configuration manquante',
      details: 'AIRTABLE_API_KEY et AIRTABLE_BASE_ID sont requis'
    });
  }

  try {
    // Récupérer TOUS les enregistrements avec pagination
    let allRecords = [];
    let offset = null;
    let pageCount = 0;

    do {
      pageCount++;
      console.log(`Récupération page ${pageCount}...`);

      const encodedTableName = encodeURIComponent(tableName);
      let apiUrl = `https://api.airtable.com/v0/${baseId}/${encodedTableName}`;
      
      const params = new URLSearchParams({
        pageSize: '100',
        sort: JSON.stringify([{field: 'Date_Ajout', direction: 'desc'}])
      });

      if (offset) {
        params.append('offset', offset);
      }

      apiUrl += '?' + params.toString();

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return res.status(response.status).json({
          error: 'Erreur Airtable',
          status: response.status,
          details: errorData.error || response.statusText
        });
      }

      const data = await response.json();
      
      if (data.records && data.records.length > 0) {
        allRecords.push(...data.records);
      }

      offset = data.offset;
      console.log(`Page ${pageCount}: ${data.records?.length || 0} enregistrements`);

    } while (offset);

    console.log(`✅ TOTAL: ${allRecords.length} candidats récupérés`);
    
    // Retourner toutes les données
    res.status(200).json({
      records: allRecords,
      _pagination: {
        totalRecords: allRecords.length,
        pagesProcessed: pageCount,
        retrievalComplete: true
      },
      _debug: {
        recordCount: allRecords.length,
        timestamp: new Date().toISOString(),
        source: 'airtable-api-paginated'
      }
    });

  } catch (error) {
    console.error('Erreur récupération candidats:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des candidats',
      details: error.message
    });
  }
}

// POST - Créer un nouveau candidat
async function handleCreateCandidate(req, res) {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID || 'appNwg9iP8ub0cDCn';
  const tableName = process.env.AIRTABLE_TABLE_NAME || 'Candidats';

  try {
    const candidateData = req.body;
    
    const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(candidateData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: 'Erreur création candidat',
        details: errorData.error || response.statusText
      });
    }

    const result = await response.json();
    
    res.status(201).json({
      success: true,
      message: 'Candidat créé avec succès',
      data: result
    });

  } catch (error) {
    console.error('Erreur création candidat:', error);
    res.status(500).json({
      error: 'Erreur lors de la création du candidat',
      details: error.message
    });
  }
}
