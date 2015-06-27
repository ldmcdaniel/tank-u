var PhaserGame = {};

var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game');

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

    this.state.start('Preloader')

  }

};

game.state.add('Boot', PhaserGame.Boot);
