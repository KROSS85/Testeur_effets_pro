# 🧪 PROMPT OPTIMISÉ REPLIT - TESTEUR D'EFFETS VISUELS PROFESSIONNEL

## 🎯 CONTEXTE PROJET
Créer un outil de test professionnel pour effets visuels JavaScript destinés à la vente sur CodeCanyon, MotionElements, et autres marketplaces. L'outil doit permettre de valider la qualité commerciale des effets avant mise sur le marché.

---

## 🛠️ SPÉCIFICATIONS TECHNIQUES EXACTES

### **ARCHITECTURE REQUISE**
```
project-structure/
├── index.html (Interface principale)
├── css/
│   ├── tester.css (Interface stylée)
│   └── effects-preview.css (Rendu effets)
├── js/
│   ├── core/
│   │   ├── effect-loader.js (Chargement dynamique)
│   │   ├── performance-monitor.js (Monitoring temps réel)
│   │   └── export-manager.js (Export médias)
│   ├── ui/
│   │   ├── controls-panel.js (Panneau contrôles)
│   │   ├── parameter-editor.js (Éditeur paramètres)
│   │   └── results-display.js (Affichage résultats)
│   └── utils/
│       ├── canvas-recorder.js (Enregistrement canvas)
│       └── fps-calculator.js (Calcul FPS précis)
└── effects/ (Dossier pour tester les effets)
```

### **FONCTIONNALITÉS CORE OBLIGATOIRES**

#### 🎮 **1. INTERFACE DE TEST INTERACTIVE**
- **Zone de preview canvas** 800x600px redimensionnable
- **Panneau de contrôle latéral** avec sliders temps réel
- **Sélecteur d'effets** avec drag & drop de fichiers .js
- **Présets de test** (texte court, long, logo, image)
- **Simulateur de devices** (mobile, tablet, desktop, 4K)

#### 📊 **2. MONITORING PERFORMANCE EN TEMPS RÉEL**
```javascript
const METRIQUES_REQUISES = {
  fps: 'Calcul FPS en continu (min/max/moyenne)',
  memoire: 'Utilisation RAM en MB',
  cpu: 'Charge processeur en %',
  gpu: 'Utilisation GPU si disponible',
  temps_rendu: 'Temps par frame en ms',
  stabilite: 'Détection de lags/freezes'
};
```

#### 🎥 **3. SYSTÈME D'EXPORT PROFESSIONNEL**
- **Screenshots HD** (PNG transparents)
- **Vidéos de démo** (MP4, WebM, GIF optimisés)
- **Métriques de performance** (rapport JSON)
- **Code d'intégration** (snippets prêts à l'emploi)
- **Thumbnails marketplaces** (formats CodeCanyon, etc.)

#### 🧪 **4. TESTS DE COMPATIBILITÉ AUTOMATISÉS**
```javascript
const TESTS_COMPATIBILITE = {
  navigateurs: ['Chrome', 'Firefox', 'Safari', 'Edge'],
  resolutions: ['320x568', '768x1024', '1920x1080', '3840x2160'],
  performances: ['low-end', 'mid-range', 'high-end'],
  frameworks: ['vanilla-js', 'react', 'vue', 'angular']
};
```

---

## 🎨 **INTERFACE UTILISATEUR SPÉCIFIQUE**

### **LAYOUT REQUIS**
```
┌─────────────────────────────────────────────────────────┐
│ 🧪 EFFECT TESTER PRO          [⚙️] [📊] [💾] [🎥]      │
├─────────────────┬───────────────────────────────────────┤
│ 📁 EFFECTS      │ 🖼️ PREVIEW CANVAS (Responsive)        │
│ ┌─────────────┐ │ ┌─────────────────────────────────────┐ │
│ │ effect1.js  │ │ │                                     │ │
│ │ effect2.js  │ │ │     RENDU EFFET EN TEMPS RÉEL       │ │
│ │ + Ajouter   │ │ │                                     │ │
│ └─────────────┘ │ └─────────────────────────────────────┘ │
│                 │                                         │
│ ⚙️ PARAMÈTRES   │ 📊 MÉTRIQUES TEMPS RÉEL                │
│ ┌─────────────┐ │ ┌─────────────────────────────────────┐ │
│ │Vitesse: ▣▣▣ │ │ │ FPS: 60 │ RAM: 45MB │ CPU: 12%    │ │
│ │Intensité:▣▣ │ │ │ Status: ✅ OPTIMAL                  │ │
│ │Couleur: 🟢  │ │ └─────────────────────────────────────┘ │
│ └─────────────┘ │                                         │
├─────────────────┴───────────────────────────────────────┤
│ 🎬 EXPORT: [📷 Screenshot] [🎥 Demo Video] [📋 Report]  │
└─────────────────────────────────────────────────────────┘
```

