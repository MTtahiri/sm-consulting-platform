import { Storage } from 'megajs';
import fs from 'fs';

let storageInstance = null;
let megaEnabled = false;

// Initialiser Mega de manière asynchrone
export async function initMega() {
  if (storageInstance) return storageInstance;

  try {
    storageInstance = new Storage({
      email: process.env.MEGA_EMAIL,
      password: process.env.MEGA_PASSWORD,
    });

    await new Promise((resolve, reject) => {
      storageInstance.once('ready', () => {
        console.log('✅ Mega initialisé avec succès');
        megaEnabled = true;
        resolve(storageInstance);
      });

      storageInstance.once('error', reject);
      setTimeout(() => reject(new Error('Timeout initialisation Mega')), 15000);
    });

    return storageInstance;
  } catch (error) {
    console.log('⚠ Mega désactivé:', error.message);
    megaEnabled = false;
    return null;
  }
}

// Fonction utilitaire pour uploader un fichier
export async function uploadFileToMega(fileBuffer, fileName) {
  try {
    if (!megaEnabled) {
      await initMega();
    }

    if (megaEnabled && storageInstance) {
      console.log('📤 Upload vers Mega:', fileName);

      const uploadStream = storageInstance.upload({
        name: fileName,
        allowUploadBuffering: true,
        size: fileBuffer.length,
      });

      return new Promise((resolve, reject) => {
        uploadStream.write(fileBuffer);
        uploadStream.end();

        uploadStream.on('complete', async (file) => {
          try {
            const link = await file.link();
            console.log('✅ Upload Mega réussi, lien:', link);
            resolve({
              success: true,
              url: link,
              fileId: file.nodeId,
              storage: 'mega',
            });
          } catch (error) {
            console.error('❌ Erreur génération lien Mega:', error);
            reject(error);
          }
        });

        uploadStream.on('error', (error) => {
          console.error('❌ Erreur upload Mega:', error);
          reject(error);
        });
      });
    } else {
      throw new Error('Mega indisponible - utilisation stockage local');
    }
  } catch (error) {
    console.log('🔄 Fallback vers stockage local:', error.message);

    const localFileName = `${Date.now()}_${fileName}`;
    const localPath = `D:/sm-consulting-cvs/${localFileName}`;

    try {
      fs.writeFileSync(localPath, fileBuffer);
      console.log('✅ Fichier sauvegardé localement:', localPath);

      return {
        success: true,
        url: localPath,
        fileId: localFileName,
        storage: 'local',
        warning: 'Mega temporairement indisponible',
      };
    } catch (localError) {
      console.error('❌ Erreur stockage local:', localError);
      throw new Error('Impossible de sauvegarder le fichier');
    }
  }
}
