// pages/admin/sync-cv.js - PAGE ADMIN POUR SYNCHRO MANUELLE
export default function SyncCVPage() {
  const handleSync = async () => {
    try {
      const response = await fetch("/api/cv/sync-drive", {
        method: "POST",
        headers: {
          "Authorization": "Bearer sm_consulting_sync_2025_secure",
          "Content-Type": "application/json"
        }
      });
      
      const result = await response.json();
      alert("Synchronisation réussie: " + JSON.stringify(result, null, 2));
    } catch (error) {
      alert("Erreur: " + error.message);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🔄 Synchronisation CV Drive → Sheets</h1>
      <button 
        onClick={handleSync}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Lancer la Synchronisation
      </button>
      <div style={{ marginTop: "20px" }}>
        <h3>Instructions:</h3>
        <ul>
          <li>Cliquez pour lancer la synchro manuellement</li>
          <li>Les CVs seront scannés depuis Google Drive</li>
          <li>Les données seront ajoutées à Google Sheets</li>
        </ul>
      </div>
    </div>
  );
}
