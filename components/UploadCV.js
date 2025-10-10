// components/UploadCV.js - VERSION AMÉLIORÉE
import { useState } from 'react';

export default function UploadCV() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setMessage('');

    const formData = new FormData(e.target);
    
    try {
      const response = await fetch('/api/consultants/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ CV uploadé avec succès!');
        e.target.reset();
        // Recharger la page pour voir le nouveau consultant
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setMessage(`❌ Erreur: ${result.error}`);
      }
    } catch (error) {
      setMessage('❌ Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Uploader un CV</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Informations personnelles */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom *</label>
            <input
              type="text"
              name="nom"
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Prénom *</label>
            <input
              type="text"
              name="prenom"
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* NOUVEAUX CHAMPS PROFESSIONNELS */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Spécialité *</label>
            <select
              name="specialite"
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez...</option>
              <option value="Développement Frontend">Développement Frontend</option>
              <option value="Développement Backend">Développement Backend</option>
              <option value="Développement Fullstack">Développement Fullstack</option>
              <option value="Data Science">Data Science</option>
              <option value="DevOps">DevOps</option>
              <option value="Cloud">Cloud</option>
              <option value="Mobile">Mobile</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Product Management">Product Management</option>
              <option value="Cybersécurité">Cybersécurité</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Poste recherché *</label>
            <input
              type="text"
              name="poste"
              placeholder="ex: Lead Developer, Data Scientist..."
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Années d'expérience *</label>
            <select
              name="annees_experience"
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez...</option>
              <option value="0">0-1 an</option>
              <option value="2">2 ans</option>
              <option value="3">3 ans</option>
              <option value="4">4 ans</option>
              <option value="5">5 ans</option>
              <option value="6">6 ans</option>
              <option value="7">7 ans</option>
              <option value="8">8 ans</option>
              <option value="9">9 ans</option>
              <option value="10">10+ ans</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">TJM souhaité (€) *</label>
            <input
              type="number"
              name="tjm"
              min="300"
              max="2000"
              step="50"
              placeholder="ex: 650"
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Disponibilité *</label>
            <select
              name="disponibilite"
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez...</option>
              <option value="Immédiate">Immédiate</option>
              <option value="1 semaine">1 semaine</option>
              <option value="2 semaines">2 semaines</option>
              <option value="1 mois">1 mois</option>
              <option value="2 mois">2 mois</option>
              <option value="3 mois+">3 mois+</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">N° de téléphone</label>
          <input
            type="tel"
            name="telephone"
            placeholder="+33 1 23 45 67 89"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Référence offre</label>
          <input
            type="text"
            name="reference_offre"
            placeholder="ex: OFFRE-2024-001"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Upload CV */}
        <div>
          <label className="block text-sm font-medium mb-1">CV (PDF/Word) *</label>
          <input
            type="file"
            name="cv"
            accept=".pdf,.doc,.docx"
            required
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Formats acceptés: PDF, Word (.doc, .docx) - Max 10MB
          </p>
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 font-semibold"
        >
          {uploading ? '📤 Upload en cours...' : '🚀 Uploader le CV'}
        </button>

        {message && (
          <div className={`p-3 rounded ${
            message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}