import { google } from 'googleapis';

class GoogleDriveService {
  constructor() {
    this.auth = null;
    this.drive = null;
    this.initializeAuth();
  }

  initializeAuth() {
    try {
      // Méthode 1: Via variables d'environnement
      if (process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
        this.auth = new google.auth.JWT({
          email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          scopes: ['https://www.googleapis.com/auth/drive'],
        });
      }
      // Méthode 2: Via fichier de credentials
      else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        this.auth = new google.auth.GoogleAuth({
          keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
          scopes: ['https://www.googleapis.com/auth/drive'],
        });
      }
      // Méthode 3: Via service account direct
      else {
        this.auth = new google.auth.GoogleAuth({
          scopes: ['https://www.googleapis.com/auth/drive'],
        });
      }

      this.drive = google.drive({ version: 'v3', auth: this.auth });
      
    } catch (error) {
      console.error('Erreur initialisation Google Drive:', error);
      throw new Error('Configuration Google Drive invalide');
    }
  }

  async testConnection() {
    try {
      await this.auth.getAccessToken();
      return { success: true, message: 'Connexion Google Drive établie' };
    } catch (error) {
      console.error('Test connexion échoué:', error);
      return { 
        success: false, 
        error: 'Erreur de connexion Google Drive',
        details: error.message 
      };
    }
  }

  async listFiles(folderId = null) {
    try {
      const query = folderId ? `'${folderId}' in parents` : '';
      
      const response = await this.drive.files.list({
        q: query,
        fields: 'files(id, name, mimeType, createdTime, modifiedTime)',
        pageSize: 10,
      });

      return response.data.files;
    } catch (error) {
      console.error('Erreur liste fichiers:', error);
      throw error;
    }
  }

  async uploadFile(fileName, fileBuffer, mimeType, folderId = null) {
    try {
      const fileMetadata = {
        name: fileName,
        parents: folderId ? [folderId] : [],
      };

      const media = {
        mimeType: mimeType,
        body: fileBuffer,
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, name, webViewLink',
      });

      return response.data;
    } catch (error) {
      console.error('Erreur upload fichier:', error);
      throw error;
    }
  }
}

export default new GoogleDriveService();