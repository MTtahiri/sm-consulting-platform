// pages/api/test-smtp.js - VERSION CORRIGÉE
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  console.log('🧪 [TEST-SMTP] Début du test...');

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Méthode non autorisée' 
    });
  }

  try {
    // 1. Vérification des variables d'environnement
    console.log('🔍 [TEST-SMTP] Vérification des variables...');
    
    const config = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    console.log('📋 [TEST-SMTP] Configuration:', {
      host: config.host ? '✓' : '✗',
      port: config.port,
      secure: config.secure,
      user: config.auth.user ? '✓' : '✗',
      pass: config.auth.pass ? '✓ (masqué)' : '✗',
    });

    // Vérifier les variables manquantes
    const missing = [];
    if (!config.host) missing.push('SMTP_HOST');
    if (!config.auth.user) missing.push('SMTP_USER');
    if (!config.auth.pass) missing.push('SMTP_PASS');

    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Variables SMTP manquantes',
        missing: missing,
        help: 'Vérifiez votre fichier .env.local'
      });
    }

    // 2. Création du transporteur - CORRECTION ICI
    console.log('🚀 [TEST-SMTP] Création du transporteur...');
    const transporter = nodemailer.createTransport(config); // ✅ createTransport (sans "er")

    // 3. Test de connexion
    console.log('🔌 [TEST-SMTP] Test de connexion...');
    await transporter.verify();
    console.log('✅ [TEST-SMTP] Connexion SMTP réussie !');

    // 4. Envoi d'un email de test
    const { testEmail } = req.body;
    const emailTest = testEmail || process.env.SMTP_USER;

    console.log('📤 [TEST-SMTP] Envoi email de test vers:', emailTest);

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: emailTest,
      subject: '✅ Test SMTP - SM Consulting',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1a365d; text-align: center;">
            🎉 Configuration SMTP Réussie !
          </h2>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
            <h3 style="color: #15803d;">✅ Test concluant</h3>
            <p>Votre configuration SMTP fonctionne parfaitement !</p>
          </div>

          <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px;">
            <h4>📊 Détails de configuration :</h4>
            <ul>
              <li><strong>Serveur SMTP :</strong> ${config.host}</li>
              <li><strong>Port :</strong> ${config.port}</li>
              <li><strong>Sécurité :</strong> ${config.secure ? 'TLS/SSL' : 'STARTTLS'}</li>
              <li><strong>Utilisateur :</strong> ${config.auth.user}</li>
              <li><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</li>
            </ul>
          </div>

          <p style="text-align: center; margin-top: 30px;">
            <strong>🚀 Vous pouvez maintenant utiliser l'API inscription-recruteur !</strong>
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ [TEST-SMTP] Email envoyé :', info.messageId);

    return res.status(200).json({
      success: true,
      message: 'Configuration SMTP validée avec succès !',
      data: {
        messageId: info.messageId,
        emailSent: emailTest,
        config: {
          host: config.host,
          port: config.port,
          secure: config.secure,
          user: config.auth.user
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ [TEST-SMTP] Erreur:', error);

    let errorMessage = 'Erreur SMTP inconnue';
    let helpMessage = '';

    // Diagnostic des erreurs courantes
    if (error.code === 'EAUTH') {
      errorMessage = 'Erreur d\'authentification';
      helpMessage = 'Vérifiez SMTP_USER et SMTP_PASS. Pour Gmail, utilisez un mot de passe d\'application.';
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = 'Serveur SMTP introuvable';
      helpMessage = 'Vérifiez SMTP_HOST dans votre fichier .env.local';
    } else if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      errorMessage = 'Impossible de se connecter au serveur';
      helpMessage = 'Vérifiez votre connexion internet et les paramètres de port/sécurité';
    } else if (error.message.includes('Invalid login')) {
      errorMessage = 'Identifiants incorrects';
      helpMessage = 'Vérifiez votre email et mot de passe. Pour Gmail, activez les mots de passe d\'application.';
    }

    return res.status(500).json({
      success: false,
      error: errorMessage,
      help: helpMessage,
      details: process.env.NODE_ENV === 'development' ? {
        code: error.code,
        message: error.message,
        command: error.command
      } : undefined
    });
  }
}