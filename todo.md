# Task List

## Core
- Utiliser Renovate pour la gestion des dépendances des packages Node
- Mettre en place un CI/CD pipeline pour automatiser les déploiements
- Créer une page avec un exemple de chaque composant
- Fix lint issues (`npm run lint`)

## Frontend
- Le nom d'utilisateur n'est pas sauvegardé lors de l'enregistrement

## Dashboard
- Ajouter un widget graphique avec l'évolution du nombre de trades par jour/mois
- Ajouter un calendrier du mois avec le nombre de trades par journée
- Ajouter un widget présentant les inflow/outflow

## Position
- Ajouter les indicateurs tels que EMA, RSI, etc.
- Mettre à jour les widgets de *Stats*
- [ **In progress** ] Ouvrir un drawer au clic sur une position avec les infos de transactions

## Transaction
- Ajouter un selecteur de timeframe pour l'affichage des widgets (Last 30 days, Last 90 days, Last 120 days)
- [ **In progress** ] Ouvrir un drawer au clic sur une transaction avec des infos à déterminer

## Backend
- Migrer vers FastAPI
- Fix transaction_cost quand un swap passe par une addresse tierce (jumper)
- Mettre une position en "suspicious" doit supprimer les transactions associées au contract
- Revoir les logs des tasks pour identifier les lenteurs
- Optimiser les traitements :
  - `create_transactions_from_polygon_erc20_task` : 3.72s
  - `calculate_cost_transaction_task` : 7.06s
  - `calculate_running_quantity_transaction_task` : 5.28s
- Migrer vers Etherscan API V2
- Un utilisateur ne doit pas voir les données d’un autre (à finaliser sur toutes les vues)
