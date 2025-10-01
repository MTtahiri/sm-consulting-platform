// scripts/check-config.js - Script de vérification de la configuration
const fs = require('fs');
const path = require('path');

console.log('🔍 VÉRIFICATION DE CONFIGURATION SM CONSULTING');
console.log('=' .repeat(60));

// 1. Vérifier les variables d'environnement
console.log('\n📧 Variables d\'environnement SMTP:');
const envVars = [
  'SMTP_HOST',
  'SMTP_PORT', 
  'SMTP_USER',
  'SMTP_PASS',
  'SMTP_FROM',
  'ADMIN_EMAIL',
  'PORTAGE_EMAIL'
];

envVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  const display = value ? (varName.includes('PASS') ? '***hidden***' : value) : 'NON DÉFINIE';
  console.log(`${status} ${varName}: ${display}`);
});

// 2. Vérifier la structure des dossiers
console.log('\n📁 Structure des dossiers:');
const folders = [
  'pages',
  'pages/api', 
  'public',
  'public/uploads',
  'public/uploads/cv'
];

folders.forEach(folder => {
  const folderPath = path.join(process.cwd(), folder);
  const exists = fs.existsSync(folderPath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${folder}/`);
  
  if (!exists && folder === 'public/uploads/cv') {
    console.log('   ⚠️  Tentative de création...');
    try {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log('   ✅ Dossier créé avec succès');
    } catch (error) {
      console.log('   ❌ Erreur création:', error.message);
    }
  }
});

// 3. Vérifier les APIs
console.log('\n🔌 APIs disponibles:');
const apis = [
  'pages/api/upload-cv.js',
  'pages/api/inscription-recruteur.js', 
  'pages/api/submit-project.js',
  'pages/api/portage-contact.js'
];

apis.forEach(apiPath => {
  const fullPath = path.join(process.cwd(), apiPath);
  const exists = fs.existsSync(fullPath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${apiPath}`);
});

// 4. Vérifier les pages
console.log('\n📄 Pages principales:');
const pages = [
  'pages/projets.js',
  'pages/portage-salarial.js'
];

pages.forEach(pagePath => {
  const fullPath = path.join(process.cwd(), pagePath);
  const exists = fs.existsSync(fullPath);
  const status = exists ? '✅' : '❌';
  console.log(`${status} ${pagePath}`);
});

// 5. Vérifier les dépendances
console.log('\n📦 Dépendances requises:');
const packageJsonPath = path.join(process.cwd(), 'package.json');

if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const requiredDeps = [
    'next',
    'react', 
    'react-dom',
    'nodemailer',
    'formidable'
  ];
  
  requiredDeps.forEach(dep => {
    const installed = dependencies[dep];
    const status = installed ? '✅' : '❌';
    const version = installed ? `(${installed})` : 'NON INSTALLÉE';
    console.log(`${status} ${dep} ${version}`);
  });
} else {
  console.log('❌ package.json non trouvé');
}

// 6. Recommandations
console.log('\n💡 RECOMMANDATIONS:');
console.log('');

if (!process.env.SMTP_USER) {
  console.log('📧 Configurez vos paramètres SMTP:');
  console.log('   Créez un fichier .env.local avec:');
  console.log('   ***REMOVED***');
  console.log('   ***REMOVED***');
  console.log('   SMTP_USER=votre@email.com');
  console.log('   SMTP_PASS=votre_mot_de_passe');
  console.log('   ADMIN_EMAIL=admin@smconsulting.fr');
  console.log('   PORTAGE_EMAIL=portage@smconsulting.fr');
  console.log('');
}

console.log('🚀 Pour installer les dépendances manquantes:');
console.log('   npm install formidable nodemailer');
console.log('');

console.log('🔧 Pour tester les APIs:');
console.log('   1. Démarrez le serveur: npm run dev');
console.log('   2. Testez upload CV: POST /api/upload-cv');
console.log('   3. Testez inscription: POST /api/inscription-recruteur');
console.log('   4. Testez projets: POST /api/submit-project');
console.log('   5. Testez portage: POST /api/portage-contact');
console.log('');

console.log('🌐 URLs de test:');
console.log('   • http://localhost:3000/projets');
console.log('   • http://localhost:3000/portage-salarial');
console.log('');

console.log('=' .repeat(60));
console.log('✨ Vérification terminée !');

// 7. Test basique de configuration SMTP
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  console.log('\n🧪 TEST SMTP...');
  
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || '***REMOVED***',
    port: process.env.SMTP_PORT || ***REMOVED***,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  });
  
  transporter.verify()
    .then(() => {
      console.log('✅ Configuration SMTP valide !');
    })
    .catch((error) => {
      console.log('❌ Erreur SMTP:', error.message);
      console.log('💡 Vérifiez vos paramètres SMTP dans .env.local');
    });
}