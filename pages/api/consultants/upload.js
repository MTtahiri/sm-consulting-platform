// pages/api/consultants/upload.js - VERSION WINDOWS
import Airtable from "airtable";
import { IncomingForm } from "formidable";
import fs from "fs";
import os from "os";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Chemin temporaire correct pour Windows
    const tmpDir = os.tmpdir();
    
    const form = new IncomingForm({
      uploadDir: tmpDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const cvFile = files.cv?.[0];
    if (!cvFile) {
      return res.status(400).json({ error: "No CV file provided" });
    }

    // Parser les données du consultant
    const consultantData = JSON.parse(fields.consultantData?.[0] || "{}");

    // Initialiser Airtable
    const base = new Airtable({ 
      apiKey: process.env.AIRTABLE_API_KEY 
    }).base(process.env.AIRTABLE_BASE_ID);

    // Préparer les données pour Airtable
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

    const records = await base("Table 1").create([
      { fields: recordData }
    ]);

    // Nettoyer le fichier temporaire
    if (fs.existsSync(cvFile.filepath)) {
      await fs.promises.unlink(cvFile.filepath);
    }

    res.status(200).json({
      success: true,
      message: "Candidature enregistree avec succes dans Airtable!",
      recordId: records[0].getId(),
      candidate: recordData.prenom + " " + recordData.nom
    });

  } catch (error) {
    console.error("Erreur upload consultant:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors de lenregistrement",
      details: error.message
    });
  }
}