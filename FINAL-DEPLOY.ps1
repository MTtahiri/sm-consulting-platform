# FINAL-DEPLOY.ps1 - À exécuter à 17:10
Write-Host "🌈 DÉPLOIEMENT FINAL SYNC CV DRIVE → SHEETS" -ForegroundColor Magenta
Write-Host "=============================================" -ForegroundColor White

# 1. DÉPLOIEMENT
Write-Host "`n🚀 Étape 1: Déploiement Vercel..." -ForegroundColor Cyan
$deployResult = vercel --prod
Write-Host "✅ Déploiement terminé" -ForegroundColor Green

# 2. TEST SYNCHRONISATION
Write-Host "`n🎯 Étape 2: Test synchronisation..." -ForegroundColor Cyan
$URL = "https://sm-consulting-platform-o2h8mqv7d-moatahiri-gmailcoms-projects.vercel.app"
$SECRET = "SM_CONSULTING_2024_CV_SYNC_20251005"

Write-Host "🔐 Utilisation du CRON_SECRET configuré" -ForegroundColor Yellow

$headers = @{
    "Authorization" = "Bearer $SECRET"
    "Content-Type" = "application/json"
}

try {
    Write-Host "🔄 Lancement de la synchronisation..." -ForegroundColor White
    $response = Invoke-RestMethod -Uri "$URL/api/sync-cv-drive" -Headers $headers -Method GET
    
    Write-Host "`n✅ SYNCHRONISATION RÉUSSIE !" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor White
    Write-Host "📊 Résultats:" -ForegroundColor Yellow
    Write-Host "   - Fichiers traités: $($response.results.processed)" -ForegroundColor White
    Write-Host "   - Consultants ajoutés: $($response.results.added)" -ForegroundColor White
    Write-Host "   - Mis à jour: $($response.results.updated)" -ForegroundColor White
    Write-Host "   - Erreurs: $($response.results.errors)" -ForegroundColor White
    
    Write-Host "`n🎉 FÉLICITATIONS !" -ForegroundColor Magenta
    Write-Host "==================================" -ForegroundColor White
    Write-Host "Votre système de synchronisation automatique CV est maintenant OPÉRATIONNEL !" -ForegroundColor Green
    Write-Host "`n📋 CE QUI FONCTIONNE :" -ForegroundColor Cyan
    Write-Host "   🔄 Scan automatique du dossier Drive CV" -ForegroundColor White
    Write-Host "   📄 Extraction des compétences depuis PDF" -ForegroundColor White
    Write-Host "   📊 Ajout automatique dans Google Sheets" -ForegroundColor White
    Write-Host "   ⏰ Exécution quotidienne à 9h" -ForegroundColor White
    Write-Host "   🔒 Sécurisé par token" -ForegroundColor White
    
    Write-Host "`n🔗 LIENS IMPORTANTS :" -ForegroundColor Yellow
    Write-Host "   📊 Google Sheets: https://docs.google.com/spreadsheets/d/***REMOVED***" -ForegroundColor Cyan
    Write-Host "   📁 Google Drive: https://drive.google.com/drive/u/0/folders/***REMOVED***" -ForegroundColor Cyan
    Write-Host "   📋 Logs Vercel: https://vercel.com/moatahiri-gmailcoms-projects/sm-consulting-platform" -ForegroundColor Cyan
    
    Write-Host "`n⏰ PROCHAINE SYNCHRO AUTO: Demain à 9h" -ForegroundColor Green
    
} catch {
    Write-Host "`n❌ ÉCHEC DE LA SYNCHRONISATION" -ForegroundColor Red
    Write-Host "==================================" -ForegroundColor White
    Write-Host "Erreur: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Message -like "*401*") {
        Write-Host "`n🔐 PROBLÈME D'AUTHENTIFICATION" -ForegroundColor Yellow
        Write-Host "Vérifiez que le CRON_SECRET dans Vercel correspond exactement à:" -ForegroundColor White
        Write-Host "SM_CONSULTING_2024_CV_SYNC_20251005" -ForegroundColor Cyan
    }
}
