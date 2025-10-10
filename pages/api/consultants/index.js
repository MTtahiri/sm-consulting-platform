// pages/api/consultants/index.js - VERSION MONGODB SEULEMENT
import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🚀 Chargement consultants depuis MongoDB...');
    const { db } = await connectToDatabase();
    
    const consultants = await db.collection('consultants')
      .find({})
      .project({
        'cv.file_data': 0 // Exclut les données binaires
      })
      .sort({ 'metadata.created_at': -1 })
      .toArray();

    console.log(`✅ ${consultants.length} consultants trouvés dans MongoDB`);
    
    res.status(200).json({
      success: true,
      count: consultants.length,
      consultants: consultants
    });

  } catch (error) {
    console.error('❌ Erreur MongoDB:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}