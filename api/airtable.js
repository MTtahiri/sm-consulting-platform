module.exports = async (req, res) => {
  return res.status(200).json({
    message: "API fonctionne",
    env: {
      hasApiKey: !!process.env.AIRTABLE_API_KEY,
      baseId: process.env.AIRTABLE_BASE_ID,
      tableName: process.env.AIRTABLE_TABLE_NAME
    }
  });
};
