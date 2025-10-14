// Remplacer seulement la fonction getServerSideProps pour reconnecter Airtable
export async function getServerSideProps() {
  try {
    const baseURL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    console.log('🔄 Tentative de connexion Airtable...');
    
    const res = await fetch(baseURL + '/api/candidates/list');
    
    if (!res.ok) {
      throw new Error('Erreur API: ' + res.status);
    }
    
    const data = await res.json();
    
    if (data.success) {
      console.log('✅ ' + data.count + ' candidats chargés depuis Airtable');
      return {
        props: {
          candidats: data.candidats
        }
      };
    }
    
    throw new Error('API retourne success: false');
    
  } catch (error) {
    console.error('❌ Erreur chargement Airtable, utilisation du fallback:', error);
    
    // Fallback sur données exemple
    const candidatsExemple = [
      {
        id: "1",
        titre: "Développeur Fullstack React/Node.js",
        localisation: "Île-de-France",
        type_contrat: "Freelance",
        experience: "5+ ans",
        disponibilite: "Disponible",
        description: "Données de démonstration - Reconnexion Airtable en cours",
        competences_cles: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"]
      }
    ];
    
    return {
      props: {
        candidats: candidatsExemple
      }
    };
  }
}
