module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  try {
    const apiKey = process.env.AIRTABLE_API_KEY;
    const baseId = process.env.AIRTABLE_BASE_ID || 'appNwg9iP8ub0cDCn';
    const tableName = process.env.AIRTABLE_TABLE_NAME || 'Candidats';

    if (!apiKey || !baseId) {
      return res.status(500).json({
        error: 'Configuration manquante',
        details: 'Variables environnement manquantes',
        config: { hasApiKey: !!apiKey, baseId, tableName }
      });
    }

    // Version simplifiée pour test
    const encodedTableName = encodeURIComponent(tableName);
    const apiUrl = `https://api.airtable.com/v0/${baseId}/${encodedTableName}?pageSize=100`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: 'Erreur Airtable',
        status: response.status,
        details: errorText
      });
    }

    const data = await response.json();
    
    return res.status(200).json({
      records: data.records || [],
      totalRecords: data.records?.length || 0,
      message: `${data.records?.length || 0} candidats récupérés`,
      debug: {
        timestamp: new Date().toISOString(),
        hasOffset: !!data.offset
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Erreur serveur',
      details: error.message
    });
  }
};
