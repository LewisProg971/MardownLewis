# Kinetic Zodiac - Premium Markdown Editor

A professional, cross-platform Markdown editor built with React, Vite, and Electron. Features a modern dark UI, real-time split preview, slash commands, and HTML export.

## Features

*   **Live Preview**: Real-time rendering of GitHub Flavored Markdown.
*   **Split View**: Customizable layout (Editor only, Preview only, or Split).
*   **Slash Commands**: Type `/` to insert headings, tables, lists, images, and more.
*   **HTML Export**: Export your document as a beautifully styled, standalone HTML file.
*   **Status Bar**: Live word and character counts.
*   **Desktop Integration**: Native file opening/saving (Ctrl+O, Ctrl+S) and drag-and-drop support.

## Prerequisites

*   **Node.js**: Version 18 or higher.
*   **Package Manager**: `npm` (included with Node.js).

## Installation

1.  Clone the repository or unzip the source code.
2.  Open a terminal in the project folder.
3.  Install dependencies:
    ```bash
    npm install
    ```

## Development

To run the application in development mode with hot-reloading:

```bash
npm run electron:dev
```

## Building the Application

### For Windows

Run the build command from a Windows machine:

```bash
npm run electron:build
```

This will generate an installer in `dist_electron/` (e.g., `Markdown Editor Setup 0.0.0.exe`).

### For macOS (M1/Intel)

Run the build command from a Mac:

```bash
npm run electron:build
```

*   This will generate a `.dmg` file in `dist_electron/`.
*   Note: The configuration is already set to target `dmg` for macOS.

## Usage Guide

### Shortcuts
*   **Open File**: `Ctrl + O` (Windows) / `Cmd + O` (Mac)
*   **Save File**: `Ctrl + S` (Windows) / `Cmd + S` (Mac)

### Interface
*   **Header Toolbar**:
    *   **Export Icon (Download)**: Save current file as HTML.
    *   **Eye Icon**: Toggle the Preview pane visibility.
    *   **Grid Icon**: Cycle through layouts (Split / Editor Only / Preview Only).

### Writing
*   **Slash Menu**: Type `/` at the start of a line to see a menu of block insertion options.
*   **Formatting**: Standard Markdown syntax is supported.

## Troubleshooting

*   **"Electron API not found"**: Ensure you are running via `npm run electron:dev` and not just `npm run dev` (which only opens the browser).
*   **Build Errors**: If `electron-builder` fails, try deleting the `dist` and `dist_electron` folders and running the build command again.

---

# Kinetic Zodiac - Éditeur Markdown Premium (Français)

Un éditeur Markdown professionnel multiplateforme conçu avec React, Vite et Electron. Interface sombre moderne, prévisualisation en temps réel, commandes slash ("/") et export HTML.

## Fonctionnalités

*   **Aperçu en Direct** : Rendu en temps réel du Markdown (GitHub Flavored).
*   **Vue Partagée** : Mise en page personnalisable (Éditeur seul, Aperçu seul ou Partagé).
*   **Commandes Slash** : Tapez `/` pour insérer des titres, tableaux, listes, images, etc.
*   **Export HTML** : Exportez votre document sous forme de fichier HTML autonome et stylisé.
*   **Barre d'État** : Compteur de mots et de caractères en direct.
*   **Intégration Bureau** : Ouverture/Sauvegarde native (Ctrl+O, Ctrl+S).

## Prérequis

*   **Node.js** : Version 18 ou supérieure.
*   **Gestionnaire de paquets** : `npm` (inclus avec Node.js).

## Installation

1.  Clonez le dépôt ou décompressez le code source.
2.  Ouvrez un terminal dans le dossier du projet.
3.  Installez les dépendances :
    ```bash
    npm install
    ```

## Développement

Pour lancer l'application en mode développement (avec rechargement à chaud) :

```bash
npm run electron:dev
```

## Compilation de l'Application (Build)

### Pour Windows

Lancez la commande de build depuis une machine Windows :

```bash
npm run electron:build
```

Cela générera un installateur dans `dist_electron/` (ex: `Markdown Editor Setup 0.0.0.exe`).

### Pour macOS (M1/Intel)

Lancez la commande de build depuis un Mac :

```bash
npm run electron:build
```

*   Cela générera un fichier `.dmg` dans `dist_electron/`.
*   Note : La configuration est déjà prête pour cibler le format `dmg` pour macOS.

## Guide d'Utilisation

### Raccourcis
*   **Ouvrir un Fichier** : `Ctrl + O` (Windows) / `Cmd + O` (Mac)
*   **Sauvegarder** : `Ctrl + S` (Windows) / `Cmd + S` (Mac)

### Interface
*   **Barre d'outils (Haut)** :
    *   **Icône Export (Téléchargement)** : Sauvegarder le fichier actuel en HTML.
    *   **Icône Œil** : Afficher/Masquer le volet de prévisualisation.
    *   **Icône Grille** : Changer la disposition (Partagé / Éditeur Plein / Aperçu Plein).

### Rédaction
*   **Menu Slash** : Tapez `/` en début de ligne pour voir le menu d'insertion rapide.
*   **Formatage** : La syntaxe Markdown standard est supportée.

## Dépannage

*   **"Electron API not found"** : Assurez-vous de lancer via `npm run electron:dev` et non `npm run dev` (qui n'ouvre que le navigateur).
*   **Erreurs de Build** : Si `electron-builder` échoue, essayez de supprimer les dossiers `dist` et `dist_electron` puis relancez la commande.
