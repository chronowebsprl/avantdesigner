# CheckMaCession — dossier prêt à déployer

## Contenu
- Site React/Vite
- Landing page
- Tunnel : formule > upload > paiement > analyse > rapport
- Formules : Juridique 49 €, Financier 49 €, Dossier 360° 89 €
- Structure Vercel
- API Stripe et IA prévues côté serveur

## Déploiement sans toucher au code
1. Va sur Vercel.
2. Crée un nouveau projet.
3. Importe ce dossier.
4. Ajoute les variables présentes dans `.env.example`.
5. Clique sur Deploy.
6. Branche ensuite ton nom de domaine.

## Important
Ne jamais mettre les clés Stripe ou IA dans le code visible.
Elles doivent être ajoutées dans Vercel > Settings > Environment Variables.
