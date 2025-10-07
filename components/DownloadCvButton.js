// components/DownloadCvButton.js
import React from 'react';

export default function DownloadCvButton({ consultant }) {
  async function downloadCvPdf() {
    const response = await fetch('/api/generate-cv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(consultant),
    });

    if (!response.ok) {
      alert("Erreur lors de la génération du CV");
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_${consultant.titre || 'consultant'}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <button onClick={downloadCvPdf} className="btn-download-cv">
      Télécharger CV PDF
    </button>
  );
}
