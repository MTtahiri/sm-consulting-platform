// pages/api/extract-real-cv.js
import pdf from 'pdf-parse';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pdfFileName } = req.body;

  if (!pdfFileName) {
    return res.status(400).json({ error: 'PDF filename required' });
  }

  try {
    const pdfsDirectory = path.join(process.cwd(), 'C:\\Users\\mohat\\Downloads\\Mes CVs pdf');
    const filePath = path.join(pdfsDirectory, pdfFileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'PDF file not found' });
    }

    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);

    const extractedText = data.text;
    const anonymizedText = applyRealAnonymization(extractedText);
    
    // CV format A4 avec branding SMConsulting
    const cvA4 = 
CV ANONYMISÉ - CONSULTANT SM CONSULTING





SM CONSULTING - Votre partenaire recrutement IT
📧 contact@rh-prospects.fr | 📞 +33 619257588
🌐 www.saveursmaghrebines.com


* CV anonymisé conforme RGPD - Généré le 
* Toutes les informations personnelles ont été supprimées
    .trim();

    res.status(200).json({
      success: true,
      extractedText: extractedText,
      anonymizedCV: cvA4,
      fileName: CV_Anonyme_SM_.txt
    });

  } catch (error) {
    console.error('Erreur extraction PDF:', error);
    res.status(500).json({ error: 'Erreur lors de l extraction du PDF' });
  }
}

function applyRealAnonymization(text) {
  return text
    .replace(/([A-Z][a-z]+)\s+([A-Z][a-z]+)/g, 'Consultant SM Consulting')
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, 'contact@rh-prospects.fr')
    .replace(/(\+33|0)[1-9](\d{2}){4}/g, '+33 619257588')
    .replace(/(https?:\/\/)?(www\.)?linkedin\.com\/[^\s]+/g, 'www.saveursmaghrebines.com')
    .replace(/\d+\s+[A-Za-z\s,]+(\d{5})?\s+[A-Za-z]+/g, 'Paris, France');
}
