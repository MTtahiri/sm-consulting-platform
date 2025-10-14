// pages/api/test-airtable-connection.js
import Airtable from 'airtable';

export default async function handler(req, res) {
  try {
    console.log('🧪 Test connexion Airtable...');
    
    // Vérification des variables d'environnement
    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      return res.status(500).json({
        success: false,
        error: 'Variables Airtable manquantes dans .env.local',
        missing: {
          api_key: !process.env.AIRTABLE_API_KEY,
          base_id: !process.env.AIRTABLE_BASE_ID
        }
      });
    }

    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.AIRTABLE_BASE_ID);

    // Test 1: Lister les tables disponibles
    console.log('📊 Test liste des tables...');
    // Note: Airtable ne permet pas de lister les tables via API simplement
    // On teste directement avec le nom de table supposé

    // Test 2: Créer un enregistrement test
    console.log('📝 Test création enregistrement...');
    const testRecord = {
      'prenom': 'Test',
      'nom': 'Airtable',
      'email': 'test@smconsulting.com',
      'statut': 'Nouveau',
      'date_ajout': new Date().toISOString().split('T')[0],
      'cv_file_path': 'D:\\test\\cv_test.pdf'
    };

    const records = await base('Table 1').create([
      { fields: testRecord }
    ]);

    // Test 3: Lire les enregistrements
    console.log('🔍 Test lecture enregistrements...');
    const allRecords = await base('Table 1')
      .select({ maxRecords: 5 })
      .firstPage();

    // Nettoyer l'enregistrement test
    await base('Table 1').destroy([records[0].getId()]);

    res.status(200).json({
      success: true,
      message: '🎉 CONNEXION AIRTABLE RÉUSSIE!',
      tests: {
        creation: '✅ Réussi',
        lecture: '✅ Réussi',
        suppression: '✅ Réussi'
      },
      table_name: 'Table 1',
      records_count: allRecords.length,
      next_step: 'Création du système d\'upload complet'
    });

  } catch (error) {
    console.error('❌ Erreur Airtable:', error);
    
    // Analyse de l'erreur
    let solution = 'Vérifiez les variables d\'environnement';
    if (error.message.includes('NOT_FOUND')) {
      solution = 'Table non trouvée. Vérifiez AIRTABLE_TABLE_NAME dans .env.local';
    } else if (error.message.includes('AUTHENTICATION_REQUIRED')) {
      solution = 'API Key invalide. Vérifiez AIRTABLE_API_KEY';
    }
    
    res.status(500).json({
      success: false,
      error: error.message,
      solution: solution,
      variables_checked: {
        api_key: process.env.AIRTABLE_API_KEY ? '✅ Présente' : '❌ Manquante',
        base_id: process.env.AIRTABLE_BASE_ID ? '✅ Présente' : '❌ Manquante',
        table_name: process.env.AIRTABLE_TABLE_NAME || 'Table 1 (par défaut)'
      }
    });
  }
}