# 🧾 NoteFrais - Gestionnaire de Tickets de Caisse

NoteFrais est une application mobile développée en React Native (Expo) qui permet de numériser et de centraliser ses tickets de caisse et notes de frais. 
Ce projet a été réalisé en Solo dans le cadre de l'évaluation finale du module "Développement Mobile" (Bachelor 3).

## 🎯 Fonctionnalités principales (CRUD & Natif)

- **Authentification sécurisée** : Inscription, connexion et persistance de la session.
- **Ajout de dépenses (Create)** : Saisie du nom, montant et ajout d'une photo du ticket depuis la galerie du téléphone (Fonctionnalité native).
- **Consultation (Read)** : Liste de l'historique des dépenses et affichage du ticket en plein écran via une Modal.
- **Suppression (Delete)** : Possibilité de supprimer une dépense.
- **Profil utilisateur** : Gestion de la déconnexion.

## 🛠️ Stack Technique & Architecture

- **Frontend** : React Native avec le framework [Expo](https://expo.dev/).
- **Navigation** : `expo-router` (Navigation par onglets : 3 écrans).
- **Backend as a Service (BaaS)** : [Supabase](https://supabase.com/).
  - *Auth* : Gestion des utilisateurs.
  - *Database* : PostgreSQL avec sécurité RLS (Row Level Security) pour isoler les données par utilisateur.
  - *Storage* : Hébergement des images des tickets de caisse.
- **Modules Natifs utilisés** : 
  - `expo-image-picker` (Accès à la galerie).
  - `expo-file-system` (Conversion de l'image en base64 pour l'upload).

## 🚀 Comment lancer le projet localement ?

1. Clonez ce dépôt :
   ```bash
   git clone https://github.com/Onyxia84/DevMobile.git

Installez les dépendances :npm install

Configurez les variables d'environnement :
Créez un fichier .env à la racine et ajoutez vos clés Supabase :EXPO_PUBLIC_SUPABASE_URL=votre_url_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_supabase

Lancez l'application :npx expo start


👨‍💻 Auteur

Projet réalisé en Solo.