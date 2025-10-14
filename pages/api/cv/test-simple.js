// pages/api/cv/test-simple.js
export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="test.pdf"');
  res.send(Buffer.from('%PDF-test-simple'));
}
