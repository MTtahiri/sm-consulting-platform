// test-airtable.js

require('dotenv').config();  // Charger les variables d'env avant tout

console.log('API KEY:', process.env.AIRTABLE_API_KEY);
console.log('BASE ID:', process.env.AIRTABLE_BASE_ID);

const Airtable = require('airtable');

async function testAirtable() {
  try {
    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY  // Utiliser la vraie clé chargée
    }).base(process.env.AIRTABLE_BASE_ID);

    const records = await base('SM Consulting - CVs Consultants').select({
      maxRecords: 5
    }).firstPage();

    console.log("✅ Enregistrements récupérés :");
    records.forEach(record => console.log(record.fields));
  } catch (error) {
    console.error("❌ Erreur lors de la récupération Airtable :", error);
  }
}

testAirtable();
