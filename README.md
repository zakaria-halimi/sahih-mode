# SAHIH MODE — Boutique E-Commerce de Prêt-à-Porter de Luxe

Site e-commerce complet, minimaliste et luxueux conçu pour la marque marocaine **SAHIH MODE**.
Construit avec **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS** et **Supabase**.

---

## 🌟 Caractéristiques Principales

- **Identité Visuelle Haute Couture** : Palette strictement **Noir & Blanc**, typographie raffinée (*Playfair Display* pour les titres et *Inter* pour le corps), grandes photos et animations douces.
- **100% Mobile First & Responsive** : Conçu pour offrir une expérience fluide sur smartphone, tablette et écran large.
- **Commande WhatsApp Directe** :
  - Sur chaque fiche produit : commande pré-remplie avec nom, taille, couleur, quantité et prix.
  - Dans le panier : message complet récapitulant tous les articles avec total calculé en **MAD** (Dirham marocain).
  - Numéro WhatsApp administrable depuis l'espace de gestion.
- **Panier Persistant** : Sauvegardé automatiquement dans le navigateur via Zustand (`localStorage`).
- **Espace Admin Sécurisé (/admin)** :
  - Authentification email/mot de passe via Supabase Auth.
  - Tableau de bord avec statistiques en direct.
  - CRUD complet des vêtements : ajout, modification, suppression, upload de photos (Supabase Storage), gestion des stocks, tailles et couleurs.
  - Gestion des catégories.
  - Paramètres de la boutique (numéro WhatsApp, textes de vitrine).
- **Sécurité & Base de données** : PostgreSQL avec règles Row Level Security (RLS) complètes.

---

## 📁 Structure du Projet

```
sahih mode/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Accueil (Hero, Nouveautés, Catégories, Valeurs)
│   │   ├── boutique/                   # Boutique avec filtres, tri et recherche
│   │   │   ├── page.tsx
│   │   │   ├── ShopPageClient.tsx
│   │   │   └── [slug]/                 # Fiche produit détaillée + WhatsApp
│   │   │       ├── page.tsx
│   │   │       └── ProductDetailClient.tsx
│   │   ├── panier/                     # Panier interactif + commande WhatsApp
│   │   │   └── page.tsx
│   │   ├── contact/                    # À Propos, Philosophie & Contact direct
│   │   │   └── page.tsx
│   │   ├── admin/                      # Espace administration sécurisé
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                # Tableau de bord & métriques
│   │   │   ├── login/page.tsx          # Connexion admin
│   │   │   ├── produits/               # Liste et gestion des vêtements
│   │   │   ├── categories/             # Gestion des rayons
│   │   │   └── parametres/             # Configuration WhatsApp & textes
│   │   ├── layout.tsx                  # Layout racine avec Navbar, Footer, Toaster
│   │   ├── globals.css                 # Thème Noir & Blanc
│   │   └── not-found.tsx               # Page 404
│   ├── components/
│   │   ├── layout/                     # Navbar et Footer
│   │   ├── ui/                         # ProductCard, Button, Badge, Skeleton...
│   │   └── admin/                      # ProductForm, ImageUpload, ConfirmDialog, AdminSidebar
│   ├── lib/
│   │   ├── supabase/                   # Clients Supabase (navigateur & serveur)
│   │   ├── products.ts                 # Requêtes BDD
│   │   └── utils.ts                    # Formatage prix MAD, génération messages WhatsApp
│   ├── store/
│   │   └── cartStore.ts                # Store Zustand du panier
│   └── types/                          # Typages TypeScript (Product, Category, DB)
├── supabase/
│   ├── schema.sql                      # Tables, Triggers, RLS & Index
│   └── seed.sql                        # 10 vêtements d'exemple + catégories
├── .env.example
├── .env.local
├── package.json
└── README.md
```

---

## 🚀 Démarrage Rapide

### 1. Prérequis
- Node.js (v18+) installé
- Un compte gratuit sur [supabase.com](https://supabase.com)

### 2. Lancer le site en local

Ouvrez un terminal PowerShell :

```powershell
cd "C:\Users\zakar\OneDrive\Documents\sahih mode"
npm run dev
```

Ouvrez ensuite votre navigateur sur :
- **Boutique publique** : [http://localhost:3000](http://localhost:3000)
- **Espace Admin** : [http://localhost:3000/admin](http://localhost:3000/admin)

---

## 🗄️ Configuration de Supabase (Base de données & Auth)

### Étape 1 : Créer un projet Supabase
1. Rendez-vous sur [supabase.com](https://supabase.com) et créez un nouveau projet (ex: `sahih-mode-db`).
2. Choisissez une région proche (ex: Frankfurt ou Paris).

### Étape 2 : Exécuter les scripts SQL
1. Dans le tableau de bord Supabase, allez dans **SQL Editor**.
2. Copiez et exécutez le contenu de `supabase/schema.sql` (crée les tables, RLS et index).
3. Copiez et exécutez le contenu de `supabase/seed.sql` (insère 10 vêtements d'exemple avec photos).

### Étape 3 : Créer le Bucket de Stockage pour les images
1. Allez dans **Storage** > **New Bucket**.
2. Nommez le bucket : `product-images`.
3. Cochez **Public bucket** pour que les photos soient accessibles par les clients.

### Étape 4 : Créer votre compte Admin
1. Allez dans **Authentication** > **Users** > **Add user** > **Create user**.
2. Renseignez votre adresse email et un mot de passe sécurisé.

### Étape 5 : Renseigner les clés dans `.env.local`
Dans Supabase, allez dans **Project Settings** > **API** et copiez vos clés dans `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon-publique
SUPABASE_SERVICE_ROLE_KEY=votre-cle-service-role
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=212600000000
```

---

## 📱 Fonctionnement de la Commande WhatsApp

Le site est optimisé pour le marché marocain sans friction de paiement en ligne :

1. **Sur une fiche produit** :
   - Le client choisit sa taille, sa couleur et sa quantité.
   - En cliquant sur **"Commander via WhatsApp"**, une discussion WhatsApp s'ouvre avec un message formaté :
     ```text
     Bonjour SAHIH MODE, je souhaite commander :
     T-shirt Boxy Essentiel Noir - Taille L - Noir - Quantité 1 - Prix 290 MAD
     Total : 290 MAD
     Merci de valider ma commande.
     ```
2. **Depuis le panier d'achats** :
   - Le panier récapitule la totalité des articles choisis.
   - En cliquant sur **"Commander via WhatsApp"**, un message complet avec chaque ligne et le total est transmis.
3. Le vendeur valide la commande, confirme l'adresse de livraison et expédie le colis (paiement à la livraison).

---

## 🌐 Déploiement sur Vercel

1. Poussez votre code sur un dépôt GitHub.
2. Rendez-vous sur [vercel.com](https://vercel.com) et importez le dépôt.
3. Dans la section **Environment Variables**, ajoutez :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (URL de production de votre site)
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`
4. Cliquez sur **Deploy**. Votre site est en ligne avec certificat SSL et CDN mondial !
