// pages/api/cv/debug-auth.js - DEBUG AUTH
export default function handler(req, res) {
  console.log("🔐 Debug Auth API appelée");
  
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.CRON_SECRET;
  
  console.log("Auth Header:", authHeader);
  console.log("Expected Token:", expectedToken ? "PRÉSENT" : "MANQUANT");
  console.log("Token Match:", authHeader === `Bearer ${expectedToken}`);
  
  if (!authHeader) {
    return res.status(401).json({ 
      error: "No authorization header",
      received: null,
      expected: "Bearer CRON_SECRET"
    });
  }
  
  if (authHeader !== `Bearer ${expectedToken}`) {
    return res.status(401).json({ 
      error: "Token mismatch",
      received: authHeader,
      expected_length: expectedToken ? expectedToken.length : 0,
      received_length: authHeader.length
    });
  }
  
  res.status(200).json({
    success: true,
    message: "Auth successful!",
    token_status: "valid",
    timestamp: new Date().toISOString()
  });
}
