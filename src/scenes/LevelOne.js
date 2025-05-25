
class LevelOne extends Phaser.Scene {
  constructor() {
    super("platformerScene");
  }

    init() {
        // variables and settings
        this.ACCELERATION = 400;
        this.DRAG = 500;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;

        this.vfx = {};
    }

  create() {
    this.map = this.make.tilemap({ key: "lvl1complete"});
    cursors = this.input.keyboard.createCursorKeys();
    const worldW = this.map.widthInPixels;
    const worldH = this.map.heightInPixels;

    // furthest back (moves slowest)
    this.add
      .tileSprite(0, 0, worldW, worldH, "bg1")
      .setOrigin(0)
      .setScrollFactor(0.2);

    // next layer
    this.add
      .tileSprite(0, 0, worldW, worldH, "bg2")
      .setOrigin(0)
      .setScrollFactor(0.4);

    // mid-ground
    this.add
      .tileSprite(0, 0, worldW, worldH, "bg3")
      .setOrigin(0)
      .setScrollFactor(0.6);

    // closest (moves fastest)
    this.add
      .tileSprite(0, 0, worldW, worldH, "bg4")
      .setOrigin(0)
      .setScrollFactor(0.8);

    this.map = this.make.tilemap({ key: "lvl1complete"});

    this.tileset = this.map.addTilesetImage("lvl1_tileset","tilemap_tiles");

    this.floorLayer   = this.map.createLayer("Floor",   this.tileset, 0, 0);
    this.detailsLayer = this.map.createLayer("Details", this.tileset, 0, 0);

    this.floorLayer .setCollisionByProperty({ Collides: true }); 

    this.floorLayer.setCollisionByProperty({
        collides: true
    });
    
    // Walking
    this.walkEmitter = this.add.particles(0, 0, "kenny-particles", {
      frame: ['smoke_03.png', 'smoke_09.png'],
      //addRandom: true,
      scale: {start: 0.03, end: 0.1},
      maxAliveParticles: 8,
      lifespan: 400,
      gravityY: -400,
      alpha: {start: 1, end: 0.1}, 
      on: false
    });

    this.player = new Player(this, 100, 300, this.walkEmitter);
    this.player.sprite.setCollideWorldBounds(true);
    this.physics.add.collider(this.player.sprite, this.floorLayer);
    
    // -- coins -------------------------------------

    // -- vfx ---------------------------------------
    this.vfx.Coin = this.add.particles(0, 0, "kenny-particles", {
          frame:["star_01.png", "star_02.png", "star_03.png", "star_04.png", "star_05.png"],
          scale: {start: 0.10, end: 0.1},
          lifespan: 600 ,
          alpha: {start: 1, end: 0.1},
          on: false
      });
      
    
    const coinObjects = this.map.getObjectLayer("Coins").objects;
    this.coinGroup = this.physics.add.staticGroup();
    coinObjects.forEach(obj => {
      
      const x = obj.x;
      const y = obj.y - obj.height;

      this.coinGroup
        .create(x, y, "tilemap_sheet", 151)
        .setOrigin(0)
        .refreshBody();  
    });

    this.physics.add.overlap(
      this.player.sprite,
      this.coinGroup,
      (playerSprite, coin) => {
        this.vfx.Coin.explode(
          10,
          coin.x + coin.displayWidth/2,
          coin.y + coin.displayHeight/2
        );

        coin.destroy();
        // increment score / play sfx …
      }
    );

    // -- Springs ------------------------------------
    const springLayer = this.map.getObjectLayer("Springs");
    this.springGroup = this.physics.add.staticGroup();

    springLayer.objects.forEach(obj => {
      const x = obj.x;
      const y = obj.y - obj.height;  // Tiled y is bottom of object

      // create one spring sprite + body
      this.springGroup
        .create(x, y, "tilemap_sheet", 107)
        .setOrigin(0)
        .refreshBody();
    });

    const SPRING_VELOCITY = this.JUMP_VELOCITY * 1.5; // 50% stronger

    this.physics.add.collider(
      this.player.sprite,
      this.springGroup,
      (playerSprite, spring) => {
        // only bounce if you’re landing on it (blocked.down or velocity.y > 0)
        if (playerSprite.body.blocked.down || playerSprite.body.velocity.y > 0) {
          playerSprite.setVelocityY(SPRING_VELOCITY);
          // optional: play a spring “bounce” animation/sound

        }
      }
    );

    // Spikes
    const spikeLayer = this.map.getObjectLayer("Spikes");
    
    this.spikeGroup = this.physics.add.staticGroup();

    spikeLayer.objects.forEach(obj => {
      const x = obj.x;
      const y = obj.y - obj.height;

      this.spikeGroup
        .create(x, y, "tilemap_sheet", 68)
        .setOrigin(0)
        .refreshBody();
    });

    this.physics.add.overlap(
      this.player.sprite,
      this.spikeGroup,
      (playerSprite, spike) => {
        // disable further collisions while we handle death
        playerSprite.body.enable = false;

        // play a death animation or flash:
        this.tweens.add({
          targets: playerSprite,
          alpha: { from: 1, to: 0 },
          duration: 200,
          yoyo: true,
          repeat: 3,
          onComplete: () => {
            // respawn or restart level:
            this.scene.restart();
            // OR call your loseLife() handler:
            // this.loseLife();
          }
        });
      }
    );

    // -- flag --------------------------------------
    const flagLayer = this.map.getObjectLayer("Flags");
    this.flagGroup = this.physics.add.staticGroup();

    flagLayer.objects.forEach(obj => {
      // Tiled y is the *bottom* of the object
      const x = obj.x;
      const y = obj.y - obj.height;

      // create a sprite + static body at (x,y)
      this.flagGroup
        .create(x, y, "tilemap_sheet",111 )
        .setOrigin(0)
        .refreshBody();
    });

    this.physics.add.overlap(
      this.player.sprite,
      this.flagGroup,
      () => {
      this.scene.start("endingScene");
      },
    );

    // ── camera follow ─────────────────────────────
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player.sprite, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
    this.cameras.main.setDeadzone(50, 50);
    this.cameras.main.setZoom(this.SCALE);
    // ── reset key ────────────────────────────────

    this.rKey = this.input.keyboard.addKey('R');
  }

  update() {
    //if (Phaser.Input.Keyboard.JustDown(this.rKey)) {
      //return this.scene.restart();
    //}
    this.player.update();
  }
}
