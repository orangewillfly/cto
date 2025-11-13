/**
 * 3D Rubik's Cube Simulator - Main Application
 * Handles rendering, interaction, and UI updates
 */

class RubiksCubeApp {
    constructor() {
        // Three.js setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf5f5f5);
        
        this.canvas = document.getElementById('gameCanvas');
        this.camera = new THREE.PerspectiveCamera(
            75,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.set(4, 4, 4);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas, 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;

        // Lighting
        this.setupLighting();

        // Cube logic
        this.cube = new RubiksCube();
        
        // 3D visualization
        this.cubieGroup = new THREE.Group();
        this.scene.add(this.cubieGroup);
        this.createCubeVisuals();

        // Interaction
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.cameraRotation = { x: 0, y: 0 };
        this.cameraDistance = 6;
        
        // Animation
        this.animatingRotations = [];
        this.isAnimating = false;
        this.lastMoveTime = 0;
        this.moveCooldown = 300; // milliseconds

        // Timer and stats
        this.timerInterval = null;
        this.elapsedSeconds = 0;
        this.moveCount = 0;
        this.isSolved = false;
        this.isScrambled = false;

        // UI elements
        this.setupUIElements();

        // Event listeners
        this.setupEventListeners();

        // Keyboard state
        this.keysPressed = {};

        // Start animation loop
        this.animate();
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);

        // Point light for additional highlights
        const pointLight = new THREE.PointLight(0xffffff, 0.4);
        pointLight.position.set(-5, 5, 5);
        this.scene.add(pointLight);
    }

