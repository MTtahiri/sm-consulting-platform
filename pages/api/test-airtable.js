export default async function handler(req, res) {
  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${encodeURIComponent(process.env.AIRTABLE_TABLE_NAME)}?maxRecords=3`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
      }
    );

    const data = await response.json();
    
    res.status(200).json({
      success: response.ok,
      status: response.status,
      records: data.records?.length || 0,
      error: data.error,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}