// pages/api/candidates/[id].js - API détail candidat
export default function handler(req, res) {
  const { id } = req.query
  
  if (req.method === 'GET') {
    // Simuler des données de candidat
    res.status(200).json({
      id: id,
      name: 'Consultant SM Consulting',
      speciality: 'Développeur Full-Stack',
      experience: '5+ ans',
      skills: ['React', 'Node.js', 'MongoDB']
    })
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
