# LocationPickerMap Component

Un composant de sélection de lieu basé sur Leaflet et OpenStreetMap avec recherche et géocodage inverse.

## 🚀 Fonctionnalités

- **Carte OpenStreetMap interactive** : Fond de carte complet avec tous les lieux existants
- **Recherche de lieux** : Barre de recherche avec autocomplétion via Nominatim
- **Sélection par clic** : Cliquez sur la carte pour sélectionner un lieu
- **Géocodage inverse** : Adresse automatique récupérée depuis les coordonnées
- **Interface moderne** : Modal responsive avec contrôles intuitifs
- **Centré sur Cotonou** : Position par défaut au Bénin

## 📦 Installation

```bash
npm install react-leaflet leaflet @types/leaflet
```

## 🎯 Utilisation

```tsx
import { LocationPickerMap } from './components/LocationPickerMap';

const [isOpen, setIsOpen] = useState(false);
const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

const handleLocationSelect = (location: Location) => {
  setSelectedLocation(location);
  console.log('Location selected:', location);
};

<LocationPickerMap
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onLocationSelect={handleLocationSelect}
  initialLocation={selectedLocation}
/>
```

## 🎨 Interface Location

```tsx
interface Location {
  lat: number;
  lng: number;
  address: string;
}
```

## 🛠️ Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | `false` | Contrôle l'affichage du modal |
| `onClose` | `() => void` | - | Callback appelé lors de la fermeture |
| `onLocationSelect` | `(location: Location) => void` | - | Callback appelé lors de la sélection d'un lieu |
| `initialLocation` | `Location \| null` | `null` | Lieu initialement sélectionné |

## 🎯 Fonctionnalités détaillées

### Recherche de lieux
- Barre de recherche avec debouncing (500ms)
- Autocomplétion via l'API Nominatim
- Restriction aux résultats du Bénin (`countrycodes=bj`)
- Affichage des résultats avec coordonnées

### Sélection par clic
- Clic sur la carte pour placer un marqueur
- Géocodage inverse automatique via Nominatim
- Récupération de l'adresse complète
- Fallback vers coordonnées si géocodage échoue

### Interface utilisateur
- Modal responsive (80vh sur desktop, 90vh sur mobile)
- Marqueur rouge avec icône 📍
- Boutons "Réinitialiser" et "Confirmer"
- Affichage des coordonnées sélectionnées
- Animations et transitions fluides

## 🔧 API Nominatim

Le composant utilise l'API Nominatim d'OpenStreetMap pour :

### Recherche de lieux
```
GET https://nominatim.openstreetmap.org/search?format=json&q={query}&limit=5&addressdetails=1&countrycodes=bj
```

### Géocodage inverse
```
GET https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lng}&zoom=18&addressdetails=1
```

## 📱 Responsive

- **Desktop** : Modal 4xl avec hauteur 80vh
- **Mobile** : Modal 95vw avec hauteur 90vh
- **Recherche** : Résultats limités à 40vh sur desktop, 30vh sur mobile
- **Carte** : Adaptée automatiquement à la taille du conteneur

## 🎨 Styles CSS

Les styles sont inclus dans `LocationPickerMap.css` et incluent :

```css
/* Marqueur personnalisé */
.location-marker {
  background: transparent;
  border: none;
}

/* Scrollbar personnalisée */
.search-results::-webkit-scrollbar {
  width: 6px;
}

/* Animations */
@keyframes modalFadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

## 🚀 Performance

- **Debouncing** : Recherche limitée à 500ms d'intervalle
- **Lazy loading** : Carte chargée uniquement quand le modal est ouvert
- **Gestion d'erreur** : Fallbacks pour les échecs de géocodage
- **Nettoyage** : Timeouts et listeners nettoyés automatiquement

## 🔧 Personnalisation

### Changer le centre par défaut
```tsx
// Dans LocationPickerMap.tsx
const defaultCenter: [number, number] = [6.370293, 2.391236]; // Cotonou
```

### Modifier le marqueur
```tsx
const locationMarkerIcon = L.divIcon({
  className: 'location-marker',
  html: `<div style="...">📍</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24]
});
```

### Ajuster la recherche
```tsx
// Limiter les résultats
const response = await fetch(
  `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=3&countrycodes=bj`
);
```

## 📄 Licence

Ce composant utilise :
- **Leaflet** : MIT License
- **OpenStreetMap** : Open Database License
- **Nominatim** : Open Database License
- **React Leaflet** : MIT License

## 🐛 Dépannage

### Carte ne s'affiche pas
- Vérifiez que `react-leaflet` et `leaflet` sont installés
- Assurez-vous que le CSS Leaflet est importé

### Recherche ne fonctionne pas
- Vérifiez la connexion internet
- L'API Nominatim peut avoir des limites de taux

### Géocodage inverse échoue
- Le composant utilise un fallback vers les coordonnées
- Vérifiez les logs de la console pour plus de détails
