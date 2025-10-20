export default class Controller {
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.intervalId = null;
        this.isPlaying = false;

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));

        this.view.renderStartScreen();
    }

    update() {
        this.game.movePieceDown();
        this.updateView();
    }

    play() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.startTimer();
            this.updateView();
        }
    }

    pause() {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.stopTimer();
            this.updateView();
        }
    }

    reset() {
        this.game.reset();
        this.play();
    }

    updateView() {
        const state = this.game.getState();

        if (state.isGameOver) {
            this.stopTimer();
            this.view.renderEndScreen(state);
        } else if (!this.isPlaying) {
            this.view.renderPauseScreen(state);
        } else {
            this.view.renderMainScreen(state);
        }
    }

    startTimer() {
        const speed = 1000 - this.game.level * 100;
        const interval = speed > 100 ? speed : 100;

        this.stopTimer(); // гарантія, що таймер не дублюється
        this.intervalId = setInterval(() => this.update(), interval);
    }

    stopTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    handleKeyDown(event) {
        const state = this.game.getState();

        switch (event.keyCode) {
            case 13: // Enter
                if (state.isGameOver) {
                    this.reset();
                } else if (this.isPlaying) {
                    this.pause();
                } else {
                    this.play();
                }
                break;

            case 37: // Left
                this.game.movePieceLeft();
                this.updateView();
                break;

            case 38: // Up
                this.game.rotatePiece();
                this.updateView();
                break;

            case 39: // Right
                this.game.movePieceRight();
                this.updateView();
                break;

            case 40: // Down
                this.stopTimer();
                this.game.movePieceDown();
                this.updateView();
                break;

            case 32: // Space — миттєве падіння
                this.stopTimer();
                this.game.dropPiece();
                this.updateView();
                break;
        }
    }

    handleKeyUp(event) {
        if (event.keyCode === 40) {
            this.startTimer();
        }
    }
}