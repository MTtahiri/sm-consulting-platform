# Base de données des Consultants IT

Ce repository contient les données des consultants IT pour la plateforme de recrutement.

## Structure des données

Le fichier `consultants.json` contient un tableau d'objets avec ces propriétés :

- `id`: Identifiant unique
- `name`: Nom complet
- `position`: Poste/Title
- `experience`: Années d'expérience
- `skills`: Tableau de compétences techniques
- `status`: Statut (Disponible/En mission)
- `location`: Localisation
- `rate`: TJM (Taux Journalier Moyen)
- `formation`: Formation/Éducation
- `contract`: Type de contrat
- `level`: Niveau (junior/senior/expert)
- `availability`: Disponibilité

## Mise à jour des données

1. Éditez le fichier `consultants.json`
2. Committez les changements
3. Les données seront automatiquement chargées sur la plateforme

## Plateforme

La plateforme est disponible à l'adresse: [Lien Vercel]

## API GitHub

Les données sont accessibles via l'API GitHub :
`https://api.github.com/repos/[username]/consultants-data/contents/consultants.json`
