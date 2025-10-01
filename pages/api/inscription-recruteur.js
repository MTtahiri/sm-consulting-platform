// pages/api/inscription-recruteur.js
import nodemailer from 'nodemailer';

// Configuration email (à adapter selon votre fournisseur)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '***REMOVED***',
  port: ***REMOVED***,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '***REMOVED***',
    pass: process.env.SMTP_PASS || 'your-email-password'
  }
});

// Fonction de validation email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Template email de confirmation
const getConfirmationEmailTemplate = (recruteurData) => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inscription Recruteur - SM Consulting</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #fd7e14 0%, #e67e22 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0 0 10px 0; font-size: 28px;">🎉 Bienvenue chez SM Consulting !</h1>
        <p style="margin: 0; font-size: 16px; opacity: 0.9;">Votre inscription recruteur a été validée</p>
    </div>
    
    <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
        <h2 style="color: #1a365d; margin-top: 0;">👋 Bonjour ${recruteurData.prenom} ${recruteurData.nom}</h2>
        <p>Félicitations ! Votre inscription en tant que recruteur sur la plateforme SM Consulting a été <strong>validée avec succès</strong>.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1a365d; margin-top: 0;">📊 Récapitulatif de votre inscription</h3>
            <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: 8px;"><strong>🏢 Entreprise :</strong> ${recruteurData.entreprise}</li>
                <li style="margin-bottom: 8px;"><strong>🎯 Secteur :</strong> ${recruteurData.secteurActivite}</li>
                <li style="margin-bottom: 8px;"><strong>👥 Taille :</strong> ${recruteurData.tailleEntreprise}</li>
                <li style="margin-bottom: 8px;"><strong>📈 Volume annuel :</strong> ${recruteurData.volumeRecrutementAnnuel}</li>
            </ul>
        </div>
    </div>

    <div style="background: #dcfce7; border: 2px solid #bbf7d0; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
        <h3 style="color: #166534; margin-top: 0;">🔐 Vos accès recruteur</h3>
        <p style="color: #166534; margin-bottom: 15px;"><strong>Vous avez maintenant accès à :</strong></p>
        <ul style="color: #166534;">
            <li>✅ <strong>195+ candidats IT vérifiés</strong> dans notre vivier</li>
            <li>✅ <strong>Recherche avancée</strong> par compétences et critères</li>
            <li>✅ <strong>Contact direct</strong> avec les candidats</li>
            <li>✅ <strong>Dashboard personnalisé</strong> de suivi</li>
            <li>✅ <strong>Support dédié</strong> de notre équipe</li>
        </ul>
        
        <div style="text-align: center; margin-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/candidates" 
               style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                🚀 Accéder au vivier de candidats
            </a>
        </div>
    </div>

    <div style="background: #fef3c7; border: 1px solid #fed7aa; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
        <h3 style="color: #92400e; margin-top: 0;">📞 Prochaines étapes</h3>
        <p style="color: #a16207; margin-bottom: 10px;">Notre équipe va vous contacter dans les prochaines 48h pour :</p>
        <ul style="color: #a16207;">
            <li>📋 Finaliser votre profil et préciser vos besoins</li>
            <li>🎯 Vous présenter les candidats les plus pertinents</li>
            <li>🤝 Vous accompagner dans vos premiers recrutements</li>
            <li>📊 Vous former à l'utilisation optimale de la plateforme</li>
        </ul>
    </div>

    <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; text-align: center;">
        <h3 style="color: #1a365d; margin-top: 0;">📧 Besoin d'aide ?</h3>
        <p style="color: #4a5568; margin-bottom: 15px;">Notre équipe est à votre disposition :</p>
        <p style="color: #1a365d;">
            <strong>📞 +33 6 19 25 75 88</strong><br>
            <strong>✉️ ***REMOVED***</strong>
        </p>
    </div>

    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
        <p style="color: #6b7280; font-size: 14px;">
            © ${new Date().getFullYear()} SM Consulting - Plateforme de recrutement IT spécialisée
            <br>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/rgpd-droits" style="color: #fd7e14;">Gérer mes préférences RGPD</a>
        </p>
    </div>
