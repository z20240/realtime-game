import Phaser from 'phaser';
import Scene from './Scene1';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: "game-area",
    physics: {
        default: "arcade",
        arcade: {
            // gravity: { y: 300 },
            debug: true
        }
    },
    /** default 預載第一個，之後每一個請用 scene.start() */
    scene: [ Scene ]
};

new Phaser.Game(config);