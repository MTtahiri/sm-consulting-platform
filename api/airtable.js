// api/airtable.js - VERSION CORRIGÉE
export default async function handler(req, res) {
  // Ajouter les en-têtes CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Vérifier que la méthode est GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  try {
    // Vérifier que les variables d'environnement sont configurées
    const apiKey = process.env.AIRTABLE_API_KEY || process.env.AIRTABLE_TOKEN;
    const baseId = process.env.AIRTABLE_BASE_ID;
    const tableName = process.env.AIRTABLE_TABLE_NAME || 'Candidats';

    console.log('Configuration API:', {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      baseId: baseId,
      tableName: tableName
    });

    if (!apiKey || !baseId) {
      return res.status(500).json({ 
        error: 'Configuration manquante',
        details: 'AIRTABLE_API_KEY (ou AIRTABLE_TOKEN) et AIRTABLE_BASE_ID sont requis',
        config: {
          hasApiKey: !!apiKey,
          hasBaseId: !!baseId,
          tableName: tableName
        }
      });
    }

    // Construire l'URL de l'API Airtable
    const encodedTableName = encodeURIComponent(tableName);
    const apiUrl = `https://api.airtable.com/v0/${baseId}/${encodedTableName}`;

    console.log('URL API:', apiUrl);

    // Préparer les en-têtes d'authentification
    const headers = {
      'Content-Type': 'application/json'
    };

    // Gérer les deux types d'authentification Airtable
    if (apiKey.startsWith('pat')) {
      // Nouveau Personal Access Token
      headers['Authorization'] = `Bearer ${apiKey}`;
    } else if (apiKey.startsWith('key')) {
      // Ancien API Key (deprecated)
      headers['Authorization'] = `Bearer ${apiKey}`;
    } else {
      // Essayer quand même comme Bearer token
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // Faire la requête à l'API Airtable
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: headers
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    // Vérifier si la réponse est OK
    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (e) {
        console.log('Impossible de parser le JSON d\'erreur');
      }

      console.log('Erreur Airtable:', errorData);

      return res.status(response.status).json({
        error: 'Erreur Airtable',
        status: response.status,
        statusText: response.statusText,
        details: errorData.error || 'Erreur inconnue',
        airtableError: errorData,
        debugInfo: {
          url: apiUrl,
          hasAuth: !!headers['Authorization'],
          authType: apiKey?.substring(0, 3) || 'unknown'
        }
      });
    }

    // Récupérer les données
    const data = await response.json();
    
    console.log(`Données récupérées: ${data.records?.length || 0} enregistrements`);
    
    // Retourner les données avec des informations de debug
    res.status(200).json({
      ...data,
      _debug: {
        recordCount: data.records?.length || 0,
        timestamp: new Date().toISOString(),
        source: 'airtable-api'
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

// Variables d'environnement à configurer sur Vercel :
/*
AIRTABLE_API_KEY=pathXG85b7P96CnjE.8fe40141abdb308305bfb43100855b821751c55e38edf0680bce3a9d19243235
AIRTABLE_BASE_ID=appNwg9iP8ub0cDCn (CORRIGÉ avec la vraie Base ID)
AIRTABLE_TABLE_NAME=Candidats

Informations extraites de votre lien :
- Base: Base_Candidats_Master_2025
- Base ID: appNwg9iP8ub0cDCn  
- Table ID: tblB2QFKXVKeJPNg1
- Vue: viwTq4UJ2rGF8yGbn

Structure des colonnes :
Nom, Courriel, Telephone, Role, Experience, Localisation, Certifications, 
Competences, Stack, Specialites, Niveau, Disponibilite, Date_Ajout, 
TypeContrat, Disponible, TJM, Reviews, Rating
*/
