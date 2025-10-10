// pages/api/celebrate.js
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    console.log('🎉 Test de célébration...');
    const { db } = await connectToDatabase();
    
    await db.admin().ping();
    
    // Compter les consultants
    const count = await db.collection('consultants').countDocuments();
    
    res.json({ 
      success: true, 
      message: '🎉 🎉 🎉 MONGODB CONNECTÉ AVEC SUCCÈS ! 🎉 🎉 🎉',
      database: db.databaseName,
      consultantsCount: count,
      status: 'CRM PRÊT À FONCTIONNER !'
    });
    
  } catch (error) {
    console.error('❌ Dernière erreur:', error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
}