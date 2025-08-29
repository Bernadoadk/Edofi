# EventMap Component

Un composant de carte interactive basé sur Leaflet et OpenStreetMap pour afficher les événements avec des marqueurs personnalisés.

## 🚀 Fonctionnalités

- **Carte OpenStreetMap** : Fond de carte complet avec tous les lieux existants
- **Marqueurs personnalisés** : Couleurs différentes selon la catégorie d'événement
- **Position utilisateur** : Marqueur bleu animé avec géolocalisation
- **Popups détaillés** : Informations complètes sur chaque événement
- **Contrôles de carte** : Zoom, centrage, vue par défaut
- **Responsive** : Adapté mobile et desktop
- **Centré sur Cotonou** : Position par défaut au Bénin

## 📦 Installation

```bash
npm install react-leaflet leaflet @types/leaflet
```

## 🎯 Utilisation

### Composant principal

```tsx
import { EventMap } from './components/EventMap';

const events = [
  {
    id: 1,
    title: "Concert de Jazz",
    description: "Une soirée exceptionnelle...",
    start_date: "2024-02-15",
    start_time: "20:00",
    location_address: "Sunset Bar, Cotonou",
    location_lat: 6.3705,
    location_lng: 2.3920,
    category_name: "Concert",
    banner_image: "concert.jpg"
  }
];

function App() {
  return (
    <EventMap 
      events={events}
      height="600px"
      showUserLocation={true}
    />
  );
}
```

### Composant de démonstration

```tsx
import { EventMapDemo } from './components/EventMap';

function App() {
  return <EventMapDemo />;
}
```

## 🎨 Personnalisation

### Couleurs par catégorie

```tsx
const colors = {
  'Concert': '#FF6B6B',
  'Conference': '#4ECDC4',
  'Exhibition': '#45B7D1',
  'Festival': '#96CEB4',
  'Networking': '#FFEAA7',
  'Sports': '#DDA0DD',
  'Theater': '#98D8C8',
  'Workshop': '#F7DC6F',
  'default': '#6C5CE7'
};
```

### Interface Event

```tsx
interface Event {
  id?: number;
  title: string;
  description: string;
  start_date: string;
  start_time: string;
  location_address: string;
  location_lat: number;
  location_lng: number;
  category_name?: string;
  banner_image?: string;
}
```

## 🛠️ Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `events` | `Event[]` | `[]` | Liste des événements à afficher |
| `height` | `string` | `"500px"` | Hauteur de la carte |
| `showUserLocation` | `boolean` | `true` | Afficher la position de l'utilisateur |

## 🎯 Fonctionnalités avancées

### Géolocalisation
- Détection automatique de la position utilisateur
- Marqueur animé avec effet de pulsation
- Centrage automatique sur la position utilisateur

### Contrôles de carte
- Zoom in/out
- Centrage sur position utilisateur
- Reset vers vue par défaut (Cotonou)
- Légende intégrée

### Popups enrichis
- Image de bannière de l'événement
- Titre et catégorie
- Date et heure formatées
- Adresse complète
- Description tronquée
- Bouton "Voir détails"

## 🔧 Préparation pour itinéraires

Le composant est préparé pour l'ajout futur de fonctionnalités d'itinéraire :

```tsx
// Exemple d'utilisation future
const getRouteToEvent = (eventLat: number, eventLng: number) => {
  // Intégration avec services d'itinéraire (Google Maps, OSRM, etc.)
  return `https://www.openstreetmap.org/directions?from=${userLat},${userLng}&to=${eventLat},${eventLng}`;
};
```

## 📱 Responsive

- Adapté aux écrans mobiles et desktop
- Contrôles optimisés pour le tactile
- Popups redimensionnés automatiquement

## 🌍 OpenStreetMap

Utilise OpenStreetMap comme fond de carte, offrant :
- Données cartographiques complètes
- Lieux existants (restaurants, hôtels, stations, etc.)
- Pas de clés API requises
- Données communautaires mises à jour

## 🎨 Styles CSS

Les styles sont inclus dans `EventMap.css` et peuvent être personnalisés :

```css
.event-popup .leaflet-popup-content-wrapper {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

## 🚀 Performance

- Chargement optimisé des tuiles OpenStreetMap
- Marqueurs rendus uniquement si visibles
- Géolocalisation avec timeout et gestion d'erreur
- Nettoyage automatique des listeners

## 📄 Licence

Ce composant utilise :
- **Leaflet** : MIT License
- **OpenStreetMap** : Open Database License
- **React Leaflet** : MIT License
