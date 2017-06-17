const game = new Phaser.Game(1024, 768, Phaser.CANVAS, 'game');
const PhaserGame = {};

PhaserGame.Boot = {
  init() { this.input.maxPointers= 1; },
  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    game.input.keyboard.createCursorKeys();
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.scale.startFullScreen();
    this.state.start('Preloader');
  }
};

game.state.add('Boot', PhaserGame.Boot);