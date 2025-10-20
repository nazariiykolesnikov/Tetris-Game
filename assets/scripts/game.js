export default class Game {
    static points = {
        '1': 40,
        '2': 100,
        '3': 300,
        '4': 1200
    };

    constructor() {
        this.reset();
    }

    get level() {
        return Math.floor(this.lines * 0.1);
    }

    getState() {
        const playfield = this.playfield.map(row => [...row]);
        const { x: pieceX, y: pieceY, blocks } = this.activePiece;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    // ✅ Безпечна перевірка, щоб уникнути виходу за межі масиву
                    if (playfield[pieceY + y]) {
                        playfield[pieceY + y][pieceX + x] = blocks[y][x];
                    }
                }
            }
        }

        return {
            score: this.score,
            level: this.level,
            lines: this.lines,
            nextPiece: this.nextPiece,
            playfield,
            isGameOver: this.topOut
        };
    }

    isGameOver() {
        return this.topOut;
    }

    reset() {
        this.score = 0;
        this.lines = 0;
        this.topOut = false;
        this.playfield = this.createPlayfield();
        this.activePiece = this.createPiece();
        this.nextPiece = this.createPiece();
    }

    createPlayfield() {
        return Array.from({ length: 20 }, () => Array(10).fill(0));
    }

    createPiece() {
        const index = Math.floor(Math.random() * 7);
        const type = 'IJLOSTZ'[index];
        const piece = {};

        switch (type) {
            case 'I':
                piece.blocks = [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0]
                ];
                break;
            case 'J':
                piece.blocks = [
                    [0, 0, 0],
                    [2, 2, 2],
                    [0, 0, 2]
                ];
                break;
            case 'L':
                piece.blocks = [
                    [0, 0, 0],
                    [3, 3, 3],
                    [3, 0, 0]
                ];
                break;
            case 'O':
                piece.blocks = [
                    [0, 0, 0, 0],
                    [0, 4, 4, 0],
                    [0, 4, 4, 0],
                    [0, 0, 0, 0]
                ];
                break;
            case 'S':
                piece.blocks = [
                    [0, 0, 0],
                    [0, 5, 5],
                    [5, 5, 0]
                ];
                break;
            case 'T':
                piece.blocks = [
                    [0, 0, 0],
                    [6, 6, 6],
                    [0, 6, 0]
                ];
                break;
            case 'Z':
                piece.blocks = [
                    [0, 0, 0],
                    [7, 7, 0],
                    [0, 7, 7]
                ];
                break;
        }

        piece.x = Math.floor((10 - piece.blocks[0].length) / 2);
        piece.y = 0;
        return piece;
    }

    movePieceLeft() {
        this.activePiece.x -= 1;
        if (this.isPieceOutOfBounds() || this.hasCollision()) {
            this.activePiece.x += 1;
        }
    }

    movePieceRight() {
        this.activePiece.x += 1;
        if (this.isPieceOutOfBounds() || this.hasCollision()) {
            this.activePiece.x -= 1;
        }
    }

    movePieceDown() {
        if (this.topOut) return;

        this.activePiece.y += 1;

        if (this.hasCollision()) {
            this.activePiece.y -= 1;
            this.lockPiece();
            const clearedLines = this.clearLines();
            this.updateScore(clearedLines);
            this.updatePieces();
        }
    }

    dropPiece() {
        if (this.topOut) return;

        while (!this.hasCollision()) {
            this.activePiece.y += 1;
        }

        this.activePiece.y -= 1;
        this.lockPiece();
        const clearedLines = this.clearLines();
        this.updateScore(clearedLines);
        this.updatePieces();
    }

    rotatePiece() {
        this.rotateBlocks();
        if (this.hasCollision()) {
            this.rotateBlocks(false);
        }
    }

    rotateBlocks(clockwise = true) {
        const blocks = this.activePiece.blocks;
        const length = blocks.length;

        for (let y = 0; y < length / 2; y++) {
            for (let x = y; x < length - y - 1; x++) {
                const temp = blocks[y][x];

                if (clockwise) {
                    blocks[y][x] = blocks[length - x - 1][y];
                    blocks[length - x - 1][y] = blocks[length - y - 1][length - x - 1];
                    blocks[length - y - 1][length - x - 1] = blocks[x][length - y - 1];
                    blocks[x][length - y - 1] = temp;
                } else {
                    blocks[y][x] = blocks[x][length - y - 1];
                    blocks[x][length - y - 1] = blocks[length - y - 1][length - x - 1];
                    blocks[length - y - 1][length - x - 1] = blocks[length - x - 1][y];
                    blocks[length - x - 1][y] = temp;
                }
            }
        }
    }

    isPieceOutOfBounds() {
        const { x: pieceX, blocks } = this.activePiece;

        return blocks.some(row =>
            row.some((cell, x) => cell && (pieceX + x < 0 || pieceX + x >= 10))
        );
    }

    hasCollision() {
        const { y: pieceY, x: pieceX, blocks } = this.activePiece;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (
                    blocks[y][x] &&
                    (
                        this.playfield[pieceY + y] === undefined ||
                        this.playfield[pieceY + y][pieceX + x] === undefined ||
                        this.playfield[pieceY + y][pieceX + x]
                    )
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    lockPiece() {
        const { y: pieceY, x: pieceX, blocks } = this.activePiece;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    this.playfield[pieceY + y][pieceX + x] = blocks[y][x];
                }
            }
        }
    }

    clearLines() {
        const rows = 20;
        const columns = 10;
        const lines = [];

        for (let y = rows - 1; y >= 0; y--) {
            if (this.playfield[y].every(cell => cell !== 0)) {
                lines.unshift(y);
            }
        }

        for (const index of lines) {
            this.playfield.splice(index, 1);
            this.playfield.unshift(new Array(columns).fill(0));
        }

        return lines.length;
    }

    updateScore(clearedLines) {
        if (clearedLines > 0) {
            this.score += Game.points[clearedLines] * (this.level + 1);
            this.lines += clearedLines;
        }
    }

    updatePieces() {
        this.activePiece = this.nextPiece;
        this.nextPiece = this.createPiece();

        if (this.hasCollision()) {
            this.topOut = true;
        }
    }
}
