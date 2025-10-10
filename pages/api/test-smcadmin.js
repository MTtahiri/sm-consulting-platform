// pages/api/test-smcadmin.js
import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  try {
    // Test DIRECT avec smcadmin
    const uri = "mongodb+srv://smcadmin:admin123@smconsulting.wmwezma.mongodb.net/sm_consulting";
    
    console.log('🧪 Test smcadmin direct...');
    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db();
    await db.admin().ping();
    
    // Créer collection si besoin
    const collections = await db.listCollections().toArray();
    const hasConsultants = collections.find(c => c.name === 'consultants');
    
    await client.close();
    
    res.json({ 
      success: true, 
      message: '🎉 SMADMIN FONCTIONNE ENFIN !',
      database: 'sm_consulting',
      hasConsultantsCollection: !!hasConsultants,
      status: 'CRM PRÊT !'
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      help: 'Le mot de passe est incorrect. Réinitialisez-le dans MongoDB Atlas → Database Access → smcadmin → Edit → Change Password → admin123'
    });
  }
}