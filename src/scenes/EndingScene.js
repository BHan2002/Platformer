class EndingScene extends Phaser.Scene {
  constructor() {
    super("endingScene");
  }

  preload() {
    // load any assets for the ending screen
    //this.load.image("endBg", "assets/ending-background.png");
  }

  create() {
    // add background
    //his.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "endBg")
        //.setOrigin(0.5);

    // show some text
    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 50,
      "Congratulations!\nYou reached the end!", {
        font: "32px Arial",
        color: "#ffffff",
        align: "center"
      })
      .setOrigin(0.5);

    // optionally add a “Play Again” button
    const playAgain = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 150,
      "[Click to Play Again]", {
        font: "24px Arial",
        color: "#ffff00"
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.scene.start("platformerScene"));
  }
}
