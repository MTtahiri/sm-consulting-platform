import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function OffresEmploi() {
  const [offres] = useState([
    {
      id: 1,
      titre: "Développeur Full Stack JavaScript",
      entreprise: "Startup FinTech",
      type: "CDI",
      experience: "3-5 ans",
      technologies: ["React", "Node.js", "TypeScript", "MongoDB"],
      localisation: "Paris / Remote",
      date: "2024-01-15",
      description: "Rejoignez une équipe innovante pour développer des solutions FinTech modernes.",
      urgent: true
    },
    {
      id: 2,
      titre: "Data Scientist Python",
      entreprise: "Groupe International",
      type: "CDI",
      experience: "2-4 ans",
      technologies: ["Python", "Machine Learning", "SQL", "PyTorch"],
      localisation: "Lyon",
      date: "2024-01-10",
      description: "Analyser des données complexes et développer des modèles prédictifs.",
      urgent: false
    },
    {
      id: 3,
      titre: "DevOps Engineer",
      entreprise: "Scale-up SaaS",
      type: "Freelance",
      experience: "4-6 ans",
      technologies: ["AWS", "Docker", "Kubernetes", "Terraform"],
      localisation: "Remote",
      date: "2024-01-08",
      description: "Optimiser notre infrastructure cloud et automatiser les déploiements.",
      urgent: true
    }
  ]);

  const [filtreTechno, setFiltreTechno] = useState('');
  const [filtreType, setFiltreType] = useState('');

  const offresFiltrees = offres.filter(offre => {
    return (
      (filtreTechno === '' || offre.technologies.includes(filtreTechno)) &&
      (filtreType === '' || offre.type === filtreType)
    );
  });

  const toutesTechnologies = [...new Set(offres.flatMap(offre => offre.technologies))];
  const tousTypes = [...new Set(offres.map(offre => offre.type))];

  return (
    <>
      <Head>
        <title>Offres d'emploi IT | SM Consulting</title>
        <meta name="description" content="Découvrez nos offres d'emploi IT : développeurs, data scientists, DevOps. Postulez directement en ligne." />
      </Head>

      <div style={{ height: '80px' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '700', color: '#1a365d', marginBottom: '1rem' }}>
            Offres d'emploi IT
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#4a5568', maxWidth: '600px', margin: '0 auto' }}>
            Découvrez nos meilleures opportunités pour consultants IT. Postulez en 2 minutes.
          </p>
        </div>

        <div style={{ 
          background: '#f8fafc', 
          padding: '2rem', 
          borderRadius: '15px', 
          marginBottom: '3rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a365d' }}>
              Technologies
            </label>
            <select 
              value={filtreTechno} 
              onChange={(e) => setFiltreTechno(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                minWidth: '200px'
              }}
            >
              <option value="">Toutes les technologies</option>
              {toutesTechnologies.map(tech => (
                <option key={tech} value={tech}>{tech}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a365d' }}>
              Type de contrat
            </label>
            <select 
              value={filtreType} 
              onChange={(e) => setFiltreType(e.target.value)}
              style={{
                padding: '0.75rem',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                minWidth: '200px'
              }}
            >
              <option value="">Tous les contrats</option>
              {tousTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '2rem' }}>
          {offresFiltrees.map(offre => (
            <div key={offre.id} style={{
              background: 'white',
              border: offre.urgent ? '2px solid #e53e3e' : '1px solid #e2e8f0',
              borderRadius: '15px',
              padding: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              position: 'relative'
            }}>
              {offre.urgent && (
                <span style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '20px',
                  background: '#e53e3e',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  🔥 URGENT
                </span>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1a365d', marginBottom: '0.5rem' }}>
                    {offre.titre}
                  </h2>
                  <p style={{ color: '#4a5568', marginBottom: '0.5rem' }}>
                    <strong>{offre.entreprise}</strong> • {offre.localisation}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{ 
                      background: '#edf2f7', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '15px',
                      fontSize: '0.9rem'
                    }}>
                      {offre.type}
                    </span>
                    <span style={{ 
                      background: '#edf2f7', 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '15px',
                      fontSize: '0.9rem'
                    }}>
                      {offre.experience} d'expérience
                    </span>
                  </div>
                </div>

                <Link 
                  href={/postuler/}
                  style={{
                    background: 'linear-gradient(135deg, #fd7e14 0%, #e67e22 100%)',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '25px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Postuler
                </Link>
              </div>

              <p style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                {offre.description}
              </p>

              <div>
                <strong style={{ color: '#1a365d', marginBottom: '0.5rem', display: 'block' }}>
                  Technologies recherchées :
                </strong>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {offre.technologies.map(tech => (
                    <span 
                      key={tech}
                      style={{
                        background: '#ebf8ff',
                        color: '#2b6cb0',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#718096' }}>
                Publiée le {new Date(offre.date).toLocaleDateString('fr-FR')}
              </div>
            </div>
          ))}
        </div>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '4rem',
          padding: '3rem',
          background: 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
          borderRadius: '15px',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            Vous ne trouvez pas votre profil ?
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
            Déposez votre CV spontanément, nous vous recontacterons pour des opportunités sur mesure.
          </p>
          <Link 
            href="/candidature-spontanee"
            style={{
              background: '#fd7e14',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '25px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '1.1rem'
            }}
          >
            📄 Candidature spontanée
          </Link>
        </div>
      </div>
    </>
  );
}
