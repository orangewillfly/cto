/**
 * Rubik's Cube Simulator - Core Logic
 * Handles 3D cube representation and rotations
 */

class RubiksCube {
    constructor() {
        // Color mapping for cube faces (standard color scheme)
        this.colors = {
            WHITE: 0xFFFFFF,
            YELLOW: 0xFFFF00,
            RED: 0xFF0000,
            ORANGE: 0xFFA500,
            BLUE: 0x0000FF,
            GREEN: 0x00AA00
        };

        // Face order: Front, Back, Up, Down, Left, Right
        this.faces = ['F', 'B', 'U', 'D', 'L', 'R'];
        
        // Initialize 3D cube state - each cubie (small cube) has stickers with colors
        this.initializeCube();
        
        // For tracking rotations
        this.rotationHistory = [];
        this.moveCount = 0;
    }

    initializeCube() {
        // Create a 3x3x3 representation of the cube
        // Each position stores color information for each face
        
        this.state = {};
        
        // Initialize each face with 9 stickers (3x3)
        for (let face of this.faces) {
            this.state[face] = [];
            let faceColor = this.getFaceColor(face);
            for (let i = 0; i < 9; i++) {
                this.state[face].push(faceColor);
            }
        }
    }

    getFaceColor(face) {
        const colorMap = {
            'F': this.colors.RED,
            'B': this.colors.ORANGE,
            'U': this.colors.WHITE,
            'D': this.colors.YELLOW,
            'L': this.colors.BLUE,
            'R': this.colors.GREEN
        };
        return colorMap[face];
    }

    // Rotate a face 90 degrees clockwise
    rotateFaceClockwise(face) {
        const state = this.state[face];
        // Rotate the array: [0,1,2,3,4,5,6,7,8] -> [6,3,0,7,4,1,8,5,2]
        const newState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        newState[0] = state[6];
        newState[1] = state[3];
        newState[2] = state[0];
        newState[3] = state[7];
        newState[4] = state[4];
        newState[5] = state[1];
        newState[6] = state[8];
        newState[7] = state[5];
        newState[8] = state[2];
        this.state[face] = newState;
    }

    // Rotate a face 90 degrees counter-clockwise
    rotateFaceCounterClockwise(face) {
        this.rotateFaceClockwise(face);
        this.rotateFaceClockwise(face);
        this.rotateFaceClockwise(face);
    }

    // Execute a move on the cube
    move(notation) {
        const moves = {
            'U': () => this.rotateU(),
            'u': () => this.rotateUi(),
            'D': () => this.rotateD(),
            'd': () => this.rotateDi(),
            'L': () => this.rotateL(),
            'l': () => this.rotateLi(),
            'R': () => this.rotateR(),
            'r': () => this.rotateRi(),
            'F': () => this.rotateF(),
            'f': () => this.rotateFi(),
            'B': () => this.rotateB(),
            'b': () => this.rotateBi(),
            'M': () => this.rotateM(),
            'm': () => this.rotateMi(),
            'E': () => this.rotateE(),
            'e': () => this.rotateEi(),
            'S': () => this.rotateS(),
            's': () => this.rotateSi(),
            'X': () => this.rotateX(),
            'x': () => this.rotateXi(),
            'Y': () => this.rotateY(),
            'y': () => this.rotateYi(),
            'Z': () => this.rotateZ(),
            'z': () => this.rotateZi()
        };

        if (moves[notation]) {
            moves[notation]();
            this.rotationHistory.push(notation);
            this.moveCount++;
            return true;
        }
        return false;
    }

    // Layer rotations - simplified for demonstration
    // In a real implementation, these would cycle stickers between faces
    
    rotateU() {
        this.rotateFaceClockwise('U');
        this.cycleEdges('U', 'F', 'L', 'B', 'R', false);
    }

    rotateUi() {
        this.rotateFaceCounterClockwise('U');
        this.cycleEdges('U', 'R', 'B', 'L', 'F', false);
    }

    rotateD() {
        this.rotateFaceClockwise('D');
        this.cycleEdges('D', 'F', 'R', 'B', 'L', true);
    }

    rotateDi() {
        this.rotateFaceCounterClockwise('D');
        this.cycleEdges('D', 'L', 'B', 'R', 'F', true);
    }

    rotateL() {
        this.rotateFaceClockwise('L');
        this.cycleEdges('L', 'F', 'U', 'B', 'D', false);
    }

    rotateLi() {
        this.rotateFaceCounterClockwise('L');
        this.cycleEdges('L', 'D', 'B', 'U', 'F', false);
    }

    rotateR() {
        this.rotateFaceClockwise('R');
        this.cycleEdges('R', 'F', 'D', 'B', 'U', false);
    }

    rotateRi() {
        this.rotateFaceCounterClockwise('R');
        this.cycleEdges('R', 'U', 'B', 'D', 'F', false);
    }

    rotateF() {
        this.rotateFaceClockwise('F');
        this.cycleEdges('F', 'U', 'R', 'D', 'L', false);
    }

    rotateFi() {
        this.rotateFaceCounterClockwise('F');
        this.cycleEdges('F', 'L', 'D', 'R', 'U', false);
    }

    rotateB() {
        this.rotateFaceClockwise('B');
        this.cycleEdges('B', 'U', 'L', 'D', 'R', true);
    }

