---
title: "CSS Unit Converter – Complete Guide"
lastUpdated: "2025-07-27"
---
# 📏 CSS Unit Converter
Convert between CSS units with customizable base font sizes and viewport dimensions. Perfect for responsive design, typography scaling, and ensuring consistent layouts across different devices.
## ✨ Features
- Convert between 13 CSS units (px, em, rem, %, vw, vh, vmin, vmax, pt, pc, in, cm, mm)
- Customizable font size settings (base, root, parent)
- Adjustable viewport dimensions
- Real-time conversion
- Batch conversion for multiple values
- Visual comparison of converted values
- Export results as CSS, JSON, or CSV
- Save custom presets for frequent use cases
---
## 🚀 Quick Start
1. **Enter Value**: Type the value you want to convert in the input field
2. **Select Source Unit**: Choose the unit you're converting from (e.g., px)
3. **Select Target Unit**: Choose the unit you want to convert to (e.g., rem)
4. **View Result**: The converted value appears automatically
5. **Copy Result**: Click the copy icon to use it in your code
> 💡 Tip: Adjust font size and viewport settings in the Settings panel for more accurate conversions.
---
## ⚙️ Configuration Options
| Option | Description | Default |
|--------|-------------|---------|
| **Base Font Size** | Font size for % conversions | `16px` |
| **Root Font Size** | Font size for rem conversions | `16px` |
| **Parent Font Size** | Font size for em conversions | `16px` |
| **Viewport Width** | Width for vw/vmax conversions | `1920px` |
| **Viewport Height** | Height for vh/vmin conversions | `1080px` |
| **Auto Convert** | Update results in real-time | ✅ |
| **Batch Processing** | Convert multiple values at once | ✅ |
| **Visual Comparison** | Show visual representation of values | ✅ |
---
## 🛠️ Use Cases
- 📱 Responsive Design: Convert px to rem/vw for fluid layouts
- ✒️ Typography Scaling: Convert between font size units
- 🖼️ Media Queries: Convert between viewport units
- 📐 Print Styles: Convert to absolute units (pt, in, cm)
- 🔄 Legacy Code Migration: Convert old px-based layouts to modern relative units
- 🎨 Design System Development: Ensure consistent spacing across components
---
## 🧪 Examples
### ✅ Responsive Typography
- Convert: `16px` to `rem`
- Settings: Root Font Size = `16px`
- Output:  
```
1rem
```

### 📱 Fluid Layout
- Convert: `1200px` to `vw`
- Settings: Viewport Width = `1920px`
- Output:
```
62.5vw
```

### 🖼️ Print Styles
- Convert: `1rem` to `pt`
- Settings: Root Font Size = `16px`
- Output:
```
12pt
```

### 🔄 Batch Conversion
- Input: 
```
16px
1.5rem
24pt
100vw
```
- Convert to: `px`
- Output:
```
16px
24px
32px
1920px
```
---
## 🔧 Code Examples
### JavaScript (Unit Conversion)
```javascript
function convertCssUnits(value, fromUnit, toUnit, settings) {
    // Convert to pixels first
    let pxValue;
    switch (fromUnit) {
        case 'px': pxValue = value; break;
        case 'rem': pxValue = value * settings.rootFontSize; break;
        case 'em': pxValue = value * settings.parentFontSize; break;
        case '%': pxValue = (value * settings.parentFontSize) / 100; break;
        case 'vw': pxValue = (value * settings.viewportWidth) / 100; break;
        case 'vh': pxValue = (value * settings.viewportHeight) / 100; break;
        // Add other units as needed
    }
    
    // Convert from pixels to target unit
    switch (toUnit) {
        case 'px': return pxValue;
        case 'rem': return pxValue / settings.rootFontSize;
        case 'em': return pxValue / settings.parentFontSize;
        case '%': return (pxValue * 100) / settings.parentFontSize;
        case 'vw': return (pxValue * 100) / settings.viewportWidth;
        case 'vh': return (pxValue * 100) / settings.viewportHeight;
        // Add other units as needed
    }
}

// Example usage
const settings = {
    rootFontSize: 16,
    parentFontSize: 16,
    viewportWidth: 1920,
    viewportHeight: 1080
};

console.log(convertCssUnits(16, 'px', 'rem', settings)); // Output: 1
```

### CSS (Using Custom Properties)
```css
:root {
    --base-font-size: 16px;
    --viewport-width: 1920px;
}

/* Convert px to rem */
.element {
    font-size: calc(16px / var(--base-font-size) * 1rem);
}

/* Convert px to vw */
.responsive-element {
    width: calc(1200px / var(--viewport-width) * 100vw);
}
```

### SCSS (Mixin for Unit Conversion)
```scss
// Convert px to rem
@function px-to-rem($px, $base-font-size: 16px) {
    @return ($px / $base-font-size) * 1rem;
}

// Convert px to vw
@function px-to-vw($px, $viewport-width: 1920px) {
    @return ($px / $viewport-width) * 100vw;
}

// Example usage
.container {
    padding: px-to-rem(16px); // 1rem
    max-width: px-to-vw(1200px); // 62.5vw
}
```
---
## 🎯 Best Practices
* **Use rem for typography**: Creates consistent scaling that respects user preferences
* **Use em for components**: Allows components to scale based on their context
* **Use viewport units for full-screen elements**: Ideal for hero sections and responsive layouts
* **Set a base font size**: Define it in `:root` for consistent rem calculations
* **Test at different viewport sizes**: Ensure your conversions work across all devices
* **Avoid mixing units excessively**: Stick to a consistent unit system within components
* **Use relative units for accessibility**: Allows users to zoom and scale text comfortably
---
## 🔗 Related Tools
* [Rem to Px Calculator](/dashboard/tools/rem-to-px)
* [Viewport Unit Simulator](/dashboard/tools/viewport-simulator)
* [Typography Scale Generator](/dashboard/tools/typography-scale)
* [CSS Clamp Generator](/dashboard/tools/css-clamp)
* [Responsive Breakpoint Generator](/dashboard/tools/breakpoints)
---
## 📚 Learn More
* [MDN Web Docs: CSS Units](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units)
* [CSS-Tricks: The Amazing Power of viewport units](https://css-tricks.com/the-amazing-power-of-viewport-units/)
* [A List Apart: Responsive Web Design](https://alistapart.com/article/responsive-web-design/)
* [Web.dev: Responsive Design](https://web.dev/learn/design/responsive/)
* [W3C: CSS Values and Units](https://www.w3.org/TR/css-values-4/)
---
> 🧠 **Pro Tip**: Create custom presets for different projects (e.g., "Mobile App", "E-commerce", "Dashboard") to quickly switch between common conversion settings.