// pages/api/submit-project.js - API pour soumettre un projet
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  console.log('🚀 API submit-project appelée');
  console.log('Méthode:', req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Méthode non autorisée',
      expected: 'POST'
    });
  }

  try {
    const {
      title,
      company,
      contactEmail,
      contactPhone,
      projectType,
      description,
      technologies,
      budget,
      duration,
      startDate,
      location,
      requirements,
      companySize,
      urgency
    } = req.body;

    console.log('📋 Données projet reçues:', { title, company, contactEmail, projectType });

    // Validation des champs obligatoires
    const requiredFields = { title, company, contactEmail, projectType, description };
    const missingFields = Object.keys(requiredFields).filter(
      key => !requiredFields[key] || requiredFields[key].trim() === ''
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Champs obligatoires manquants',
        missingFields
      });
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return res.status(400).json({
        error: 'Format d\'email invalide'
      });
    }

    // Configuration SMTP
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      debug: true,
      logger: true
    });

    // Vérifier la connexion SMTP
    try {
      await transporter.verify();
      console.log('✅ Connexion SMTP validée');
    } catch (smtpError) {
      console.error('❌ Erreur connexion SMTP:', smtpError);
      return res.status(500).json({
        error: 'Erreur de configuration email'
      });
    }

    // Email HTML pour l'admin
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 26px;">💼 SM Consulting</h1>
          <p style="margin: 10px 0 0; opacity: 0.9; font-size: 16px;">Nouveau projet soumis</p>
        </div>
        
        <div style="padding: 30px; background-color: #f8fafc;">
          <h2 style="color: #1a365d; margin-top: 0; font-size: 24px;">📋 Détails du projet</h2>
          
          <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="color: #fd7e14; margin-top: 0; font-size: 20px;">🎯 Informations Générales</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: 600; color: #2d3748;">Titre:</td><td style="padding: 8px 0;">${title}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600; color: #2d3748;">Type:</td><td style="padding: 8px 0;">${projectType}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600; color: #2d3748;">Urgence:</td><td style="padding: 8px 0;">
                <span style="background: ${urgency === 'Élevée' ? '#fee2e2' : urgency === 'Moyenne' ? '#fef3c7' : '#f0fdf4'}; 
                           color: ${urgency === 'Élevée' ? '#dc2626' : urgency === 'Moyenne' ? '#d97706' : '#16a34a'}; 
                           padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600;">
                  ${urgency || 'Moyenne'}
                </span>
              </td></tr>
            </table>
          </div>

          <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="color: #fd7e14; margin-top: 0; font-size: 20px;">🏢 Entreprise</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: 600; color: #2d3748;">Nom:</td><td style="padding: 8px 0;">${company}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600; color: #2d3748;">Taille:</td><td style="padding: 8px 0;">${companySize || 'Non spécifiée'}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600; color: #2d3748;">Email:</td><td style="padding: 8px 0;"><a href="mailto:${contactEmail}" style="color: #3b82f6;">${contactEmail}</a></td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600; color: #2d3748;">Téléphone:</td><td style="padding: 8px 0;">${contactPhone || 'Non fourni'}</td></tr>
            </table>
          </div>

          <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="color: #fd7e14; margin-top: 0; font-size: 20px;">📝 Description</h3>
            <p style="line-height: 1.6; color: #374151; white-space: pre-line; margin: 0;">${description}</p>
          </div>

          ${technologies ? `
            <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h3 style="color: #fd7e14; margin-top: 0; font-size: 20px;">💻 Technologies</h3>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${technologies.split(',').map(tech => 
                  `<span style="background: #eff6ff; color: #2563eb; padding: 6px 14px; border-radius: 20px; font-size: 13px; font-weight: 500;">${tech.trim()}</span>`
                ).join('')}
              </div>
            </div>
          ` : ''}

          <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h3 style="color: #fd7e14; margin-top: 0; font-size: 20px;">💰 Détails Commerciaux</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: 600; color: #2d3748;">Budget:</td><td style="padding: 8px 0;">${budget || 'À discuter'}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600; color: #2d3748;">Durée:</td><td style="padding: 8px 0;">${duration || 'À définir'}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600; color: #2d3748;">Début:</td><td style="padding: 8px 0;">${startDate ? new Date(startDate).toLocaleDateString('fr-FR') : 'À définir'}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: 600; color: #2d3748;">Localisation:</td><td style="padding: 8px 0;">${location || 'Non spécifiée'}</td></tr>
            </table>
          </div>

          ${requirements ? `
            <div style="background: white; padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
              <h3 style="color: #fd7e14; margin-top: 0; font-size: 20px;">🎯 Exigences & Compétences</h3>
              <p style="line-height: 1.6; color: #374151; white-space: pre-line; margin: 0;">${requirements}</p>
            </div>
          ` : ''}

          <div style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); padding: 20px; border-radius: 12px; text-align: center;">
            <h3 style="color: white; margin: 0 0 10px; font-size: 18px;">⚡ Actions Rapides</h3>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
              <a href="mailto:${contactEmail}?subject=Concernant votre projet: ${encodeURIComponent(title)}" 
                 style="background: rgba(255,255,255,0.2); color: white; padding: 10px 20px; border-radius: 25px; text-decoration: none; font-weight: 600; font-size: 14px;">
                📧 Répondre au client
              </a>
              <a href="tel:${contactPhone || ''}" 
                 style="background: rgba(255,255,255,0.2); color: white; padding: 10px 20px; border-radius: 25px; text-decoration: none; font-weight: 600; font-size: 14px;">
                📞 Appeler
              </a>
            </div>
          </div>
        </div>
        
        <div style="background-color: #2d3748; color: white; padding: 20px; text-align: center;">
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">
            📅 Soumis le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}
          </p>
          <p style="margin: 8px 0 0; font-size: 12px; opacity: 0.7;">
            SM Consulting - Plateforme de gestion des projets IT
          </p>
        </div>
      </div>
    `;

    // Envoyer email à l'admin
    const adminMailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL || 'admin@smconsulting.fr',
      subject: `🚀 Nouveau projet: ${title} - ${company}`,
      html: adminEmailContent,
      replyTo: contactEmail
    };

    console.log('📧 Envoi email admin...');
    const adminInfo = await transporter.sendMail(adminMailOptions);
    console.log('✅ Email admin envoyé:', adminInfo.messageId);

    // Email de confirmation au client
    const clientEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: white; padding: 40px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">✅ Projet soumis avec succès</h1>
          <p style="margin: 15px 0 0; opacity: 0.9; font-size: 16px;">SM Consulting</p>
        </div>
        
        <div style="padding: 40px 30px; background: #f8fafc;">
          <h2 style="color: #1a365d; margin: 0 0 20px; font-size: 22px;">Merci pour votre confiance !</h2>
          
          <p style="color: #374151; line-height: 1.6; font-size: 16px;">
            Nous avons bien reçu votre demande de projet <strong>"${title}"</strong>.
          </p>

          <div style="background: white; padding: 25px; border-radius: 12px; margin: 25px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <h3 style="color: #fd7e14; margin: 0 0 15px; font-size: 18px;">📋 Récapitulatif de votre demande</h3>
            <ul style="color: #374151; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li><strong>Projet:</strong> ${title}</li>
              <li><strong>Type:</strong> ${projectType}</li>
              <li><strong>Budget:</strong> ${budget || 'À discuter'}</li>
              <li><strong>Durée estimée:</strong> ${duration || 'À définir'}</li>
              <li><strong>Urgence:</strong> ${urgency || 'Moyenne'}</li>
            </ul>
          </div>

          <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 25px; border-radius: 12px; border-left: 4px solid #3b82f6; margin: 25px 0;">
            <h3 style="color: #1e40af; margin: 0 0 15px; font-size: 18px;">🚀 Prochaines étapes</h3>
            <ol style="color: #374151; line-height: 1.8; margin: 0; padding-left: 20px;">
              <li>Analyse de votre projet par notre équipe</li>
              <li>Sélection des freelances correspondant à vos besoins</li>
              <li>Contact sous <strong>48h maximum</strong> pour discuter de votre projet</li>
              <li>Présentation des profils sélectionnés</li>
            </ol>
          </div>

          <div style="background: #fef7cd; padding: 20px; border-radius: 12px; border-left: 4px solid #f59e0b; margin: 25px 0;">
            <h4 style="color: #92400e; margin: 0 0 10px; font-size: 16px;">⚡ Projet urgent ?</h4>
            <p style="color: #78350f; margin: 0; line-height: 1.6;">
              Pour les projets urgents, contactez-nous directement au 
              <strong>01 XX XX XX XX</strong> ou répondez à cet email.
            </p>
          </div>

          <p style="color: #6b7280; line-height: 1.6; font-size: 15px; margin: 30px 0;">
            Notre équipe d'experts va maintenant analyser votre demande et identifier les freelances les plus qualifiés pour votre projet.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:contact@smconsulting.fr?subject=Complément d'information - ${encodeURIComponent(title)}" 
               style="background: linear-gradient(135deg, #fd7e14 0%, #e67e22 100%); color: white; padding: 15px 30px; border-radius: 25px; text-decoration: none; font-weight: 600; display: inline-block; font-size: 16px;">
              📧 Nous contacter
            </a>
          </div>
        </div>
        
        <div style="background-color: #2d3748; color: white; padding: 25px; text-align: center;">
          <h3 style="margin: 0 0 15px; font-size: 18px;">🌟 Pourquoi SM Consulting ?</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div>
              <div style="font-size: 24px; font-weight: bold; color: #fd7e14;">195+</div>
              <div style="font-size: 13px; opacity: 0.8;">Freelances experts</div>
            </div>
            <div>
              <div style="font-size: 24px; font-weight: bold; color: #22c55e;">48h</div>
              <div style="font-size: 13px; opacity: 0.8;">Délai de réponse</div>
            </div>
          </div>
          <p style="margin: 0; font-size: 13px; opacity: 0.7;">
            SM Consulting - Votre partenaire IT de confiance
          </p>
        </div>
      </div>
    `;

    const clientMailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: contactEmail,
      subject: `✅ Confirmation de soumission - ${title}`,
      html: clientEmailContent
    };

    console.log('📧 Envoi email confirmation client...');
    await transporter.sendMail(clientMailOptions);
    console.log('✅ Email confirmation client envoyé');

    // Réponse de succès
    res.status(200).json({
      message: 'Projet soumis avec succès',
      data: {
        id: Date.now(), // ID temporaire
        title,
        company,
        contactEmail,
        projectType,
        submissionDate: new Date().toISOString(),
        status: 'En attente de validation'
      }
    });

  } catch (error) {
    console.error('❌ Erreur soumission projet:', {
      message: error.message,
      stack: error.stack
    });

    res.status(500).json({
      error: 'Erreur lors de la soumission du projet',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}