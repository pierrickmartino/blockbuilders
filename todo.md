# Task List

## Core
- Utiliser Renovate pour la gestion des dépendances des packages Node
- Mettre en place un CI/CD pipeline pour automatiser les déploiements
- Créer une page avec un exemple de chaque composant
- Fix lint issues (`npm run lint`)

## Frontend
- Ajouter un mode sombre (dark mode)
- Améliorer les couleurs
- Ajouter un contour aux alertes
- Utiliser un bleu foncé (ou autre) pour couleur principale
- Revoir le fonctionnement du breadcrumbs
- Le nom d'utilisateur n'est pas sauvegardé lors de l'enregistrement
- Corriger le problème de gradient sur les graphes
- Revoir le CSS du bouton d'action dans les tableaux

## Dashboard
- Ajouter un widget graphique avec l'évolution du nombre de trades par jour/mois
- Ajouter un calendrier du mois avec le nombre de trades par journée
- Ajouter la fonctionnalité d'édition d'un wallet
- Ajuster la position des `Chip` dans le `WalletTable`
- Repenser l'affichage du widget *Activity* pour les écrans mobiles
- Ouvrir un drawer au clic sur un wallet avec les infos de positions

## Position
- Déplacer le filtrage pour mieux l’intégrer au reste de la page
- Ajouter les indicateurs tels que EMA, RSI, etc.
- [Fix] Augmentation sans limite sur la page générique
- Mettre à jour les widgets de *Stats*
- Faire la somme des *capital gain daily* pour afficher dans le graphique
- Repositionner les % dans le tableau pour diminuer la taille des lignes
- Ouvrir un drawer au clic sur une position avec les infos de transactions

## Transaction
- Déplacer le *MarketPrice* sur un widget graphique montrant l’évolution du prix
- [Fix] Augmentation sans limite sur la page générique
- Faire la somme des *capital gain daily* pour afficher dans le graphique
- Utiliser ETH pour le graphique du token WETH
- Ouvrir un drawer au clic sur une transaction avec des infos à déterminer
- Limiter la taille des informations en montrant la totalité via un *tooltip*

## Backend
- Mettre une position en "suspicious" doit supprimer les transactions associées au contract
- Revoir les logs des tasks pour identifier les lenteurs
- Optimiser les traitements :
  - `create_transactions_from_polygon_erc20_task` : 3.72s
  - `calculate_cost_transaction_task` : 7.06s
  - `calculate_running_quantity_transaction_task` : 5.28s
- Migrer vers Etherscan API V2
- Un utilisateur ne doit pas voir les données d’un autre (à finaliser sur toutes les vues)