    rotateBi() {
        this.rotateFaceCounterClockwise('B');
        this.cycleEdges('B', 'R', 'D', 'L', 'U', true);
    }

    rotateM() {
        // Middle layer - no face rotates
        this.cycleEdges('M', 'U', 'F', 'D', 'B', false, true);
    }

    rotateMi() {
        this.cycleEdges('M', 'B', 'D', 'F', 'U', false, true);
    }

    rotateE() {
        // Equator layer
        this.cycleEdges('E', 'F', 'R', 'B', 'L', false, true);
    }

    rotateEi() {
        this.cycleEdges('E', 'L', 'B', 'R', 'F', false, true);
    }

    rotateS() {
        // Standing layer
        this.cycleEdges('S', 'U', 'L', 'D', 'R', false, true);
    }

    rotateSi() {
        this.cycleEdges('S', 'R', 'D', 'L', 'U', false, true);
    }

    rotateX() {
        // Rotate entire cube on X axis
        this.rotateR();
        this.rotateM();
        this.rotateLi();
    }

    rotateXi() {
        this.rotateRi();
        this.rotateMi();
        this.rotateL();
    }

    rotateY() {
        // Rotate entire cube on Y axis
        this.rotateU();
        this.rotateEi();
        this.rotateDi();
    }

    rotateYi() {
        this.rotateUi();
        this.rotateE();
        this.rotateD();
    }

    rotateZ() {
        // Rotate entire cube on Z axis
        this.rotateF();
        this.rotateS();
        this.rotateBi();
    }

    rotateZi() {
        this.rotateFi();
        this.rotateSi();
        this.rotateB();
    }

    // Helper function to cycle stickers between faces
    cycleEdges(axis, face1, face2, face3, face4, reverse = false, middle = false) {
        // Simplified cycle - moves stickers in a cycle
        if (middle) {
            // For middle layer moves, cycle specific positions
            const positions = [1, 3, 5, 7]; // middle positions
            this.cycleFacePositions(face1, face2, face3, face4, positions, reverse);
        } else {
            // For face turns, cycle edge positions
            const positions = [0, 1, 2, 3, 5, 6, 7, 8]; // edge positions
            this.cycleFacePositions(face1, face2, face3, face4, positions, reverse);
        }
    }

    cycleFacePositions(f1, f2, f3, f4, positions, reverse) {
        // Store first face data
        const temp = positions.map(i => this.state[f1][i]);

        if (!reverse) {
            for (let i = 0; i < positions.length; i++) {
                this.state[f1][positions[i]] = this.state[f4][positions[i]];
                this.state[f4][positions[i]] = this.state[f3][positions[i]];
                this.state[f3][positions[i]] = this.state[f2][positions[i]];
                this.state[f2][positions[i]] = temp[i];
            }
        } else {
            for (let i = 0; i < positions.length; i++) {
                this.state[f1][positions[i]] = this.state[f2][positions[i]];
                this.state[f2][positions[i]] = this.state[f3][positions[i]];
                this.state[f3][positions[i]] = this.state[f4][positions[i]];
                this.state[f4][positions[i]] = temp[i];
            }
        }
    }

    // Scramble the cube with random moves
    scramble(moveCount = 20) {
        const moveNotations = ['U', 'u', 'D', 'd', 'L', 'l', 'R', 'r', 'F', 'f', 'B', 'b'];
        for (let i = 0; i < moveCount; i++) {
            const randomMove = moveNotations[Math.floor(Math.random() * moveNotations.length)];
            this.move(randomMove);
        }
    }

    // Reset cube to solved state
    reset() {
        this.initializeCube();
        this.rotationHistory = [];
        this.moveCount = 0;
    }

    // Get current move count
    getMoveCount() {
        return this.moveCount;
    }

    // Get move history
    getHistory() {
        return this.rotationHistory;
    }

    // Get current state
    getState() {
        return JSON.parse(JSON.stringify(this.state));
    }

    // Check if cube is solved (simplified - all faces are uniform in color)
    isSolved() {
        for (let face of this.faces) {
            const firstColor = this.state[face][0];
            for (let i = 1; i < 9; i++) {
                if (this.state[face][i] !== firstColor) {
                    return false;
                }
            }
        }
        return true;
    }

    // Undo last move
    undo() {
        if (this.rotationHistory.length === 0) return false;
        
        const lastMove = this.rotationHistory.pop();
        // Undo by doing the opposite move
        const oppositeMove = this.getOppositeMoveNotation(lastMove);
        
        // Reset and replay all moves except the last one
        const history = [...this.rotationHistory];
        this.reset();
        for (let move of history) {
            this.move(move);
        }
        this.moveCount = history.length;
        return true;
    }

    getOppositeMoveNotation(notation) {
        // Map each move to its opposite
        const opposites = {
            'U': 'u', 'u': 'U',
            'D': 'd', 'd': 'D',
            'L': 'l', 'l': 'L',
            'R': 'r', 'r': 'R',
            'F': 'f', 'f': 'F',
            'B': 'b', 'b': 'B',
            'M': 'm', 'm': 'M',
            'E': 'e', 'e': 'E',
            'S': 's', 's': 'S',
            'X': 'x', 'x': 'X',
            'Y': 'y', 'y': 'Y',
            'Z': 'z', 'z': 'Z'
        };
        return opposites[notation] || notation;
    }
}
