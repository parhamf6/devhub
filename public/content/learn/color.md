---
title: "Color Picker – Complete Guide"
lastUpdated: "2023-11-15"
---
# 🎨 Color Picker
A professional color selection tool for designers and developers. Create, convert, and manage color palettes with support for multiple formats, color harmonies, and advanced features.
---
## ✨ Features
- Interactive color picker with real-time preview
- Support for HEX, RGB, HSL, HSV, CMYK, and named color formats
- Color harmony generator (monochromatic, analogous, complementary, etc.)
- Save and manage custom color palettes
- Export palettes as JSON files
- Automatic color format detection
- Random color generator
- One-click copy for all color formats
- Responsive design for all devices
---
## 🚀 Quick Start
> **Tip:** Start by selecting a base color, then explore harmonies to create cohesive palettes.
1. **Select a Color**: Use the color picker or enter a value in any format
2. **Explore Harmonies**: Choose a harmony type to generate complementary colors
3. **Save Colors**: Build your palette by saving colors you like
4. **Copy Formats**: Switch between color formats and copy with one click
---
## 🧠 What Is a Color Picker?
A **color picker** is a tool that allows users to select colors visually and convert them between different formats. It's essential for designers and developers who need to work with consistent color schemes across projects.
### Color Formats Supported
| Format | Description                      | Example        |
|--------|----------------------------------|----------------|
| HEX    | Hexadecimal notation             | `#e5c07b`      |
| RGB    | Red, Green, Blue values          | `rgb(229, 192, 123)` |
| HSL    | Hue, Saturation, Lightness       | `hsl(39, 66%, 69%)` |
| HSV    | Hue, Saturation, Value           | `hsv(39, 46%, 90%)` |
| CMYK   | Cyan, Magenta, Yellow, Key/Black | `cmyk(0%, 16%, 46%, 10%)` |
| Name   | Standard color names             | `gold`         |
---
## ⚙️ Configuration Options
| Option        | Description                           | Default |
|---------------|---------------------------------------|---------|
| Base Color    | Starting color for palette generation | `#e5c07b` |
| Harmony Type  | Color relationship rule               | `Analogous` |
| Output Format | Preferred color format                | `HEX` |
---
## 🎯 Color Harmonies
Color harmonies are color combinations that work well together visually. Our tool supports several harmony types:
| Harmony Type | Description | Example |
|--------------|-------------|---------|
| Monochromatic | Variations in lightness and saturation of a single hue | ![Monochromatic](https://via.placeholder.com/15/FF0000/FF0000.png) ![Monochromatic](https://via.placeholder.com/15/FF6666/FF6666.png) ![Monochromatic](https://via.placeholder.com/15/FFB3B3/FFB3B3.png) |
| Analogous | Colors adjacent on the color wheel | ![Analogous](https://via.placeholder.com/15/FF0000/FF0000.png) ![Analogous](https://via.placeholder.com/15/FF8000/FF8000.png) ![Analogous](https://via.placeholder.com/15/FFFF00/FFFF00.png) |
| Complementary | Colors opposite on the color wheel | ![Complementary](https://via.placeholder.com/15/FF0000/FF0000.png) ![Complementary](https://via.placeholder.com/15/00FFFF/00FFFF.png) |
| Split Complementary | Base color plus two adjacent to its complement | ![Split](https://via.placeholder.com/15/FF0000/FF0000.png) ![Split](https://via.placeholder.com/15/00FF80/00FF80.png) ![Split](https://via.placeholder.com/15/8000FF/8000FF.png) |
| Triadic | Three colors evenly spaced on the color wheel | ![Triadic](https://via.placeholder.com/15/FF0000/FF0000.png) ![Triadic](https://via.placeholder.com/15/00FF00/00FF00.png) ![Triadic](https://via.placeholder.com/15/0000FF/0000FF.png) |
| Tetradic | Four colors in two complementary pairs | ![Tetradic](https://via.placeholder.com/15/FF0000/FF0000.png) ![Tetradic](https://via.placeholder.com/15/FFFF00/FFFF00.png) ![Tetradic](https://via.placeholder.com/15/00FFFF/00FFFF.png) ![Tetradic](https://via.placeholder.com/15/FF00FF/FF00FF.png) |
---
## 🛠️ Use Cases
- 🎨 Creating cohesive color palettes for UI/UX design
- 🌐 Developing consistent branding across web and print
- 📱 Implementing theme systems in applications
- 🎭 Generating color schemes for presentations
- 🧪 Testing color accessibility and contrast
- 🖼️ Creating digital art with harmonious colors
- 📊 Visualizing data with meaningful color coding
---
## 🧪 Examples
### HEX Format
```
#e5c07b
```
### RGB Format
```
rgb(229, 192, 123)
```
### HSL Format
```
hsl(39, 66%, 69%)
```
### Color Harmony (Analogous)
```
Base: #e5c07b
Harmony 1: #e5c07b
Harmony 2: #e5d67b
Harmony 3: #c4e57b
Harmony 4: #7be5a8
Harmony 5: #7bcce5
```
---
## 🔧 Code Examples
### JavaScript (Color Conversion)
```javascript
// Convert HEX to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})` : 
    null;
}

// Generate complementary color
function getComplementaryColor(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  
  // Extract RGB values
  const values = rgb.match(/\d+/g);
  const r = 255 - parseInt(values[0]);
  const g = 255 - parseInt(values[1]);
  const b = 255 - parseInt(values[2]);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
```
### Python (Color Manipulation)
```python
# Convert RGB to HEX
def rgb_to_hex(r, g, b):
    return f'#{r:02x}{g:02x}{b:02x}'

# Generate analogous colors
def get_analogous_colors(hex_color):
    # Convert HEX to HSL
    r = int(hex_color[1:3], 16) / 255
    g = int(hex_color[3:5], 16) / 255
    b = int(hex_color[5:7], 16) / 255
    
    # Convert to HSL
    max_val = max(r, g, b)
    min_val = min(r, g, b)
    h, s, l = 0, 0, (max_val + min_val) / 2
    
    if max_val != min_val:
        d = max_val - min_val
        s = d / (1 - abs(2 * l - 1)) if l > 0.5 else d / (max_val + min_val)
        
        if max_val == r:
            h = (g - b) / d + (6 if g < b else 0)
        elif max_val == g:
            h = (b - r) / d + 2
        else:
            h = (r - g) / d + 4
        
        h /= 6
    
    # Generate analogous colors (±30°)
    analogous_colors = []
    for offset in [-30, 0, 30]:
        new_h = (h * 360 + offset) % 360
        analogous_colors.append(hsl_to_hex(new_h, s, l))
    
    return analogous_colors
```
### CSS (Using Color Variables)
```css
:root {
  --primary-color: #e5c07b;
  --primary-light: #f0d9a3;
  --primary-dark: #c4a862;
  --complementary: #7bc4e5;
  --analogous-1: #e5d67b;
  --analogous-2: #c4e57b;
}

.button {
  background-color: var(--primary-color);
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;
}

.button:hover {
  background-color: var(--primary-dark);
}

.accent {
  color: var(--complementary);
}
```
---
## 🔐 Accessibility Tips
* Ensure sufficient contrast between text and background colors (WCAG recommends 4.5:1 for normal text)
* Use color harmony tools to create accessible color schemes
* Test your color choices with color blindness simulators
* Provide text alternatives or patterns for color-coded information
* Consider using tools like our [Contrast Checker](https://devtoolcafe.com/tools/contrast-checker) to verify accessibility
---
## 🔗 Related Tools
* [Contrast Checker](/dashboard/tools/contrast-checker)
* [Gradient Generator](/dashboard/tools/gradient-generator)
* [Image Color Picker](/dashboard/tools/image-color-picker)
---
## 📚 Learn More
* [Color Theory Basics](https://www.smashingmagazine.com/2022/05/color-theory-practical-guide-designers/)
* [Understanding Color Harmonies](https://www.canva.com/colors/color-wheel/)
* [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/Understanding/)
* [Color in User Interface Design](https://www.interaction-design.org/literature/topics/ui-colors)
* [Color Psychology in Design](https://99designs.com/blog/tips/color-psychology-design/)
---
> 🧠 **Pro Tip:** Save your favorite color palettes and export them for consistent branding across all your projects. Use the harmony generator to explore new color combinations you might not have considered!
---