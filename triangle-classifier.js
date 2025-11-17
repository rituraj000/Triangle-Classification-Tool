// Triangle Classification Tool - GeoGebra Integration
class TriangleClassifier {
    constructor() {
        this.ggbApp = null;
        this.currentTriangle = null;
        this.score = 0;
        this.attempts = 0;
        this.rulerActive = false;
        this.triangleCounter = 0;
        this.draggedElement = null;
        
        this.initializeGeoGebra();
        this.setupEventListeners();
        this.updateDisplay();
    }

    initializeGeoGebra() {
        const parameters = {
            "appName": "geometry",
            "width": 600,
            "height": 500,
            "showToolBar": true,
            "showAlgebraInput": false,
            "showMenuBar": false,
            "showResetIcon": true,
            "enableLabelDrags": false,
            "enableShiftDragZoom": true,
            "enableRightClick": false,
            "capturingThreshold": null,
            "showToolBarHelp": false,
            "errorDialogsActive": true,
            "useBrowserForJS": true
        };

        const applet = new GGBApplet(parameters, true);
        
        // Set up the applet
        applet.setHTML5Codebase('https://cdn.geogebra.org/apps/5.0.609.0/web3d/');
        
        window.ggbOnInit = () => {
            // Remove loading message
            const loadingMessage = document.getElementById('loading-message');
            if (loadingMessage) {
                loadingMessage.style.display = 'none';
            }
            
            this.ggbApp = window.ggbApplet;
            this.setupGeoGebraEnvironment();
            this.createInitialTriangle();
        };
        
        applet.inject('ggbApplet');
        
        // Add timeout for GeoGebra loading
        setTimeout(() => {
            const loadingMessage = document.getElementById('loading-message');
            if (loadingMessage && loadingMessage.style.display !== 'none') {
                loadingMessage.innerHTML = `
                    <p style="color: #dc3545; font-weight: bold;">⚠️ GeoGebra failed to load</p>
                    <p style="font-size: 0.9rem; margin-top: 10px;">Please check your internet connection and refresh the page.</p>
                    <p style="font-size: 0.8rem; margin-top: 5px; color: #666;">This tool requires an active internet connection to load GeoGebra.</p>
                `;
            }
        }, 15000); // 15 second timeout
    }

    setupGeoGebraEnvironment() {
        // Set up the coordinate system
        this.ggbApp.evalCommand('SetActiveView(1)');
        this.ggbApp.evalCommand('ZoomIn()');
        
        // Create a digital ruler
        this.createDigitalRuler();
        
        // Add click listener for triangle selection
        this.ggbApp.registerClickListener((objName) => {
            this.handleTriangleClick(objName);
        });
        
        // Add update listener for measurements
        this.ggbApp.registerUpdateListener((objName) => {
            this.updateMeasurements();
        });
    }

    createDigitalRuler() {
        // Create a moveable ruler
        this.ggbApp.evalCommand('ruler = Segment((0, -8), (10, -8))');
        this.ggbApp.evalCommand('SetColor(ruler, "blue")');
        this.ggbApp.evalCommand('SetLineThickness(ruler, 5)');
        this.ggbApp.evalCommand('ShowLabel(ruler, true)');
        this.ggbApp.evalCommand('SetCaption(ruler, "Ruler: " + Length(ruler))');
        this.ggbApp.evalCommand('SetVisible(ruler, false)'); // Hidden by default
        
        // Add tick marks to the ruler
        for (let i = 0; i <= 10; i++) {
            this.ggbApp.evalCommand(`tick${i} = Segment((${i}, -8.2), (${i}, -7.8))`);
            this.ggbApp.evalCommand(`SetVisible(tick${i}, false)`);
            this.ggbApp.evalCommand(`SetColor(tick${i}, "blue")`);
        }
    }

    createInitialTriangle() {
        this.generateRandomTriangle();
    }

