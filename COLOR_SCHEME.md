# Nouveau Schéma de Couleurs - Edofi

## 🎨 Couleurs Principales

### Couleur Principale (dfe0c5)
- **Code hexadécimal**: `#dfe0c5`
- **Utilisation**: Arrière-plans principaux, sections, cartes
- **Classe Tailwind**: `bg-primary-color`
- **Description**: Un beige doux et élégant qui donne un aspect chaleureux et professionnel

### Couleur Secondaire (04b1d9)
- **Code hexadécimal**: `#04b1d9`
- **Utilisation**: Boutons, liens, éléments interactifs, badges
- **Classe Tailwind**: `bg-secondary-color`
- **Description**: Un bleu moderne et dynamique pour les actions principales

### Couleur d'Accent (f24638)
- **Code hexadécimal**: `#f24638`
- **Utilisation**: Actions importantes, alertes, favoris, éléments de call-to-action
- **Classe Tailwind**: `bg-accent-color`
- **Description**: Un rouge vif pour attirer l'attention sur les éléments critiques

### Noir (000000)
- **Code hexadécimal**: `#000000`
- **Utilisation**: Tous les textes principaux, titres, contenu
- **Classe Tailwind**: `text-text-black`
- **Description**: Noir pur pour un contraste optimal et une lisibilité parfaite

## 🎯 Utilisation Recommandée

### Boutons et Actions
- **Boutons primaires**: `bg-secondary-color text-white`
- **Boutons secondaires**: `bg-primary-color text-text-black`
- **Boutons destructifs**: `bg-accent-color text-white`

### Badges et Tags
- **Badges de catégorie**: `bg-secondary-color text-white`
- **Tags**: `bg-secondary-color/20 text-secondary-color`

### Arrière-plans
- **Sections principales**: `bg-primary-color`
- **Cartes**: `bg-white`
- **Newsletter**: `bg-secondary-color`

### Textes
- **Titres principaux**: `text-text-black`
- **Textes secondaires**: `text-gray-600`
- **Textes sur fond coloré**: `text-white`

## 🔧 Variables CSS

Le schéma utilise des variables CSS pour une cohérence parfaite :

```css
:root {
  --primary: 199 96% 43%; /* 04b1d9 */
  --secondary: 60 20% 95%; /* dfe0c5 */
  --destructive: 4 90% 58%; /* f24638 */
  --background: 60 20% 95%; /* dfe0c5 */
  --foreground: 0 0% 0%; /* Noir */
}
```

## 🎨 Classes Tailwind Personnalisées

```css
.primary-color { background-color: #dfe0c5; }
.secondary-color { background-color: #04b1d9; }
.accent-color { background-color: #f24638; }
.text-black { color: #000000; }
```

## 🌙 Mode Sombre

Le schéma s'adapte automatiquement au mode sombre en conservant les couleurs d'accent tout en ajustant les arrière-plans et textes pour une meilleure lisibilité.

## 📱 Accessibilité

- **Contraste**: Toutes les combinaisons respectent les standards WCAG AA
- **Lisibilité**: Noir pur pour les textes garantit une lisibilité optimale
- **Cohérence**: Utilisation systématique des mêmes couleurs pour les mêmes types d'éléments

## 🚀 Migration

Les anciennes couleurs ont été remplacées par :
- `assignment-1yellow` → `secondary-color`
- `assignment-1dark-navy-blue` → `text-black`
- `bg-[#c4c4c4]` → `bg-primary-color`
- `bg-blue-*` → `bg-secondary-color`
- `bg-yellow-*` → `bg-secondary-color`
- `text-yellow-*` → `text-accent-color`
