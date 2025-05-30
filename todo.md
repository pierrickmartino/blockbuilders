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
- Le nom d'utilisateur n'est pas sauvegardé lors de l'enregistrement
- Revoir le CSS du bouton d'action dans les tableaux

## Dashboard
- Ajouter un widget graphique avec l'évolution du nombre de trades par jour/mois
- Ajouter un calendrier du mois avec le nombre de trades par journée
- Ajouter un widget présentant les inflow/outflow
- Ajouter la fonctionnalité d'édition d'un wallet
- Ajouter un graph avec l'historique des capital gain sur les 6 derniers mois
- Repenser l'affichage du widget *Activity* pour les écrans mobiles
- [ **In progress** ] Ouvrir un drawer au clic sur un wallet avec les infos de positions
- Fix ajout d'un wallet avec refresh de la page
- Fix suppression d'un wallet avec refresh de la page

## Position
- Ajouter les indicateurs tels que EMA, RSI, etc.
- Mettre à jour les widgets de *Stats*
- [ **In progress** ] Ouvrir un drawer au clic sur une position avec les infos de transactions

## Transaction
- Ajouter un selecteur de timeframe pour l'affichage des widgets (Last 30 days, Last 90 days, Last 120 days)
- [ **In progress** ] Ouvrir un drawer au clic sur une transaction avec des infos à déterminer

## Backend
- Mettre une position en "suspicious" doit supprimer les transactions associées au contract
- Revoir les logs des tasks pour identifier les lenteurs
- Optimiser les traitements :
  - `create_transactions_from_polygon_erc20_task` : 3.72s
  - `calculate_cost_transaction_task` : 7.06s
  - `calculate_running_quantity_transaction_task` : 5.28s
- Migrer vers Etherscan API V2
- Un utilisateur ne doit pas voir les données d’un autre (à finaliser sur toutes les vues)