</body>
</html>
  `;
};

// Template email notification interne
const getInternalNotificationTemplate = (recruteurData) => {
  return `
    <h2>🔔 Nouvelle inscription recruteur</h2>
    <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
    
    <h3>👤 Contact</h3>
    <ul>
      <li><strong>Nom :</strong> ${recruteurData.prenom} ${recruteurData.nom}</li>
      <li><strong>Email :</strong> ${recruteurData.email}</li>
      <li><strong>Téléphone :</strong> ${recruteurData.telephone}</li>
      <li><strong>Poste :</strong> ${recruteurData.poste}</li>
    </ul>
    
    <h3>🏢 Entreprise</h3>
    <ul>
      <li><strong>Nom :</strong> ${recruteurData.entreprise}</li>
      <li><strong>Secteur :</strong> ${recruteurData.secteurActivite}</li>
      <li><strong>Taille :</strong> ${recruteurData.tailleEntreprise}</li>
      <li><strong>Site web :</strong> ${recruteurData.siteWeb || 'Non renseigné'}</li>
      <li><strong>Localisation :</strong> ${recruteurData.adresseEntreprise}</li>
    </ul>
    
    <h3>🎯 Besoins</h3>
    <ul>
      <li><strong>Volume annuel :</strong> ${recruteurData.volumeRecrutementAnnuel}</li>
      <li><strong>Budget moyen :</strong> ${recruteurData.budgetMoyenParRecrutement || 'Non défini'}</li>
      <li><strong>Urgence :</strong> ${recruteurData.urgenceRecrutement || 'Non précisée'}</li>
      <li><strong>Type contrat :</strong> ${recruteurData.typeContrat || 'Flexible'}</li>
      <li><strong>Modalité :</strong> ${recruteurData.modaliteTravail || 'Flexible'}</li>
    </ul>
    
    <h3>💼 Rôles recherchés</h3>
    <p>${recruteurData.rolesCherches || 'Non spécifié'}</p>
    
    ${recruteurData.commentaires ? `
    <h3>💬 Commentaires</h3>
    <p>${recruteurData.commentaires}</p>
    ` : ''}
    
    <hr>
    <p><strong>Action requise :</strong> Contacter le recruteur sous 24h pour finaliser l'inscription.</p>
  `;
};

export default async function handler(req, res) {
  // Configuration CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Méthode non autorisée',
      allowedMethods: ['POST'] 
    });
  }

  try {
    const recruteurData = req.body;

    // Validation des champs obligatoires
    const requiredFields = ['prenom', 'nom', 'email', 'telephone', 'entreprise', 'secteurActivite', 'tailleEntreprise'];
    const missingFields = requiredFields.filter(field => !recruteurData[field] || recruteurData[field].trim() === '');
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Champs manquants',
        missingFields,
        message: `Les champs suivants sont obligatoires: ${missingFields.join(', ')}`
      });
    }

    // Validation email
    if (!isValidEmail(recruteurData.email)) {
      return res.status(400).json({
        error: 'Email invalide',
        message: 'Veuillez fournir une adresse email valide'
      });
    }

    // Validation acceptation conditions
    if (!recruteurData.accepteConditions || !recruteurData.accepteRGPD) {
      return res.status(400).json({
        error: 'Acceptation requise',
        message: 'Vous devez accepter les conditions d\'utilisation et la politique RGPD'
      });
    }

    // Génération ID unique pour le recruteur
    const recruiterId = `REC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Données complètes à sauvegarder
    const completeRecruiterData = {
      ...recruteurData,
      id: recruiterId,
      dateInscription: new Date().toISOString(),
      statut: 'Validé',
      source: 'Website',
      ipAddress: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      userAgent: req.headers['user-agent']
    };

    // Simulation de sauvegarde en base (à remplacer par vraie DB)
    console.log('💾 Données recruteur sauvegardées:', {
      id: recruiterId,
      email: recruteurData.email,
      entreprise: recruteurData.entreprise,
      dateInscription: completeRecruiterData.dateInscription
    });

    // Envoi email de confirmation au recruteur
    try {
      await transporter.sendMail({
        from: '"SM Consulting" <***REMOVED***>',
        to: recruteurData.email,
        subject: '🎉 Inscription validée - Accès recruteur SM Consulting',
        html: getConfirmationEmailTemplate(recruteurData)
      });
      console.log('✅ Email de confirmation envoyé à:', recruteurData.email);
    } catch (emailError) {
      console.error('❌ Erreur envoi email confirmation:', emailError);
      // Ne pas faire échouer l'inscription si l'email ne part pas
    }

    // Notification interne à l'équipe
    try {
      await transporter.sendMail({
        from: '"SM Consulting System" <noreply@rh-prospects.fr>',
        to: '***REMOVED***',
        subject: `🔔 Nouvelle inscription recruteur: ${recruteurData.entreprise}`,
        html: getInternalNotificationTemplate(recruteurData)
      });
      console.log('✅ Notification interne envoyée');
    } catch (emailError) {
      console.error('❌ Erreur notification interne:', emailError);
    }

    // Réponse de succès
    return res.status(200).json({
      success: true,
      message: 'Inscription recruteur validée avec succès',
      recruiterId: recruiterId,
      data: {
        email: recruteurData.email,
        entreprise: recruteurData.entreprise,
        dateInscription: completeRecruiterData.dateInscription,
        statut: 'Validé'
      },
      nextSteps: [
        'Email de confirmation envoyé',
        'Accès au vivier de candidats activé',
        'Contact de notre équipe sous 48h'
      ]
    });

  } catch (error) {
    console.error('❌ Erreur API inscription recruteur:', error);
    
    return res.status(500).json({
      error: 'Erreur interne du serveur',
      message: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.',
      timestamp: new Date().toISOString()
    });
  }
}

// Fonction utilitaire pour tester l'API
export const testInscriptionRecruteur = async (testData) => {
  console.log('🧪 Test inscription recruteur:', testData);
  
  const sampleData = {
    prenom: 'Jean',
    nom: 'Dupont',
    email: 'jean.dupont@test-entreprise.com',
    telephone: '06 12 34 56 78',
    poste: 'Directeur RH',
    entreprise: 'Test Entreprise',
    secteurActivite: 'E-commerce/Retail',
    tailleEntreprise: 'PME (50-250)',
    siteWeb: 'https://www.test-entreprise.com',
    adresseEntreprise: 'Paris, France',
    volumeRecrutementAnnuel: '3-5 recrutements',
    budgetMoyenParRecrutement: '15-25k€',
    rolesCherches: 'Développeur Frontend, Développeur Backend',
    urgenceRecrutement: 'Court terme (1-3 mois)',
    typeContrat: 'CDI + Freelance selon besoin',
    modaliteTravail: 'Hybride (2-3j bureau)',
    commentaires: 'Recherche urgente de développeurs pour notre équipe produit',
    accepteConditions: true,
    accepteRGPD: true,
    ...testData
  };

  return sampleData;
};