    createCubeVisuals() {
        // Clear existing cubes
        this.cubieGroup.clear();
        this.cubieGeometries = [];

        // Create 27 small cubes (3x3x3)
        const cubeSize = 0.95; // Slightly smaller than 1 to show gaps
        const offset = 1;

        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                for (let z = -1; z <= 1; z++) {
                    const cubie = this.createCubie(x, y, z, cubeSize);
                    cubie.position.set(x * offset, y * offset, z * offset);
                    this.cubieGroup.add(cubie);
                    this.cubieGeometries.push(cubie);
                }
            }
        }
    }

    createCubie(x, y, z, size) {
        const group = new THREE.Group();
        
        // Create the 6 faces of a cube
        const materials = [];
        const faceConfigs = [
            { pos: 'x', value: 1, face: 'R' },    // Right face
            { pos: 'x', value: -1, face: 'L' },   // Left face
            { pos: 'y', value: 1, face: 'U' },    // Up face
            { pos: 'y', value: -1, face: 'D' },   // Down face
            { pos: 'z', value: 1, face: 'F' },    // Front face
            { pos: 'z', value: -1, face: 'B' }    // Back face
        ];

        for (let config of faceConfigs) {
            // Only create visible faces (on the surface of the cube)
            const isVisible = (config.pos === 'x' && (x === 1 || x === -1)) ||
                             (config.pos === 'y' && (y === 1 || y === -1)) ||
                             (config.pos === 'z' && (z === 1 || z === -1));

            if (isVisible) {
                const color = this.cube.getFaceColor(config.face);
                const material = new THREE.MeshPhongMaterial({
                    color: color,
                    shininess: 100,
                    side: THREE.FrontSide
                });

                let geometry = new THREE.PlaneGeometry(size, size);
                let mesh = new THREE.Mesh(geometry, material);

                // Position the face
                const offset = size / 2 + 0.01;
                if (config.pos === 'x') {
                    mesh.position.x = offset * config.value;
                    mesh.rotation.y = Math.PI / 2 * config.value;
                } else if (config.pos === 'y') {
                    mesh.position.y = offset * config.value;
                    mesh.rotation.x = Math.PI / 2 * -config.value;
                } else if (config.pos === 'z') {
                    mesh.position.z = offset * config.value;
                    mesh.rotation.y = config.value === -1 ? Math.PI : 0;
                }

                group.add(mesh);
            }
        }

        // Add black edges
        const edgeGeometry = new THREE.EdgesGeometry(
            new THREE.BoxGeometry(size, size, size)
        );
        const line = new THREE.LineSegments(
            edgeGeometry,
            new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })
        );
        group.add(line);

        return group;
    }

    setupUIElements() {
        this.elements = {
            moveCount: document.getElementById('moveCount'),
            timerDisplay: document.getElementById('timerDisplay'),
            statusDisplay: document.getElementById('statusDisplay'),
            scrambleBtn: document.getElementById('scrambleBtn'),
            resetBtn: document.getElementById('resetBtn'),
            solveBtn: document.getElementById('solveBtn'),
            viewButtons: document.querySelectorAll('.btn-view')
        };
    }

    setupEventListeners() {
        // Canvas events
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.onMouseWheel(e), false);

        // Button events
        this.elements.scrambleBtn.addEventListener('click', () => this.scrambleCube());
        this.elements.resetBtn.addEventListener('click', () => this.resetCube());
        this.elements.solveBtn.addEventListener('click', () => this.demonstrateSolve());

        // View buttons
        this.elements.viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.setView(e.target.dataset.view));
        });

        // Keyboard events
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));

        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    onMouseDown(e) {
        this.isDragging = true;
        this.previousMousePosition = { x: e.clientX, y: e.clientY };
    }

    onMouseMove(e) {
        if (this.isDragging) {
            const deltaX = e.clientX - this.previousMousePosition.x;
            const deltaY = e.clientY - this.previousMousePosition.y;

            const sensitivity = 0.01;

            if (e.shiftKey) {
                // Shift + drag to zoom
                this.cameraDistance += deltaY * 0.02;
                this.cameraDistance = Math.max(2, Math.min(15, this.cameraDistance));
            } else {
                // Regular drag to rotate
                this.cameraRotation.y += deltaX * sensitivity;
                this.cameraRotation.x += deltaY * sensitivity;

                // Clamp X rotation
                this.cameraRotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.cameraRotation.x));
            }

            this.updateCameraPosition();
            this.previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    }

    onMouseUp(e) {
        this.isDragging = false;
    }

    onMouseWheel(e) {
        e.preventDefault();
        this.cameraDistance += e.deltaY * 0.01;
        this.cameraDistance = Math.max(2, Math.min(15, this.cameraDistance));
        this.updateCameraPosition();
    }

    updateCameraPosition() {
        const x = Math.sin(this.cameraRotation.y) * Math.cos(this.cameraRotation.x) * this.cameraDistance;
        const y = Math.sin(this.cameraRotation.x) * this.cameraDistance;
        const z = Math.cos(this.cameraRotation.y) * Math.cos(this.cameraRotation.x) * this.cameraDistance;

        this.camera.position.set(x, y, z);
        this.camera.lookAt(0, 0, 0);
    }

    onKeyDown(e) {
        if (e.key === ' ') {
            e.preventDefault();
            if (this.isScrambled) {
                this.resetCube();
            } else {
                this.scrambleCube();
            }
            return;
        }

        const notation = e.key;
        if (this.isValidMove(notation)) {
            e.preventDefault();
            this.performMove(notation);
        }
    }

    onKeyUp(e) {
        // Can be used for future features
    }

    isValidMove(key) {
        const validMoves = ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b',
                           'M', 'm', 'E', 'e', 'S', 's', 'X', 'x', 'Y', 'y', 'Z', 'z'];
        return validMoves.includes(key);
    }

    performMove(notation) {
        const now = Date.now();
        if (now - this.lastMoveTime < this.moveCooldown) {
            return;
        }
        this.lastMoveTime = now;

        if (this.cube.move(notation)) {
            this.updateMoveCount();
            this.createAnimationForMove(notation);
        }
    }

    createAnimationForMove(notation) {
        // Simplified animation - just update the visualization
        this.createCubeVisuals();
        this.updateStatus();
    }

    updateMoveCount() {
        this.moveCount = this.cube.getMoveCount();
        this.elements.moveCount.textContent = this.moveCount;
    }

    updateStatus() {
        if (this.cube.isSolved()) {
            this.elements.statusDisplay.textContent = '✓ 已完成!';
            this.elements.statusDisplay.style.color = '#00aa00';
        } else if (this.isScrambled) {
            this.elements.statusDisplay.textContent = '已打乱';
            this.elements.statusDisplay.style.color = '#ff6b6b';
        } else {
            this.elements.statusDisplay.textContent = '未打乱';
            this.elements.statusDisplay.style.color = '#888';
        }
    }

    scrambleCube() {
        this.cube.scramble(20);
        this.updateMoveCount();
        this.isScrambled = true;
        this.elapsedSeconds = 0;
        this.startTimer();
        this.createCubeVisuals();
        this.updateStatus();
    }

    resetCube() {
        this.stopTimer();
        this.cube.reset();
        this.moveCount = 0;
        this.elapsedSeconds = 0;
        this.isScrambled = false;
        this.updateUI();
        this.createCubeVisuals();
    }

    startTimer() {
        if (this.timerInterval) return;
        
        this.timerInterval = setInterval(() => {
            this.elapsedSeconds++;
            this.updateTimerDisplay();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.elapsedSeconds / 60);
        const seconds = this.elapsedSeconds % 60;
        this.elements.timerDisplay.textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    updateUI() {
        this.updateMoveCount();
        this.updateTimerDisplay();
        this.updateStatus();
    }

    setView(viewType) {
        const views = {
            front: { x: 0, y: 0, z: 1 },
            back: { x: Math.PI, y: Math.PI, z: 0 },
            left: { x: 0, y: Math.PI / 2, z: 0 },
            right: { x: 0, y: -Math.PI / 2, z: 0 },
            top: { x: -Math.PI / 2, y: 0, z: 0 },
            bottom: { x: Math.PI / 2, y: 0, z: 0 },
            iso: { x: Math.asin(Math.sin(Math.PI / 6)), y: Math.PI / 4, z: 0 }
        };

        const view = views[viewType];
        if (view) {
            this.cameraRotation.x = view.x;
            this.cameraRotation.y = view.y;
            this.cameraDistance = 6;
            this.updateCameraPosition();

            // Update active button
            this.elements.viewButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-view="${viewType}"]`).classList.add('active');
        }
    }

    demonstrateSolve() {
        // Simplified solve demonstration - just undo all moves
        alert('演示求解: 撤销所有操作\n(在完整版本中会显示求解步骤动画)');
        
        // Undo all moves
        while (this.cube.getHistory().length > 0) {
            this.cube.undo();
        }
        
        this.updateUI();
        this.createCubeVisuals();
    }

    onWindowResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update scene
        this.cubieGroup.rotation.x += 0.0001;
        this.cubieGroup.rotation.y += 0.0001;

        // Render
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new RubiksCubeApp();
    
    // Set initial view to isometric
    app.setView('iso');
});