    generateRandomTriangle() {
        this.triangleCounter++;
        const triangleName = `triangle${this.triangleCounter}`;
        
        // Generate random triangle types with different probabilities
        const triangleTypes = ['equilateral', 'isosceles', 'scalene'];
        const weights = [0.3, 0.4, 0.3]; // Probability weights
        const randomType = this.weightedRandom(triangleTypes, weights);
        
        let vertices;
        
        switch(randomType) {
            case 'equilateral':
                vertices = this.generateEquilateralTriangle();
                break;
            case 'isosceles':
                vertices = this.generateIsoscelesTriangle();
                break;
            case 'scalene':
                vertices = this.generateScaleneTriangle();
                break;
        }
        
        // Create triangle in GeoGebra
        const [A, B, C] = vertices;
        this.ggbApp.evalCommand(`A${this.triangleCounter} = (${A.x}, ${A.y})`);
        this.ggbApp.evalCommand(`B${this.triangleCounter} = (${B.x}, ${B.y})`);
        this.ggbApp.evalCommand(`C${this.triangleCounter} = (${C.x}, ${C.y})`);
        
        // Create the triangle polygon
        this.ggbApp.evalCommand(`${triangleName} = Polygon(A${this.triangleCounter}, B${this.triangleCounter}, C${this.triangleCounter})`);
        
        // Create side segments for measurement
        this.ggbApp.evalCommand(`sideA${this.triangleCounter} = Segment(A${this.triangleCounter}, B${this.triangleCounter})`);
        this.ggbApp.evalCommand(`sideB${this.triangleCounter} = Segment(B${this.triangleCounter}, C${this.triangleCounter})`);
        this.ggbApp.evalCommand(`sideC${this.triangleCounter} = Segment(C${this.triangleCounter}, A${this.triangleCounter})`);
        
        // Style the triangle
        this.ggbApp.evalCommand(`SetColor(${triangleName}, "red")`);
        this.ggbApp.evalCommand(`SetFilling(${triangleName}, 0.3)`);
        this.ggbApp.evalCommand(`SetLineThickness(${triangleName}, 3)`);
        
        // Style the sides
        this.ggbApp.evalCommand(`SetColor(sideA${this.triangleCounter}, "darkred")`);
        this.ggbApp.evalCommand(`SetColor(sideB${this.triangleCounter}, "darkred")`);
        this.ggbApp.evalCommand(`SetColor(sideC${this.triangleCounter}, "darkred")`);
        this.ggbApp.evalCommand(`SetLineThickness(sideA${this.triangleCounter}, 2)`);
        this.ggbApp.evalCommand(`SetLineThickness(sideB${this.triangleCounter}, 2)`);
        this.ggbApp.evalCommand(`SetLineThickness(sideC${this.triangleCounter}, 2)`);
        
        // Add labels for side lengths
        this.ggbApp.evalCommand(`SetCaption(sideA${this.triangleCounter}, "a = " + Length(sideA${this.triangleCounter}))`);
        this.ggbApp.evalCommand(`SetCaption(sideB${this.triangleCounter}, "b = " + Length(sideB${this.triangleCounter}))`);
        this.ggbApp.evalCommand(`SetCaption(sideC${this.triangleCounter}, "c = " + Length(sideC${this.triangleCounter}))`);
        this.ggbApp.evalCommand(`ShowLabel(sideA${this.triangleCounter}, true)`);
        this.ggbApp.evalCommand(`ShowLabel(sideB${this.triangleCounter}, true)`);
        this.ggbApp.evalCommand(`ShowLabel(sideC${this.triangleCounter}, true)`);
        
        this.currentTriangle = {
            name: triangleName,
            counter: this.triangleCounter,
            type: randomType,
            vertices: vertices
        };
        
        this.setupTriangleDragging();
        this.updateMeasurements();
    }

