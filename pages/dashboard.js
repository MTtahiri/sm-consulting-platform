import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';

// ... [TOUT LE CODE EXISTANT DU DASHBOARD JUSQU'À useEffect] ...

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // 🔥 APPELS RÉELS VERS VOS APIS
        const candidatesResponse = await fetch('/api/candidates');
        const candidatesData = await candidatesResponse.json();

        if (candidatesData && candidatesData.length > 0) {
          // Calculer les vraies statistiques depuis Google Sheets
          const totalCandidates = candidatesData.length;
          const activeCandidates = candidatesData.filter(c => 
            c.disponibilite && c.disponibilite.toLowerCase().includes('immédiate')
          ).length;
          
          const newThisWeek = candidatesData.filter(c => {
            if (!c.date_ajout) return false;
            const addedDate = new Date(c.date_ajout);
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return addedDate > oneWeekAgo;
          }).length;

          // 🔥 CORRECTION : Calcul du pourcentage de réussite RÉEL
          const successRate = totalCandidates > 0 ? Math.round((23 / totalCandidates) * 100) : 0;

          // Analyser les compétences pour le top skills
          const skillsCount = {};
          candidatesData.forEach(candidate => {
            if (candidate.competences) {
              candidate.competences.split(',').forEach(skill => {
                const trimmedSkill = skill.trim();
                if (trimmedSkill) {
                  skillsCount[trimmedSkill] = (skillsCount[trimmedSkill] || 0) + 1;
                }
              });
            }
          });

          const topSkillsData = Object.entries(skillsCount)
            .map(([skill, count]) => ({
              skill,
              count,
              percentage: Math.round((count / totalCandidates) * 100)
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

          // 🔥 CORRECTION : 1 projet actif comme demandé
          setStats({
            totalCandidates: totalCandidates,
            activeCandidates: activeCandidates,
            newThisWeek: newThisWeek,
            totalProjects: 6,
            activeProjects: 1, // 🔥 1 PROJET ACTIF COMME DEMANDÉ
            completedPlacements: 23,
            averageResponseTime: "24h",
            successRate: successRate // 🔥 POURCENTAGE RÉEL
          });

          setTopSkills(topSkillsData);

          // Générer l'activité récente depuis les candidats
          const recentCandidates = candidatesData
            .filter(c => c.date_ajout)
            .sort((a, b) => new Date(b.date_ajout) - new Date(a.date_ajout))
            .slice(0, 5)
            .map((candidate, index) => ({
              id: index + 1,
              type: 'new_candidate',
              message: `${candidate.titre || 'Consultant'} rejoint la plateforme`,
              timestamp: candidate.date_ajout,
              icon: '👨‍💻'
            }));
          
          setRecentActivity(recentCandidates);
        }

      } catch (error) {
        console.error('Erreur chargement dashboard:', error);
        // Fallback vers les données statiques en cas d'erreur
        setStats({
          totalCandidates: 221,
          activeCandidates: 180,
          newThisWeek: 8,
          totalProjects: 6,
          activeProjects: 1, // 🔥 1 PROJET ACTIF
          completedPlacements: 23,
          averageResponseTime: "24h",
          successRate: 10 // 🔥 POURCENTAGE RÉEL BASÉ SUR 221 CANDIDATS
        });
        
        setTopSkills([
          { skill: 'React', count: 89, percentage: 40 },
          { skill: 'Node.js', count: 76, percentage: 34 },
          { skill: 'Python', count: 68, percentage: 31 },
          { skill: 'Docker', count: 62, percentage: 28 },
          { skill: 'AWS', count: 54, percentage: 24 },
        ]);

        setRecentActivity([
          { id: 1, type: 'new_candidate', message: 'Sophie rejoint la plateforme (Développeuse React)', timestamp: '2024-01-28T10:30:00Z', icon: '👩‍💻' },
          { id: 2, type: 'project_application', message: '3 nouvelles candidatures sur "App E-commerce"', timestamp: '2024-01-28T09:15:00Z', icon: '📧' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    setCurrentTime(new Date().toLocaleString('fr-FR'));
  }, []);

// ... [LE RESTE DU CODE EXISTANT DU DASHBOARD] ...

// 🔥 CORRECTION : Métrique des projets avec icône 📂 et fond vert
function PerformanceMetrics({ stats }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: 16,
      padding: 30,
      boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
      marginBottom: 30,
    }}>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#1e40af',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        📈 Indicateurs de performance
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <MetricCard icon="⚡" value={stats.averageResponseTime} label="Délai moyen de réponse" bgGradient="linear-gradient(135deg,#22c55e,#166534)" />
        <MetricCard icon="📈" value={stats.successRate + "%"} label="Taux de réussite" bgGradient="linear-gradient(135deg,#8b5cf6,#6d28d9)" />
        {/* 🔥 NOUVEAU : Métrique projet actif avec fond vert */}
        <div style={{
          background: '#f0fdf4',
          borderRadius: 16,
          padding: 30,
          border: '2px solid #bbf7d0',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>📂</div>
          <div style={{ fontSize: '2.2rem', fontWeight: '700', color: '#16a34a', marginBottom: 4 }}>{stats.activeProjects}</div>
          <div style={{ color: '#64748b', fontSize: '14px' }}>Projet actif ({stats.totalProjects} total)</div>
        </div>
      </div>
    </div>
  );
}

// ... [LE RESTE DU CODE] ...

      {/* Footer et ScrollToTop */}
      <Footer />
      <ScrollToTop />
    </>
  );
}
