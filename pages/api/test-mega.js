import { getMegaStorage } from '../../lib/megaClient';

export default function handler(req, res) {
  const storage = getMegaStorage();

  storage.once('ready', () => {
    res.status(200).json({ message: 'Connexion MEGA réussie' });
  });

  storage.once('error', (err) => {
    res.status(500).json({ error: err.message });
  });
}
