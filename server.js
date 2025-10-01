// server.js - Serveur simple pour tester
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

const server = http.createServer((req, res) => {
  console.log('Requête:', req.url);
  
  if (req.url === '/candidates' || req.url === '/') {
    // Servir la page candidates
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>S.M. Consulting</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
        .candidate-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; }
        .candidate-card { background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .btn { padding: 10px 15px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
        .btn-primary { background: #3498db; color: white; }
        .btn-success { background: #27ae60; color: white; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 S.M. Consulting</h1>
            <p>Plateforme de Recrutement Anonyme</p>
            <p><strong>221</strong> consultants disponibles</p>
        </div>
        
        <div class="candidate-grid">
            <div class="candidate-card">
                <h3>Développeur Fullstack JavaScript Senior</h3>
                <p><strong>ID:</strong> 1 | <strong>Expérience:</strong> 5 ans</p>
                <p><strong>Compétences:</strong> React, Node.js, TypeScript, MongoDB</p>
                <p><strong>TJM:</strong> 400€ - 600€</p>
                <button class="btn btn-primary" onclick="generateCV(1)">👁️ Voir CV S.M.</button>
                <button class="btn btn-success" onclick="downloadCV(1)">📥 Télécharger CV S.M.</button>
            </div>
            
            <div class="candidate-card">
                <h3>Data Scientist Python</h3>
                <p><strong>ID:</strong> 2 | <strong>Expérience:</strong> 4 ans</p>
                <p><strong>Compétences:</strong> Python, Machine Learning, SQL, TensorFlow</p>
                <p><strong>TJM:</strong> 450€ - 650€</p>
                <button class="btn btn-primary" onclick="generateCV(2)">👁️ Voir CV S.M.</button>
                <button class="btn btn-success" onclick="downloadCV(2)">📥 Télécharger CV S.M.</button>
            </div>
        </div>
    </div>

    <script>
        function generateCV(id) {
            const cvContent = \`
FICHE CONSULTANT S.M. CONSULTING - ID: \${id}

POSTE: Développeur Fullstack JavaScript Senior
EXPERTISE: Confirmé | 5+ ans d'expérience
COMPÉTENCES: React, Node.js, TypeScript, MongoDB, AWS
TJM: 400€ - 600€ / jour
DISPONIBILITÉ: Immédiate

S.M. Consulting - www.sm-consulting.fr
            \`;
            alert(cvContent);
        }

        function downloadCV(id) {
            const cvContent = \`
FICHE CONSULTANT S.M. CONSULTING

ID: \${id}
POSTE: Développeur Fullstack JavaScript Senior
EXPERTISE: Confirmé | 5+ ans d'expérience
COMPÉTENCES: React, Node.js, TypeScript, MongoDB, AWS
TJM: 400€ - 600€ / jour
DISPONIBILITÉ: Immédiate

FORMATION: Master Informatique
SECTEURS: Tech, SaaS, E-commerce

S.M. Consulting
www.sm-consulting.fr
contact@sm-consulting.fr
+33 1 23 45 67 89
            \`;
            
            const blob = new Blob([cvContent], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = \`CV_SM_Consulting_\${id}.txt\`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            alert('✅ CV S.M. Consulting téléchargé!');
        }
    </script>
</body>
</html>
    `;
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Page non trouvée');
  }
});

server.listen(PORT, () => {
  console.log(\`🚀 Serveur S.M. Consulting démarré sur http://localhost:\${PORT}\`);
  console.log('✅ Les CVs S.M. Consulting sont fonctionnels!');
});
