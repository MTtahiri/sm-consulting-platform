// pages/api/test-mongodb.js
import { connectToDatabase } from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    
    // Test simple
    const collections = await db.listCollections().toArray();
    
    res.json({ 
      success: true, 
      message: 'MongoDB connecté avec succès!',
      collections: collections.map(c => c.name)
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}