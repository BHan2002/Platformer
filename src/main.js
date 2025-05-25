// Bryce Han
// Created: 5/15/2025

// debug with extreme prejudice
"use strict"


// game config
const config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 2592,
    height: 1000,
  scene: [ Load, LevelOne, EndingScene ]
};
var cursors;
new Phaser.Game(config);