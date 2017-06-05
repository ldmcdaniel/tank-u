const game = new Phaser.Game(2048, 1532, Phaser.CANVAS, 'game');
const PhaserGame = () => { 
};

PhaserGame.Boot = game => {
};

PhaserGame.Boot.prototype = {
  init() { this.input.maxPointers= 1; },
  preload() { /*Load the assets needed for your preloader bootscreen here*/ },
  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    game.input.keyboard.createCursorKeys();
    // console.log(game.scale.fullScreenScaleMode, Phaser.ScaleManager.EXACT_FIT);
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.scale.startFullScreen();
    this.state.start('Preloader');
  }
};

game.state.add('Boot', PhaserGame.Boot);
