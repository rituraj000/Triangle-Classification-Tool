# Triangle Classification Tool

An interactive educational web application for learning triangle classification using GeoGebra.

🔗 **[Live Demo](https://yourusername.github.io/triangle-classification-tool/)**

## Features

### 🔺 Interactive Triangle Generation
- Generates random triangles (Equilateral, Isosceles, Scalene)
- Visual representation with labeled sides
- Real-time measurement updates

### 📏 Digital Ruler Tool
- Interactive ruler with tick marks
- Toggle visibility with one click
- Helps students measure triangle sides accurately

### 🎯 Classification System
- Drag-and-drop interface for triangle classification
- Click-to-classify alternative for easier interaction
- Three category boxes: Equilateral, Isosceles, Scalene
- Visual examples and descriptions for each type

### ✨ Educational Features
- **Instant Feedback**: Immediate validation of classifications
- **Scoring System**: Track progress with points and attempts
- **Hint System**: Contextual hints based on triangle type
- **Visual Feedback**: Color-coded responses and animations
- **Measurement Panel**: Real-time side length display

### 🎮 Interactive Elements
- Responsive design for various screen sizes
- Keyboard shortcuts (Ctrl+N for new triangle, Ctrl+R for ruler, Ctrl+H for hint)
- Smooth animations and visual effects
- Dark mode support

## How to Use

1. **Open the Application**
   - Open `index.html` in a web browser
   - Wait for GeoGebra to load (requires internet connection)

2. **Generate a Triangle**
   - Click "Generate New Triangle" to create a random triangle
   - The triangle will appear in the GeoGebra workspace

3. **Measure the Triangle**
   - Click "Toggle Ruler" to show/hide the digital ruler
   - Observe the side measurements displayed on the triangle
   - Check the measurement panel for exact values

4. **Classify the Triangle**
   - Method 1: Click on the triangle, then click on the appropriate classification box
   - Method 2: Use drag-and-drop (where supported)
   - Choose between Equilateral, Isosceles, or Scalene

5. **Get Feedback**
   - Receive immediate feedback on your classification
   - View your score and number of attempts
   - Use the hint system if needed

## Triangle Types

### Equilateral Triangle
- **Definition**: All three sides are equal
- **Example**: Sides of 5, 5, 5
- **Visual Cue**: Perfect symmetry

### Isosceles Triangle
- **Definition**: Two sides are equal, one is different
- **Example**: Sides of 5, 5, 3
- **Visual Cue**: Two matching sides

### Scalene Triangle
- **Definition**: All three sides are different lengths
- **Example**: Sides of 3, 4, 5
- **Visual Cue**: No equal sides

## File Structure

```
Assignment/
├── index.html              # Main HTML structure
├── styles.css              # CSS styling and animations
├── triangle-classifier.js  # JavaScript logic and GeoGebra integration
└── README.md               # This file
```

## Technical Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for GeoGebra library)
- JavaScript enabled

## Educational Benefits

### Geometry Skills
- Understanding triangle properties
- Measurement and comparison skills
- Spatial reasoning development

### Interactive Learning
- Hands-on manipulation
- Immediate feedback loop
- Self-paced learning

### Problem Solving
- Pattern recognition
- Classification skills
- Critical thinking

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## Keyboard Shortcuts

- `Ctrl+N` (or `Cmd+N` on Mac): Generate new triangle
- `Ctrl+R` (or `Cmd+R` on Mac): Toggle ruler
- `Ctrl+H` (or `Cmd+H` on Mac): Show hint

## Troubleshooting

### GeoGebra Won't Load
- Check internet connection
- Ensure JavaScript is enabled
- Try refreshing the page
- Clear browser cache if necessary

### Classification Not Working
- Make sure to generate a triangle first
- Click on the triangle before classifying
- Check if measurements are displayed correctly

### Performance Issues
- Close other browser tabs
- Ensure sufficient system memory
- Try using a different browser

## Customization Options

### Modifying Triangle Generation
Edit the `generateRandomTriangle()` function in `triangle-classifier.js` to:
- Change triangle size ranges
- Adjust probability weights for different types
- Modify positioning within the workspace

### Styling Customization
Modify `styles.css` to:
- Change color schemes
- Adjust animation speeds
- Customize responsive breakpoints

### Adding New Features
The modular structure allows easy addition of:
- More triangle properties (angles, area, perimeter)
- Additional classification challenges
- Different difficulty levels

## License

This educational tool is created for learning purposes. GeoGebra is used under their terms of service for educational use.

## Support

For technical issues or educational questions about triangle classification, refer to:
- GeoGebra Documentation: https://wiki.geogebra.org/
- Geometry learning resources
- Mathematics education websites

---

**Note**: This tool requires an active internet connection to load the GeoGebra JavaScript library. For offline use, you would need to download and host the GeoGebra files locally.