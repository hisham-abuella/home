# Website Map & Navigation Guide

## Overview
This document provides a comprehensive map of all pages and components within Hisham Abuella's portfolio website, along with their connections and purposes.

## Live Website
- **Production URL**: https://hisham-abuella.github.io/home/
- **Repository**: https://github.com/hisham-abuella/home

## Main Pages

### 1. Homepage (`index.html`)
- **URL**: `/` or `/index.html`
- **Purpose**: Main portfolio landing page
- **Features**:
  - Advanced light/dark theme system
  - Responsive design with animated components
  - Navigation to all other sections
  - Contact form
  - Skills showcase
  - Project gallery
  - About section

### 2. Journey Article (`Articles/journey.html`)
- **URL**: `/Articles/journey.html`
- **Purpose**: Personal journey and career story
- **Features**:
  - Detailed narrative about professional development
  - Timeline of achievements
  - Consistent theming with main site
- **Navigation**: Accessible from main homepage

## Design Variations

### Alternative Design Templates (`different_designs/`)
These are complete alternative layouts for the portfolio:

#### Light Version 1 (`different_designs/light_v1.html`)
- **Purpose**: Clean, minimalist light theme variation
- **Features**: Professional card-based layout

#### Light Version 2 (`different_designs/light_v2.html`) 
- **Purpose**: Alternative light theme with different structure
- **Features**: Enhanced visual hierarchy

#### Dark Version 2 (`different_designs/dark_version2.html`)
- **Purpose**: Creative dark theme with enhanced visuals
- **Features**: 
  - Sidebar navigation
  - Animated floating shapes background
  - Morphing profile container effects

## Assets & Resources

### Images (`Pictures/`)
- `Bio_Color.JPG` - Main profile image used across all designs
- `sunset.jpg` - Background/decorative image

### Documents (`CV/`)
- `Hisham_Abuella_CV_2025.pdf` - Current resume/CV document

## Site Architecture

```
home/
├── index.html                    # Main portfolio page
├── Articles/
│   └── journey.html             # Personal journey article
├── different_designs/
│   ├── light_v1.html           # Light theme variation 1
│   ├── light_v2.html           # Light theme variation 2
│   └── dark_version2.html      # Dark theme variation
├── Pictures/
│   ├── Bio_Color.JPG           # Profile image
│   └── sunset.jpg              # Background image
├── CV/
│   └── Hisham_Abuella_CV_2025.pdf  # Resume document
└── webapps/                     # Web applications folder
    └── [Future web applications will be placed here]
```

## Navigation Flow

### From Homepage (`index.html`):
- **Internal Navigation**: Smooth scroll to sections (About, Skills, Projects, Contact)
- **External Links**: 
  - Journey article (`/Articles/journey.html`)
  - CV download (`/CV/Hisham_Abuella_CV_2025.pdf`)
  - Social media profiles (GitHub, LinkedIn, etc.)

### Theme System
- All pages support light/dark mode switching
- System preference detection
- Consistent color scheme across all variations

## Technical Implementation

### Core Technologies
- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: CSS Custom Properties, Grid, Flexbox
- **Animations**: CSS keyframes, Intersection Observer API
- **Responsive**: Mobile-first approach

### Key Features
- **No Build Process**: Direct HTML file serving
- **Self-contained**: Each design is a complete standalone page
- **Modern CSS**: Uses latest CSS features for advanced theming
- **Progressive Enhancement**: Works without JavaScript, enhanced with it

## Future Expansion Areas

### Web Applications (`webapps/`)
- New folder created for interactive web applications
- Will contain standalone apps and tools
- Maintains connection to main portfolio site

### Content Areas
- Articles can be expanded with additional topics
- Design variations can be developed further
- New interactive components can be added

## Maintenance Notes

- **Static Deployment**: Automatic GitHub Pages deployment
- **Cross-browser Testing**: Targets modern browsers
- **Mobile Optimization**: All designs are responsive
- **Performance**: Optimized loading with minimal dependencies