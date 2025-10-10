// lib/mongodb.js - AVEC LE BON UTILISATEUR
import { MongoClient } from 'mongodb';

// ✅ UTILISATEUR CORRECT : smcadmin avec admin123
const uri = "mongodb+srv://smcadmin:admin123@smconsulting.wmwezma.mongodb.net/sm_consulting?retryWrites=true&w=majority&appName=SMConsulting";

let cachedClient = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return { client: cachedClient, db: cachedClient.db() };
  }

  try {
    console.log('🔐 Connexion avec smcadmin...');
    const client = new MongoClient(uri);
    await client.connect();
    
    // Test de la connexion
    await client.db().admin().ping();
    console.log('✅ MongoDB connecté avec succès!');
    
    cachedClient = client;
    return { client, db: client.db() };
    
  } catch (error) {
    console.error('❌ Erreur connexion MongoDB:', error.message);
    throw error;
  }
}