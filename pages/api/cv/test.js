// pages/api/cv/test.js
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    console.log('✅ API CV Test appelée avec succès');
    
    res.status(200).json({
      success: true,
      message: 'API CV fonctionnelle - Prête pour PDF Parse',
      timestamp: new Date().toISOString(),
      status: 'Operational'
    });

  } catch (error) {
    console.error('❌ Erreur API test:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur API test'
    });
  }
}
