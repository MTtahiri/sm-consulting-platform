// pages/api/consultants/upload.js - VERSION AMÉLIORÉE
import { connectToDatabase } from '../../../lib/mongodb';
import { IncomingForm } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    
    const form = new IncomingForm();
    
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Error parsing form' });
      }

      const cvFile = files.cv?.[0];
      const nom = fields.nom?.[0];
      const prenom = fields.prenom?.[0];
      const specialite = fields.specialite?.[0];
      const poste = fields.poste?.[0];

      if (!cvFile || !nom || !prenom || !specialite || !poste) {
        return res.status(400).json({ error: 'Champs requis manquants' });
      }

      // Lire le fichier
      const fileBuffer = fs.readFileSync(cvFile.filepath);
      
      const consultant = {
        personal: {
          nom: nom,
          prenom: prenom,
          email: fields.email?.[0] || '',
          telephone: fields.telephone?.[0] || ''
        },
        professional: {
          specialite: specialite,
          poste_recherche: poste,
          annees_experience: parseInt(fields.annees_experience?.[0]) || 0,
          tjm: parseInt(fields.tjm?.[0]) || 0,
          disponibilite: fields.disponibilite?.[0] || 'Immédiate',
          mobilite: 'Paris, Remote' // Par défaut
        },
        recruitment: {
          statut: 'nouveau',
          source: 'upload_direct',
          reference_offre: fields.reference_offre?.[0] || '',
          notes: ''
        },
        cv: {
          file_name: cvFile.originalFilename || 'cv.pdf',
          file_size: cvFile.size,
          file_type: cvFile.mimetype,
          file_data: fileBuffer,
          uploaded_at: new Date()
        },
        metadata: {
          created_at: new Date(),
          updated_at: new Date()
        }
      };

      const result = await db.collection('consultants').insertOne(consultant);
      
      // Nettoyer le fichier temporaire
      fs.unlinkSync(cvFile.filepath);

      res.status(200).json({
        success: true,
        consultantId: result.insertedId,
        message: 'CV uploadé avec succès'
      });
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}