// api/airtable.js - Version avec pagination pour récupérer TOUS les candidats
export default async function handler(req, res) {
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
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME || 'Candidats';

    if (!apiKey || !baseId) {
      return res.status(500).json({ 
        error: 'Configuration manquante',
        details: 'AIRTABLE_API_KEY et AIRTABLE_BASE_ID sont requis'
      });
    }

    // Fonction pour récupérer TOUS les enregistrements avec pagination
    async function getAllRecords() {
      let allRecords = [];
      let offset = null;
      let pageCount = 0;

      do {
        pageCount++;
        console.log(`Récupération page ${pageCount}...`);

        // Construire l'URL avec pagination
        const encodedTableName = encodeURIComponent(tableName);
        let apiUrl = `https://api.airtable.com/v0/${baseId}/${encodedTableName}`;
        
        // Paramètres de requête
        const params = new URLSearchParams({
          pageSize: '100', // Maximum par page
          view: 'Grid view', // Utiliser la vue par défaut
          // Trier par date d'ajout (plus récent d'abord)
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
          throw new Error(`Erreur API page ${pageCount}: ${response.status} - ${errorData.error || response.statusText}`);
        }

        const data = await response.json();
        
        // Ajouter les enregistrements de cette page
        if (data.records && data.records.length > 0) {
          allRecords.push(...data.records);
        }

        // Vérifier s'il y a une page suivante
        offset = data.offset;

        console.log(`Page ${pageCount}: ${data.records?.length || 0} enregistrements récupérés`);
        console.log(`Total cumulé: ${allRecords.length}`);

      } while (offset); // Continue tant qu'il y a un offset

      return allRecords;
    }

    // Récupérer tous les enregistrements
    const allRecords = await getAllRecords();
    
    console.log(`✅ TOTAL FINAL: ${allRecords.length} candidats récupérés`);
    
    // Retourner toutes les données avec statistiques
    res.status(200).json({
      records: allRecords,
      _pagination: {
        totalRecords: allRecords.length,
        expectedTotal: 195, // Nombre attendu dans votre base
        pagesProcessed: Math.ceil(allRecords.length / 100),
        retrievalComplete: true
      },
      _debug: {
        recordCount: allRecords.length,
        timestamp: new Date().toISOString(),
        source: 'airtable-api-paginated'
      }
    });
    
  } catch (error) {
    console.error('Erreur API Airtable:', error);
    res.status(500).json({ 
      error: 'Erreur interne du serveur',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

// Alternative: Paramètres URL pour filtrer/paginer
// GET /api/airtable?page=1&limit=50&filter=disponible
// GET /api/airtable?search=react&level=senior
