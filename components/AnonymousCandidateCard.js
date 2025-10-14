// components/AnonymousCandidateCard.js

export default function AnonymousCandidateCard({ candidate, index }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      {/* En-tête avec logo */}
      <div className="flex items-center mb-4">
        <img
          src="/images/logo-sm-consulting.png"
          alt="SM Consulting"
          className="h-12 w-auto mr-3"
        />
        <h2 className="text-xl font-bold text-gray-800">Candidat #{index + 1}</h2>
      </div>

      {/* Localisation et statut */}
      <p className="text-sm text-gray-500 mb-4">
        Région : {candidate.region || 'Île-de-France'} &nbsp;|&nbsp; Statut : {candidate.status || 'Freelance'}
      </p>

      {/* Compétences */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">Compétences techniques</h3>
        <ul className="list-disc list-inside text-gray-600">
          {candidate.skills.map((skill, i) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </div>

      {/* Expériences pertinentes */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">Expériences pertinentes</h3>
        <ul className="list-disc list-inside text-gray-600">
          {candidate.experiences.map((exp, i) => (
            <li key={i}>{exp.title} — {exp.duration}</li>
          ))}
        </ul>
      </div>

      {/* Formations */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-700 mb-2">Formations</h3>
        <ul className="list-disc list-inside text-gray-600">
          {candidate.education.map((edu, i) => (
            <li key={i}>{edu.degree} — {edu.year}</li>
          ))}
        </ul>
      </div>

      {/* Bouton Voir CV (génération anonyme) */}
      <button
        className="bg-orange text-white px-4 py-2 rounded-lg hover:bg-orange/90 transition"
        onClick={() => alert(`Générer CV anonyme pour Candidat #${index + 1}`)}
      >
        Voir le CV
      </button>
    </div>
  )
}
