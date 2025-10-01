// pages/candidate/profile.js
import { useRouter } from 'next/router';

export default function CandidateProfile() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Profil Consultant {id}</h1>
      <p>Page en cours de développement</p>
    </div>
  );
}