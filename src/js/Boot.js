const game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game');
const PhaserGame = () => {};

PhaserGame.Boot = game => {};

PhaserGame.Boot.prototype = {
  init() { this.input.maxPointers= 1; },
  preload() { /*Load the assets needed for your preloader bootscreen here*/
  },
  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    game.input.keyboard.createCursorKeys();
    this.state.start('Preloader');
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.scale.startFullScreen();
  }
};

game.state.add('Boot', PhaserGame.Boot);
