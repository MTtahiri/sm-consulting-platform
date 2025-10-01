// api/airtable.js
const fetch = require('node-fetch');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(`https://api.airtable.com/v0/appNwg9iP8ub0cDCn/Candidats`, {
      headers: {
        'Authorization': 'Bearer pathXG85b7P96CnjE.8fe40141abdb308305bfb43100855b821751c55e38edf0680bce3a9d19243235'
      }
    });

    const data = await response.json();
    return res.json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
