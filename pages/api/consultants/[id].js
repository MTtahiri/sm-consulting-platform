import { fetchData } from '../../../lib/googleSheetsGoogleApis';

export default async function handler(req, res) {
  try {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'ID manquant' });

    const consultants = await fetchData();
    const consultant = consultants.find(c => c.id === id);

    if (!consultant) return res.status(404).json({ error: 'Consultant non trouvé' });

    return res.status(200).json(consultant);
  } catch (error) {
    console.error('Erreur API consultants/[id]:', error);
    return res.status(500).json({ error: 'Erreur serveur interne' });
  }
}
