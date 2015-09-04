var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game');

var PhaserGame = function (){
};

PhaserGame.Boot = function (game) {

};


PhaserGame.Boot.prototype = {

  init: function () {

    this.input.maxPointers= 1;

    // this.scale.scaleMode = Phaser.ScaleManager.RESIZE;

  },

  preload: function () {

    //Load the assets needed for your preloader bootscreen here


  },

  create: function () {

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.cursors = game.input.keyboard.createCursorKeys();
    this.state.start('Preloader');
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.scale.startFullScreen();

  }

};

game.state.add('Boot', PhaserGame.Boot);
