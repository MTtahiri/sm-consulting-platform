const fs = require('fs');
const pdfParse = require('pdf-parse');

const pdfPath = './CV-Mohamed-JABER-3.pdf';

let dataBuffer = fs.readFileSync(pdfPath);

pdfParse(dataBuffer).then(function(data) {
  console.log(data.text); // texte brut extrait
}).catch(err => {
  console.error('Erreur lecture PDF:', err);
});
