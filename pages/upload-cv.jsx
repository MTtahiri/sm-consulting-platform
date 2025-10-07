// pages/upload-cv.jsx - VERSION MISE À JOUR
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function UploadCV() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      setMessage('❌ Veuillez sélectionner un fichier PDF');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('📤 Envoi du CV pour analyse...');
      
      const response = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('📥 Réponse serveur:', data);

      if (data.success) {
        setMessage(`✅ ${data.message}`);
        
        // Redirection automatique après 2 secondes
        setTimeout(() => {
          router.push('/candidates');
        }, 2000);
      } else {
        setMessage(`❌ ${data.error || 'Erreur lors du traitement'}`);
      }
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      setMessage('❌ Erreur de connexion au serveur');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-orange-600 mb-2">
          📤 Uploader un CV
        </h1>
        <p className="text-gray-600 mb-6">
          Ajoutez un CV PDF pour créer automatiquement un profil consultant SMConsulting
        </p>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="cv-upload"
          />
          <label
            htmlFor="cv-upload"
            className={`cursor-pointer px-6 py-3 rounded-lg transition ${
              uploading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-orange-500 hover:bg-orange-600 text-white'
            }`}
          >
            {uploading ? '🔄 Analyse en cours...' : '📄 Choisir un CV PDF'}
          </label>
          
          <p className="text-gray-500 mt-4 text-sm">
            Le système analysera automatiquement le CV et créera un profil structuré
          </p>
        </div>

        {message && (
          <div className={`mt-6 p-4 rounded-lg text-center ${
            message.includes('✅') 
              ? 'bg-green-100 text-green-800 border border-green-300' 
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            {message}
            {message.includes('✅') && (
              <p className="text-sm mt-2">Redirection automatique dans 2 secondes...</p>
            )}
          </div>
        )}

        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">ℹ️ Nouveau fonctionnement</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• 📄 Analyse intelligente du contenu PDF</li>
            <li>• 🎯 Extraction automatique des compétences et expérience</li>
            <li>• 📊 Création du profil dans la base de données</li>
            <li>• 💾 Sauvegarde locale du fichier PDF</li>
            <li>• 👥 Apparition immédiate dans la liste des consultants</li>
          </ul>
        </div>
      </div>
    </div>
  );
}