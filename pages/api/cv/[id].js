import { google } from 'googleapis';
import pdfParse from 'pdf-parse';
import stream from 'stream';

function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on('data', (chunk) => chunks.push(chunk));
    readableStream.on('end', () => resolve(Buffer.concat(chunks)));
    readableStream.on('error', reject);
  });
}

function extractField(label, text) {
  const regex = new RegExp(`${label}\\s*[:\\-]?\\s*(.+)`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

function extractList(label, text) {
  const raw = extractField(label, text);
  return raw ? raw.split(/[,•;\n]/).map(s => s.trim()).filter(Boolean) : [];
}

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_DRIVE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_DRIVE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // 🔍 Recherche du fichier PDF par nom
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const files = await drive.files.list({
      q: `'${folderId}' in parents and name contains '${id}' and mimeType='application/pdf'`,
      fields: 'files(id, name)',
    });

    if (!files.data.files.length) {
      return res.status(404).json({ error: 'CV introuvable dans Drive' });
    }

    const file = files.data.files[0];

    // 📄 Téléchargement du PDF
    const pdfStream = await drive.files.get(
      { fileId: file.id, alt: 'media' },
      { responseType: 'stream' }
    );

    const buffer = await streamToBuffer(pdfStream.data);
    const pdfData = await pdfParse(buffer);
    const text = pdfData.text;

    // 🧠 Parsing des données
    const consultant = {
      id,
      titre: 'Consultant Anonyme',
      specialite: extractField('Poste cible', text),
      annees_experience: parseInt(extractField('Expérience', text)) || 0,
      disponibilite: extractField('Disponibilité', text),
      mobilite_geographique: extractField('Localisation', text),
      langues: extractList('Langues', text),
      experience_resume: extractField('Profil', text) || extractField('Profil synthétique', text),
      competences: extractList('Compétences', text),
      technologies_cles: extractList('Technologies clés', text),
      secteurs_experience: extractList('Secteurs d’expérience', text),
      soft_skills: extractList('Soft Skills', text),
      niveau_expertise: extractField('Méthodologie', text) || extractField('Niveau', text),
      projets_realises: extractList('Expériences professionnelles', text),
      formation: extractField('Formation', text),
      realisations_chiffrees: extractField('Réalisations', text),
      lien_cv: `https://drive.google.com/file/d/${file.id}/view?usp=sharing`,
    };

    res.status(200).json(consultant);
  } catch (error) {
    console.error('Erreur extraction CV:', error);
    res.status(500).json({ error: 'Erreur lors du traitement du CV', details: error.message });
  }
}
