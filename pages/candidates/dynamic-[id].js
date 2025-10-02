// pages/candidates/[id].js - Page détail candidat
import { useRouter } from 'next/router'

export default function CandidateDetail() {
  const router = useRouter()
  const { id } = router.query

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Profil Consultant #{id}</h1>
      <p>Page de détail du consultant</p>
      <p>ID: {id}</p>
    </div>
  )
}
