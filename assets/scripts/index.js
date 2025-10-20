import Game from './game.js';
import View from './view.js';
import Controller from './controller.js';

const root = document.querySelector('#root');

if (!root) {
    throw new Error('Element #root not found in DOM');
}

const game = new Game();
const view = new View(root, 320, 640, 20, 10);
const controller = new Controller(game, view);

window.game = game;
window.view = view;
window.controller = controller;

// 🎮 Сенсорні кнопки управління
document.getElementById('left')?.addEventListener('click', () => {
    controller.game.movePieceLeft();
    controller.updateView();
});

document.getElementById('right')?.addEventListener('click', () => {
    controller.game.movePieceRight();
    controller.updateView();
});

document.getElementById('rotate')?.addEventListener('click', () => {
    controller.game.rotatePiece();
    controller.updateView();
});

document.getElementById('down')?.addEventListener('click', () => {
    controller.game.movePieceDown();
    controller.updateView();
});

document.getElementById('drop')?.addEventListener('click', () => {
    controller.game.dropPiece();
    controller.updateView();
});

document.getElementById('play')?.addEventListener('click', () => {
    if (controller.game.isGameOver()) {
        controller.reset();
    } else if (!controller.isPlaying) {
        controller.play();
    }
});
