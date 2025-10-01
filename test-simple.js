// test-simple.js - Version simplifiée
const testCVs = [
  "ABDELDJALIL CHERRAGUI Dev IA Dispo 300€ (1).pdf"
];

async function testSimple() {
  console.log('🧪 TEST SIMPLIFIE');
  
  const cvName = testCVs[0];
  console.log('Testing with:', cvName);

  try {
    const response = await fetch('http://localhost:3001/api/extract-cv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pdfFileName: cvName }),
    });

    const result = await response.json();
    console.log('Result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.log('Error:', error.message);
  }
}

testSimple();
