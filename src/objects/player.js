// player.js
// Author: Bryce Han
// module for the player and their anims
// player.js
class Player {
constructor(scene, x, y, walkEmitter) {
    this.scene = scene;
    this.vfx     = { walking: walkEmitter };
    
    // copy constants from the scene so we can use them directly:
    this.ACCELERATION   = scene.ACCELERATION;
    this.DRAG           = scene.DRAG;
    this.JUMP_VELOCITY  = scene.JUMP_VELOCITY;
    this.PARTICLE_VELOCITY = scene.PARTICLE_VELOCITY;

    // create the Arcade sprite
    this.sprite = scene.physics.add
      .sprite(x, y, "platformer_characters", "tile_0000.png")
      .setCollideWorldBounds(true);

    // input
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.vfx.walking.startFollow(this.sprite, 0, this.sprite.displayHeight/2, false);
    // dust‐puff throttle
    this.nextPuffTime  = 0;
    this.puffInterval  = 150; // ms
  }

  update(time /*, delta*/) {
    const body     = this.sprite.body;
    const onGround = body.blocked.down;
    const vx       = Math.abs(body.velocity.x);
    // ← / → movement
    if (this.cursors.left.isDown) {
      this.sprite.setAccelerationX(-this.ACCELERATION);
      this.sprite.setFlipX(true);
      this.sprite.anims.play("walk", true);
      this.vfx.walking.start();

    } else if (this.cursors.right.isDown) {
      this.sprite.setAccelerationX(this.ACCELERATION);
      this.sprite.setFlipX(false);
      this.sprite.anims.play("walk", true);
      this.vfx.walking.start();

    } else {
      this.sprite.setAccelerationX(0);
      this.sprite.setDragX(this.DRAG);
      this.sprite.anims.play("idle", true);
      this.vfx.walking.stop();
    }

    // jump
    if (onGround && Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      body.setVelocityY(this.JUMP_VELOCITY);
      this.scene.sound.play("jumpSfx");
    }
    if (!onGround) {
      this.sprite.anims.play("jump", true);
      this.vfx.walking.stop();
    }

    
  }
}