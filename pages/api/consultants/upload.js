// pages/api/consultants/upload.js - VERSION AVEC LOGS
import Airtable from "airtable";
import { IncomingForm } from "formidable";
import fs from "fs";
import os from "os";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log("🚀 API upload appelée");
  
  if (req.method !== "POST") {
    console.log("❌ Méthode non POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("📁 Configuration formidable...");
    const tmpDir = os.tmpdir();
    const form = new IncomingForm({
      uploadDir: tmpDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,
    });

    console.log("📤 Parsing du formulaire...");
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("❌ Erreur parsing:", err);
          reject(err);
        }
        console.log("✅ Parsing OK");
        resolve([fields, files]);
      });
    });

    console.log("🔍 Vérification fichier CV...");
    const cvFile = files.cv?.[0];
    if (!cvFile) {
      console.log("❌ Pas de CV");
      return res.status(400).json({ error: "No CV file provided" });
    }
    console.log("✅ CV trouvé:", cvFile.originalFilename);

    console.log("📋 Parsing données consultant...");
    const consultantData = JSON.parse(fields.consultantData?.[0] || "{}");
    console.log("✅ Données:", consultantData);

    console.log("🔗 Connexion Airtable...");
    if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
      console.error("❌ Variables Airtable manquantes!");
      return res.status(500).json({ error: "Configuration Airtable manquante" });
    }

    const base = new Airtable({
      apiKey: process.env.AIRTABLE_API_KEY
    }).base(process.env.AIRTABLE_BASE_ID);

    const recordData = {
      "prenom": consultantData.prenom || "",
      "nom": consultantData.nom || "",
      "email": consultantData.email || "",
      "telephone": consultantData.telephone || "",
      "poste": consultantData.poste || "",
      "competences": consultantData.competences || "",
      "cv_file_path": cvFile.originalFilename || "cv_uploaded.pdf",
      "statut": "Nouveau"
    };

    console.log("💾 Création enregistrement Airtable...");
    const records = await base("Table 1").create([
      { fields: recordData }
    ]);
    console.log("✅ Enregistrement créé:", records[0].getId());

    // Nettoyer le fichier temporaire
    if (fs.existsSync(cvFile.filepath)) {
      await fs.promises.unlink(cvFile.filepath);
      console.log("🗑️ Fichier temporaire supprimé");
    }

    console.log("🎉 Succès total!");
    return res.status(200).json({
      success: true,
      message: "Candidature enregistrée avec succès!",
      recordId: records[0].getId(),
      candidate: recordData.prenom + " " + recordData.nom
    });

  } catch (error) {
    console.error("💥 ERREUR GLOBALE:", error);
    return res.status(500).json({
      success: false,
      error: "Erreur lors de l'enregistrement",
      details: error.message
    });
  }
}