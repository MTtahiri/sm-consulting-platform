// test-extraction.js - Script de test
const testCVs = [
  "ABDELDJALIL CHERRAGUI Dev IA Dispo 300€ (1).pdf",
  "Anicette Toure DA Dispo 450€.pdf", 
  "Consultant Func SAP FICO_Taieb_Belkahla.pdf",
  "CV Dev java Omar.pdf",
  "AZARIA TANDJA Dispo DS 500€.pdf"
];

async function testExtraction() {
  console.log('🧪 DEBUT DU TEST D EXTRACTION PDF');
  console.log('====================================');

  for (const cvName of testCVs) {
    console.log('\n🔍 Test extraction: ' + cvName);
    console.log('------------------------------------');

    try {
      const response = await fetch('http://localhost:3001/api/extract-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pdfFileName: cvName }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ SUCCES');
        console.log('Specialité détectée:', result.analysis.specialite);
        console.log('Technologies:', result.analysis.technologies_cles);
        console.log('Niveau:', result.analysis.niveau_expertise);
        console.log('Expérience:', result.analysis.annees_experience + ' ans');
        console.log('TJM:', result.analysis.tjm_min + '-' + result.analysis.tjm_max + '€');
        console.log('Confiance analyse:', result.analysis.confidence + '%');
        console.log('Texte extrait (extrait):', result.textSample);
      } else {
        console.log('❌ ECHEC:', result.error);
      }
    } catch (error) {
      console.log('❌ ERREUR:', error.message);
    }
  }
}

// Exécuter le test
testExtraction();