### **CONTRÔLES AVANCÉS OBLIGATOIRES**
- **Timeline scrubber** pour contrôler la progression
- **Loop controls** (play, pause, reset, loop)
- **Speed multiplier** (0.1x à 5x)
- **Quality presets** (draft, preview, final)
- **Background options** (transparent, noir, blanc, custom)

---

## 🔥 **FONCTIONNALITÉS ADDICTION BUSINESS**

### **📈 MARKETPLACE COMPLIANCE**
```javascript
const MARKETPLACE_REQUIREMENTS = {
  codeCanyon: {
    formats: ['JS', 'jQuery Plugin', 'Vue Component'],
    documentation: 'README.md + API docs',
    demo: 'Live preview obligatoire',
    support: 'Documentation installation'
  },
  motionElements: {
    formats: ['After Effects', 'Premiere', 'Final Cut'],
    preview: 'Video 30sec + thumbnails',
    resolution: 'Minimum 1080p',
    categories: 'Motion Graphics, VFX, Transitions'
  }
};
```

### **🤖 AUTO-GÉNÉRATION MARKETING**
- **Descriptions SEO** auto-générées selon l'effet
- **Tags pertinents** extraits automatiquement
- **Prix suggérés** selon complexité et demande
- **Comparaisons concurrents** automatiques

### **⚡ OPTIMISATIONS PERFORMANCE AUTO**
```javascript
const AUTO_OPTIMIZATIONS = {
  frameRate: 'Détection et correction drops FPS',
  memoryLeaks: 'Détection fuites mémoire',
  codeMinify: 'Minification automatique',
  assetOptim: 'Compression images/textures'
};
```

---

## 🎯 **PROMPT FINAL OPTIMISÉ REPLIT**

```markdown
MISSION: Créer un testeur d'effets visuels JavaScript professionnel pour marketplace

SPÉCIFICATIONS EXACTES:
- Interface web complète avec zone preview canvas 800x600
- Monitoring performance temps réel (FPS, RAM, CPU)
- Système drag & drop pour charger effets .js
- Panneau paramètres dynamique avec sliders
- Export automatique (screenshots, vidéos, rapports)
- Tests compatibilité multi-navigateurs simulés
- Générateur de documentation marketplace
- Calcul prix suggéré selon complexité

TECHNOLOGIES IMPOSÉES:
- HTML5 Canvas pour preview
- JavaScript pur (pas de frameworks lourds)
- CSS Grid pour layout professionnel
- WebRTC pour enregistrement vidéo
- Web Workers pour monitoring performance
- FileReader API pour drag & drop

INTERFACE REQUISE:
Layout en 4 zones: liste effets (gauche), preview (centre), paramètres (droite), métriques (bas)
Design moderne type CodeCanyon avec thème sombre professionnel

EXPORT FORMATS:
- PNG transparent haute résolution
- MP4 demo 15 secondes loop
- JSON rapport performance complet
- Code snippet intégration prêt

PERFORMANCE TARGET:
Maintenir 60 FPS constant même avec effets complexes
Mémoire max 100MB par effet
Temps de chargement < 2 secondes

LIVRABLE: Application web complète fonctionnelle immédiatement
```

---

## 💎 **MAINTENANT TON EFFET DNA**

Montre-moi ton effet DNA complet et je vais te dire **EXACTEMENT** quoi ajouter pour le rendre **ABSOLUTELY INSANE** et **jamais vu** ! 🧬⚡

Les améliorations que j'ai en tête vont le transformer en **CHEF-D'ŒUVRE** vendable 500€+ facilement ! 💰