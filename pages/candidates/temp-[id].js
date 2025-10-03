// pages/candidates/[id].js - Page détail candidat
import { useRouter } from 'next/router'

export default function CandidateDetail() {
  const router = useRouter()
  const { id } = router.query

  if (!id) {
    return <div>Chargement...</div>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Profil Consultant #{id}</h1>
      <p>Détails du consultant SM Consulting</p>
      <p><strong>ID:</strong> {id}</p>
      <p><strong>Spécialité:</strong> Développeur Full-Stack</p>
      <p><strong>Expérience:</strong> 5+ ans</p>
      <a href="/candidates">← Retour à la liste</a>
    </div>
  )
}
