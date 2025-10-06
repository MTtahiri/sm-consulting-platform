import nodemailer from 'nodemailer';

// Configuration des transporteurs SMTP selon provider
const getTransporter = (provider = 'custom') => {
  const configs = {
    gmail: {
      host: '***REMOVED***',
      port: ***REMOVED***,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    },
    outlook: {
      host: 'smtp.office365.com',
      port: ***REMOVED***,
      secure: false,
      auth: {
        user: process.env.OUTLOOK_USER,
        pass: process.env.OUTLOOK_PASSWORD,
      },
    },
    custom: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  };

  return nodemailer.createTransport(configs[provider] || configs.custom);
};

// Templates HTML pour différents types d'emails
const getTestEmailTemplates = () => ({
  welcome: {
    subject: '🧪 Test - Email de bienvenue SM Consulting',
    html: `<div>...contenu HTML complet...</div>` // Remplacer par le contenu complet que tu souhaites
  },
  recruiterAccess: {
    subject: '🧪 Test - Accès recruteur validé',
    html: `<div>...contenu HTML personnalisé...</div>`
  },
  // Ajouter autant de templates que nécessaire
});

// Test de connexion SMTP
async function testSMTPConnection(transporter) {
  try {
    const verified = await transporter.verify();
    return { connected: true, verified, message: 'Connexion SMTP réussie' };
  } catch (error) {
    return {
      connected: false,
      verified: false,
      message: 'Échec de connexion SMTP',
      error: error.message,
      code: error.code,
    };
  }
}

// Génération des recommandations basées sur les résultats
function generateEmailRecommendations(smtpTest, emailResult, provider) {
  const recommendations = [];

  if (!smtpTest.connected) {
    recommendations.push({
      type: 'error',
      category: 'SMTP',
      message: "Impossible de se connecter au serveur SMTP",
      actions: [
        "Vérifier les paramètres SMTP dans .env",
        "Vérifier que le port n'est pas bloqué",
        "Tester avec un autre fournisseur"
      ],
    });
  }

  if (smtpTest.connected && !smtpTest.verified) {
    recommendations.push({
      type: 'warning',
      category: 'Authentification',
      message: "Connexion établie mais authentification échouée",
      actions: [
        "Vérifier username/password",
        "Activer 'Applications moins sécurisées' (Gmail)",
        "Utiliser un mot de passe d'application (Gmail/Outlook)"
      ],
    });
  }

  if (!emailResult.sent && emailResult.error) {
    recommendations.push({
      type: 'error',
      category: 'Envoi',
      message: `Échec d'envoi: ${emailResult.error}`,
      actions: [
        "Vérifier l'adresse expéditeur",
        "Vérifier que le domaine est autorisé",
        "Vérifier les quotas d'envoi"
      ],
    });
  }

  if (provider === 'gmail') {
    recommendations.push({
      type: 'info',
      category: 'Sécurité',
      message: 'Configuration Gmail détectée',
      actions: [
        "Utiliser un mot de passe d'application",
        "Activer 2FA sur le compte Gmail",
        "Considérer OAuth2 pour la production"
      ],
    });
  }

  if (emailResult.sent) {
    recommendations.push({
      type: 'success',
      category: 'Performance',
      message: "Email envoyé avec succès",
      actions: [
        "Monitorer les taux de livraison",
        "Configurer les enregistrements SPF/DKIM",
        "Surveiller la réputation du domaine"
      ],
    });
  }

  return recommendations;
}

// Validation simple d'adresse email
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Handler API principal
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const { testType = 'welcome', recipient, provider = 'custom', sendReal = false } = req.body;

  if (!recipient || !validateEmail(recipient)) {
    return res.status(400).json({ error: 'Adresse email destinataire invalide' });
  }

  try {
    const transporter = getTransporter(provider);
    const templates = getTestEmailTemplates();

    if (!templates[testType]) {
      return res.status(400).json({ error: 'Type de test invalide', availableTypes: Object.keys(templates) });
    }

    const template = templates[testType];
    const testEmail = recipient;

    // Test de connexion SMTP
    const connectionTest = await testSMTPConnection(transporter);

    let emailResult = { sent: false, messageId: null, error: null };

    if (sendReal && connectionTest.connected && connectionTest.verified) {
      try {
        const result = await transporter.sendMail({
          from: `"SM Consulting Test" <${process.env.SMTP_USER}>`,
          to: testEmail,
          subject: template.subject,
          html: template.html,
        });
        emailResult = {
          sent: true,
          messageId: result.messageId,
          response: result.response,
          envelope: result.envelope,
        };
      } catch (emailError) {
        emailResult = { sent: false, error: emailError.message, code: emailError.code };
      }
    }

    const recommendations = generateEmailRecommendations(connectionTest, emailResult, provider);

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      testType,
      provider,
      smtp: connectionTest,
      email: emailResult,
      recipient: testEmail,
      recommendations,
    });
  } catch (error) {
    console.error('Erreur test email:', error);
    return res.status(500).json({ error: 'Erreur lors du test email', message: error.message });
  }
}
