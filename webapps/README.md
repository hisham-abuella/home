# Web Applications

This folder contains interactive web applications and tools that extend the portfolio website functionality.

## Structure

Each web application should be organized in its own subdirectory with the following structure:

```
webapps/
├── app-name/
│   ├── index.html          # Main application entry point
│   ├── styles.css          # Application-specific styles
│   ├── script.js           # Application logic
│   └── README.md           # Application documentation
└── README.md               # This file
```

## Development Guidelines

### Consistency with Main Site
- Use the same CSS custom properties from the main portfolio for theming
- Maintain consistent color scheme: `--primary-orange`, `--primary-teal`, `--primary-yellow`
- Support both light and dark themes
- Follow mobile-first responsive design principles

### Navigation
- Include a "Back to Portfolio" link that returns to `/index.html`
- Maintain consistent navigation patterns
- Use the same typography and spacing conventions

### Technical Standards
- Use vanilla HTML, CSS, and JavaScript (no build process required)
- Follow modern web standards and accessibility guidelines
- Ensure cross-browser compatibility
- Optimize for performance and loading speed

## Example App Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App Name - Hisham Abuella</title>
    <style>
        /* Import main site color scheme */
        :root {
            --primary-orange: #ff6b35;
            --primary-teal: #00a8cc;
            /* ... other variables ... */
        }
    </style>
</head>
<body>
    <nav>
        <a href="../index.html">← Back to Portfolio</a>
    </nav>
    
    <main>
        <!-- App content -->
    </main>
</body>
</html>
```

## Deployment

Web applications in this folder will be automatically deployed with the main site to GitHub Pages and accessible at:
`https://hisham-abuella.github.io/home/webapps/[app-name]/`