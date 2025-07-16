# Configuration BPay

## Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# BPay Configuration
BPAY_MERCHANT_ID=ton_id_merchant
BPAY_API_KEY=ta_clé_secrète
NEXT_PUBLIC_BASE_URL=https://1ere-classe.vercel.app

# Pour le développement local
# NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Étapes de configuration

1. **Obtenir les clés BPay** :
   - Contactez Bankily pour obtenir votre `MERCHANT_ID` et `API_KEY`
   - Configurez votre URL de callback : `https://votre-domaine.com/api/bpay-callback`

2. **Tester l'intégration** :
   - Utilisez un compte BPay de test
   - Vérifiez les logs dans la console pour les callbacks

3. **Production** :
   - Remplacez les URLs de test par les URLs de production
   - Configurez les webhooks BPay pour pointer vers votre domaine

## Utilisation du composant BPayButton

```tsx
import BPayButton from '@/components/BPayButton'

<BPayButton
  amount={2500}
  phone="+222123456789"
  bookingId="booking-123"
  onSuccess={() => console.log('Paiement réussi')}
  onError={(error) => console.error('Erreur:', error)}
/>
```

## Structure des données

### Payload envoyé à BPay
```json
{
  "merchant_id": "votre_merchant_id",
  "phone": "+222123456789",
  "amount": 2500,
  "reference": "booking-123",
  "callback_url": "https://votre-domaine.com/api/bpay-callback"
}
```

### Callback reçu de BPay
```json
{
  "reference": "booking-123",
  "status": "SUCCESS",
  "transaction_id": "txn_123456789"
}
```

## Notes importantes

- ⚠️ Les endpoints BPay sont fictifs et doivent être remplacés par les vrais endpoints
- 🔐 Gardez vos clés API secrètes et ne les committez jamais
- 📞 Testez avec un vrai compte BPay avant la mise en production
- 🔄 Implémentez la logique de mise à jour de la base de données dans le callback 