    weightedRandom(items, weights) {
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < items.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return items[i];
            }
        }
        return items[items.length - 1];
    }

    generateEquilateralTriangle() {
        const side = 3 + Math.random() * 3; // Side length between 3 and 6
        const centerX = Math.random() * 4 - 2;
        const centerY = Math.random() * 4 - 2;
        
        const height = side * Math.sqrt(3) / 2;
        
        return [
            { x: centerX, y: centerY + height / 3 },
            { x: centerX - side / 2, y: centerY - height / 6 },
            { x: centerX + side / 2, y: centerY - height / 6 }
        ];
    }

    generateIsoscelesTriangle() {
        const equalSide = 3 + Math.random() * 3;
        const baseSide = 2 + Math.random() * 2;
        const centerX = Math.random() * 4 - 2;
        const centerY = Math.random() * 4 - 2;
        
        const height = Math.sqrt(equalSide * equalSide - (baseSide / 2) * (baseSide / 2));
        
        return [
            { x: centerX, y: centerY + height / 2 },
            { x: centerX - baseSide / 2, y: centerY - height / 2 },
            { x: centerX + baseSide / 2, y: centerY - height / 2 }
        ];
    }

    generateScaleneTriangle() {
        const centerX = Math.random() * 4 - 2;
        const centerY = Math.random() * 4 - 2;
        
        // Generate three different side lengths that can form a triangle
        let a, b, c;
        do {
            a = 2 + Math.random() * 4;
            b = 2 + Math.random() * 4;
            c = 2 + Math.random() * 4;
        } while (a + b <= c || a + c <= b || b + c <= a || 
                Math.abs(a - b) < 0.5 || Math.abs(b - c) < 0.5 || Math.abs(a - c) < 0.5);
        
        // Use law of cosines to place vertices
        const angle = Math.acos((a * a + b * b - c * c) / (2 * a * b));
        
        return [
            { x: centerX, y: centerY },
            { x: centerX + a, y: centerY },
            { x: centerX + b * Math.cos(angle), y: centerY + b * Math.sin(angle) }
        ];
    }

    setupTriangleDragging() {
        // Enable dragging for the triangle
        if (this.currentTriangle) {
            const triangleName = this.currentTriangle.name;
            this.ggbApp.evalCommand(`SetFixed(${triangleName}, false)`);
        }
    }

    handleTriangleClick(objName) {
        if (objName && objName.includes('triangle')) {
            this.selectTriangle(objName);
            this.updateMeasurements();
        }
    }

    selectTriangle(triangleName) {
        if (this.currentTriangle && this.currentTriangle.name === triangleName) {
            // Triangle is already selected, start dragging
            this.startDragging(triangleName);
        }
    }

    startDragging(triangleName) {
        // This will be handled by the HTML5 drag and drop API
        const triangleElement = document.createElement('div');
        triangleElement.textContent = `Triangle (${this.getSideLengths().join(', ')})`;
        triangleElement.className = 'dragging-triangle';
        triangleElement.draggable = true;
        triangleElement.dataset.triangle = triangleName;
        triangleElement.dataset.type = this.currentTriangle.type;
        
        // Add to a temporary container for dragging
        document.body.appendChild(triangleElement);
        
        // Simulate drag start
        this.draggedElement = {
            element: triangleElement,
            triangleName: triangleName,
            type: this.currentTriangle.type
        };
    }

    updateMeasurements() {
        if (this.currentTriangle) {
            const counter = this.currentTriangle.counter;
            
            try {
                const sideA = this.ggbApp.getValue(`Length(sideA${counter})`);
                const sideB = this.ggbApp.getValue(`Length(sideB${counter})`);
                const sideC = this.ggbApp.getValue(`Length(sideC${counter})`);
                
                if (sideA && sideB && sideC) {
                    document.getElementById('sideA').textContent = sideA.toFixed(2);
                    document.getElementById('sideB').textContent = sideB.toFixed(2);
                    document.getElementById('sideC').textContent = sideC.toFixed(2);
                    
                    const classification = this.classifyTriangle(sideA, sideB, sideC);
                    document.getElementById('classification').textContent = classification;
                }
            } catch (error) {
                console.log('Measurements not ready yet');
            }
        }
    }

    getSideLengths() {
        if (this.currentTriangle) {
            const counter = this.currentTriangle.counter;
            try {
                const sideA = this.ggbApp.getValue(`Length(sideA${counter})`);
                const sideB = this.ggbApp.getValue(`Length(sideB${counter})`);
                const sideC = this.ggbApp.getValue(`Length(sideC${counter})`);
                return [sideA.toFixed(2), sideB.toFixed(2), sideC.toFixed(2)];
            } catch (error) {
                return ['--', '--', '--'];
            }
        }
        return ['--', '--', '--'];
    }

    classifyTriangle(a, b, c) {
        const tolerance = 0.1; // Allow small floating point differences
        
        if (Math.abs(a - b) < tolerance && Math.abs(b - c) < tolerance) {
            return 'Equilateral';
        } else if (Math.abs(a - b) < tolerance || Math.abs(b - c) < tolerance || Math.abs(a - c) < tolerance) {
            return 'Isosceles';
        } else {
            return 'Scalene';
        }
    }

    toggleRuler() {
        this.rulerActive = !this.rulerActive;
        this.ggbApp.evalCommand(`SetVisible(ruler, ${this.rulerActive})`);
        
        // Toggle tick marks
        for (let i = 0; i <= 10; i++) {
            this.ggbApp.evalCommand(`SetVisible(tick${i}, ${this.rulerActive})`);
        }
        
        const button = document.getElementById('toggleRuler');
        button.textContent = this.rulerActive ? 'Hide Ruler' : 'Show Ruler';
        button.style.background = this.rulerActive ? 
            'linear-gradient(45deg, #FF5722, #D84315)' : 
            'linear-gradient(45deg, #2196F3, #1976D2)';
    }

    resetApplet() {
        if (this.ggbApp) {
            this.ggbApp.reset();
            this.triangleCounter = 0;
            this.currentTriangle = null;
            
            setTimeout(() => {
                this.setupGeoGebraEnvironment();
                this.createInitialTriangle();
            }, 500);
        }
    }

    setupEventListeners() {
        // Button event listeners
        document.getElementById('newTriangle').addEventListener('click', () => {
            this.generateRandomTriangle();
        });

        document.getElementById('toggleRuler').addEventListener('click', () => {
            this.toggleRuler();
        });

        document.getElementById('resetApplet').addEventListener('click', () => {
            this.resetApplet();
        });

        document.getElementById('showHint').addEventListener('click', () => {
            this.showHint();
        });

        // Setup drag and drop for classification boxes
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        const classificationBoxes = document.querySelectorAll('.drop-box');
        
        classificationBoxes.forEach(box => {
            box.addEventListener('dragover', (e) => {
                e.preventDefault();
                box.classList.add('drag-over');
            });

            box.addEventListener('dragleave', (e) => {
                box.classList.remove('drag-over');
            });

            box.addEventListener('drop', (e) => {
                e.preventDefault();
                box.classList.remove('drag-over');
                
                const expectedType = box.dataset.type;
                this.checkClassification(expectedType, box);
            });

            // Make the GeoGebra triangle draggable to classification boxes
            box.addEventListener('click', () => {
                if (this.currentTriangle) {
                    const expectedType = box.dataset.type;
                    this.checkClassification(expectedType, box);
                }
            });
        });

        // Add click-to-classify functionality
        const ggbContainer = document.getElementById('ggbApplet');
        let selectedForDrag = false;
        
        ggbContainer.addEventListener('click', (e) => {
            if (this.currentTriangle && !selectedForDrag) {
                selectedForDrag = true;
                this.showDragInstructions();
                
                // Reset after a delay
                setTimeout(() => {
                    selectedForDrag = false;
                }, 3000);
            }
        });
    }

    showDragInstructions() {
        const message = document.getElementById('feedbackMessage');
        message.textContent = 'Triangle selected! Click on a classification box to classify it.';
        message.className = 'feedback-message';
        message.style.background = 'linear-gradient(135deg, #fff3cd, #ffeaa7)';
        message.style.color = '#856404';
        message.style.border = '2px solid #ffc107';
        
        setTimeout(() => {
            message.textContent = '';
            message.className = 'feedback-message';
        }, 3000);
    }

    checkClassification(expectedType, box) {
        if (!this.currentTriangle) {
            this.showFeedback('Please generate a triangle first!', false);
            return;
        }

        this.attempts++;
        const actualType = this.currentTriangle.type;
        const isCorrect = expectedType === actualType;

        if (isCorrect) {
            this.score += 10;
            this.showFeedback(`Correct! This is an ${actualType} triangle.`, true);
            this.addTriangleToBox(box, actualType);
            this.generateNewTriangleAfterDelay();
        } else {
            this.showFeedback(`Incorrect. This is actually an ${actualType} triangle. Try again!`, false);
        }

        this.updateDisplay();
    }

    addTriangleToBox(box, type) {
        const dropZone = box.querySelector('.drop-zone');
        const triangleDiv = document.createElement('div');
        triangleDiv.className = 'triangle-in-box';
        triangleDiv.textContent = `${type} (${this.getSideLengths().join(', ')})`;
        
        dropZone.innerHTML = '';
        dropZone.appendChild(triangleDiv);
        
        // Add success animation
        box.classList.add('bounce');
        setTimeout(() => {
            box.classList.remove('bounce');
        }, 1000);
    }

    generateNewTriangleAfterDelay() {
        setTimeout(() => {
            this.generateRandomTriangle();
            this.clearClassificationBoxes();
        }, 2000);
    }

    clearClassificationBoxes() {
        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            zone.innerHTML = '';
        });
    }

    showFeedback(message, isCorrect) {
        const feedbackElement = document.getElementById('feedbackMessage');
        feedbackElement.textContent = message;
        feedbackElement.className = `feedback-message ${isCorrect ? 'correct' : 'incorrect'}`;
        
        setTimeout(() => {
            feedbackElement.textContent = '';
            feedbackElement.className = 'feedback-message';
        }, 3000);
    }

    showHint() {
        if (!this.currentTriangle) {
            this.showFeedback('Generate a triangle first!', false);
            return;
        }

        const hints = {
            equilateral: 'All three sides are equal in length. Look for identical measurements!',
            isosceles: 'Two sides are equal, one is different. Find the pair that matches!',
            scalene: 'All three sides are different lengths. No sides should be equal!'
        };

        const hintMessage = document.getElementById('hintMessage');
        const actualType = this.currentTriangle.type;
        hintMessage.textContent = hints[actualType];
        hintMessage.classList.add('show');

        setTimeout(() => {
            hintMessage.classList.remove('show');
        }, 5000);
    }

    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('attempts').textContent = this.attempts;
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TriangleClassifier();
});

// Add some utility functions for enhanced interaction
window.addEventListener('resize', () => {
    if (window.ggbApplet) {
        window.ggbApplet.setSize(
            Math.min(600, window.innerWidth - 40),
            Math.min(500, window.innerHeight * 0.6)
        );
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'n':
                e.preventDefault();
                document.getElementById('newTriangle').click();
                break;
            case 'r':
                e.preventDefault();
                document.getElementById('toggleRuler').click();
                break;
            case 'h':
                e.preventDefault();
                document.getElementById('showHint').click();
                break;
        }
    }
});