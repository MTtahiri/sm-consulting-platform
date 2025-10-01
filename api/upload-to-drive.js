// api/upload-to-drive.js - Système d'upload automatisé vers Google Drive
import { google } from 'googleapis';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Nécessaire pour formidable
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Configuration Google Drive API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // Parser les fichiers uploadés
    const form = formidable({
      multiples: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB max
      allowEmptyFiles: false,
    });

    const [fields, files] = await form.parse(req);
    
    // Extraire les informations du candidat
    const candidateInfo = {
      nom: fields.nom?.[0] || 'Unknown',
      prenom: fields.prenom?.[0] || '',
      email: fields.email?.[0] || '',
      poste: fields.poste?.[0] || '',
      date: new Date().toISOString().split('T')[0]
    };

    // Créer le dossier du candidat dans Drive
    const folderName = `${candidateInfo.nom}_${candidateInfo.prenom}_${candidateInfo.date}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    
    // ID du dossier parent "Candidats_CVs" (à créer manuellement dans Drive)
    const parentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;

    const candidateFolder = await createDriveFolder(drive, folderName, parentFolderId);
    
    const uploadedFiles = [];
    const fileArray = Array.isArray(files.cv) ? files.cv : [files.cv];

    // Upload chaque fichier
    for (const file of fileArray.filter(f => f)) {
      try {
        const uploadedFile = await uploadFileToDrive(drive, file, candidateFolder.id, candidateInfo);
        uploadedFiles.push({
          name: uploadedFile.name,
          id: uploadedFile.id,
          webViewLink: `https://drive.google.com/file/d/${uploadedFile.id}/view`,
          webContentLink: `https://drive.google.com/uc?id=${uploadedFile.id}&export=download`
        });
        
        // Supprimer le fichier temporaire
        fs.unlinkSync(file.filepath);
        
      } catch (error) {
        console.error(`Erreur upload fichier ${file.originalFilename}:`, error);
      }
    }

    // Créer un fichier d'informations candidat
    const candidateInfoContent = generateCandidateInfoFile(candidateInfo, fields);
    const infoFile = await createTextFile(drive, candidateFolder.id, 
      `Informations_${candidateInfo.nom}.txt`, candidateInfoContent);

    uploadedFiles.push({
      name: infoFile.name,
      id: infoFile.id,
      webViewLink: `https://drive.google.com/file/d/${infoFile.id}/view`,
      type: 'info'
    });

    // Définir les permissions (lecture pour l'équipe RH)
    await setDriveFolderPermissions(drive, candidateFolder.id);

    res.status(200).json({
      success: true,
      folderId: candidateFolder.id,
      folderName: folderName,
      folderUrl: `https://drive.google.com/drive/folders/${candidateFolder.id}`,
      uploadedFiles: uploadedFiles,
      message: `${uploadedFiles.length} fichiers uploadés avec succès`
    });

  } catch (error) {
    console.error('Erreur upload Drive:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'upload vers Google Drive',
      details: error.message
    });
  }
}

// Créer un dossier dans Google Drive
async function createDriveFolder(drive, folderName, parentFolderId) {
  const folderMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: parentFolderId ? [parentFolderId] : undefined,
  };

  const folder = await drive.files.create({
    resource: folderMetadata,
    fields: 'id,name',
  });

  return folder.data;
}

// Uploader un fichier vers Google Drive
async function uploadFileToDrive(drive, file, parentFolderId, candidateInfo) {
  const fileExtension = path.extname(file.originalFilename);
  const fileName = `CV_${candidateInfo.nom}_${candidateInfo.prenom}${fileExtension}`;

  const fileMetadata = {
    name: fileName,
    parents: [parentFolderId],
    description: `CV de ${candidateInfo.nom} ${candidateInfo.prenom} - ${candidateInfo.poste} - Uploadé le ${new Date().toLocaleString('fr-FR')}`,
  };

  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(file.filepath),
  };

  const uploadedFile = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id,name',
  });

  return uploadedFile.data;
}

// Créer un fichier texte avec les informations du candidat
async function createTextFile(drive, parentFolderId, fileName, content) {
  const fileMetadata = {
    name: fileName,
    parents: [parentFolderId],
  };

  const media = {
    mimeType: 'text/plain',
    body: content,
  };

  const file = await drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id,name',
  });

  return file.data;
}

// Générer le contenu du fichier d'informations
function generateCandidateInfoFile(candidateInfo, fields) {
  const modeTravail = Array.isArray(fields.mode_travail) 
    ? fields.mode_travail.join(', ') 
    : fields.mode_travail?.[0] || 'Non spécifié';

  return `
=== INFORMATIONS CANDIDAT - SM CONSULTING ===

📝 PROFIL
Nom: ${candidateInfo.nom}
Prénom: ${candidateInfo.prenom}
Email: ${candidateInfo.email}
Téléphone: ${fields.telephone?.[0] || 'Non fourni'}
Date d'inscription: ${candidateInfo.date}

📍 LOCALISATION
Pays: ${fields.pays?.[0] || 'Non spécifié'}
Ville: ${fields.ville?.[0] || 'Non spécifiée'}

💼 PROFIL PROFESSIONNEL
Poste recherché: ${candidateInfo.poste}
Niveau d'expérience: ${fields.niveau?.[0] || 'Non spécifié'}
TJM souhaité: ${fields.tjm?.[0] || 'Non spécifié'}€/jour
Disponibilité: ${fields.disponibilite?.[0] || 'Non spécifiée'}
Mode de travail: ${modeTravail}

🛠️ COMPÉTENCES
${fields.competences?.[0] || 'Non spécifiées'}

🎓 CERTIFICATIONS
${fields.certifications?.[0] || 'Aucune mentionnée'}

📝 PRÉSENTATION
${fields.presentation?.[0] || 'Aucune présentation fournie'}

🔗 LIENS PORTFOLIO
${fields.liens?.[0] || 'Aucun lien fourni'}

---
Généré automatiquement par SM Consulting Platform
${new Date().toLocaleString('fr-FR')}
`;
}

// Définir les permissions du dossier
async function setDriveFolderPermissions(drive, folderId) {
  try {
    // Donner accès en lecture à l'équipe RH (remplacez par vos emails)
    const hrEmails = [
      process.env.HR_EMAIL_1,
      process.env.HR_EMAIL_2,
      // Ajoutez d'autres emails RH
    ].filter(email => email);

    for (const email of hrEmails) {
      await drive.permissions.create({
        fileId: folderId,
        resource: {
          role: 'reader',
          type: 'user',
          emailAddress: email,
        },
      });
    }

    // Optionnel: Créer un lien de partage avec accès restreint
    await drive.files.update({
      fileId: folderId,
      resource: {
        shareable: true,
      },
    });

  } catch (error) {
    console.error('Erreur lors de la définition des permissions:', error);
    // Ne pas faire échouer l'upload pour cette erreur
  }
}

// Variables d'environnement nécessaires dans Vercel:
/*
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_DRIVE_PARENT_FOLDER_ID=1ABcDeFgHiJkLmNoPqRsTuVwXyZ123456789
HR_EMAIL_1=hr1@sm-consulting.com
HR_EMAIL_2=hr2@sm-consulting.com
*/

// Structure du dossier Drive créé:
/*
📁 Candidats_CVs (dossier parent)
  └── 📁 Dupont_Jean_2025-09-08
      ├── 📄 CV_Dupont_Jean.pdf
      ├── 📄 Portfolio_Dupont_Jean.pdf
      └── 📄 Informations_Dupont.txt
*/
