# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a personal portfolio website for Hisham Abuella hosted at https://hisham-abuella.github.io/home/. The repository contains multiple design variations of a single-page portfolio website, all built with vanilla HTML, CSS, and JavaScript.
Always remember to maintain the same style. 
## Project Structure

- `index.html` - Main portfolio page with enhanced dark/light mode theming system
- `different_designs/` - Collection of alternative design variations:
  - `light_v1.html` - Clean, minimalist light theme design
  - `light_v2.html` - Alternative light theme with different layout
  - `dark_version2.html` - Dark theme with sidebar navigation and animated background
- `Bio_Color.JPG` - Profile image used in the designs

## Architecture

All designs are self-contained HTML files with:
- Embedded CSS using CSS custom properties (CSS variables) for theming
- Vanilla JavaScript for interactivity (no external dependencies)
- Responsive design with mobile-first approach
- Modern CSS features like Grid, Flexbox, and CSS animations

### Key Design Patterns

1. **CSS Variables for Theming**: All designs use CSS custom properties for consistent color schemes and easy theme switching
2. **Component-based Structure**: Despite being vanilla HTML, the designs follow a modular approach with reusable card components
3. **Progressive Enhancement**: Base functionality works without JavaScript, enhanced features are layered on top
4. **Mobile-First Responsive**: All designs use responsive grid systems that collapse gracefully on smaller screens

### Main Design (`index.html`) Features

- **Advanced Theme System**: Sophisticated light/dark mode with smooth transitions and system preference detection
- **Modular JavaScript Classes**: Organized into ThemeManager, NavigationManager, FormManager, and AnimationManager
- **Intersection Observer Animations**: Smooth scroll-triggered animations for enhanced UX
- **Advanced Navigation**: Floating navbar with backdrop blur and scroll effects

### Design Variations

- **Light V1/V2**: Clean, professional layouts with gradient accents
- **Dark Version**: Creative dark theme with animated floating shapes, sidebar navigation, and morphing profile container

## Development Workflow

Since this is a static website with no build process:

1. **Local Development**: Open HTML files directly in browser or use a simple HTTP server
2. **Testing**: Test across different screen sizes and browsers
3. **Deployment**: Push to GitHub Pages (automatic deployment enabled)

## Common Development Tasks

- **Adding new sections**: Follow the existing card-based layout patterns
- **Theme modifications**: Update CSS custom properties in the `:root` selector
- **Responsive adjustments**: Modify existing media queries or add new breakpoints
- **Animation changes**: Update CSS keyframes or Intersection Observer configurations

## Browser Support

The designs use modern CSS and JavaScript features and target modern browsers that support:
- CSS Grid and Flexbox
- CSS Custom Properties
- Intersection Observer API
- ES6+ JavaScript features
- CSS backdrop-filter (for enhanced visual effects)