// Author: Bryce Han
// Load.js Preloads all of the assets that will be used.
class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        // Load tilemap information
        this.load.tilemapTiledJSON("lvl1complete", "lvl1complete.tmj");
        this.load.image("tilemap_tiles", "tilemap_packed.png"); 

        // Load the tilemap as a spritesheet
        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });
        
        this.load.multiatlas("kenny-particles", "kenny-particles.json");

        this.load.audio("jumpSfx", "impactGeneric_light_001.ogg");

        this.load.image("bg1", "1.Backround.png");
        this.load.image("bg2", "2.Trees_back.png");
        this.load.image("bg3", "3.Trees_front.png");
        this.load.image("bg4", "4.Ground.png");
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });

         // ...and pass to the next Scene
         this.scene.start("platformerScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}