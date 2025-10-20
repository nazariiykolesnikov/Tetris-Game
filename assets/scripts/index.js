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
