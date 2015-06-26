PhaserGame.Preloader = function (game) {

};

PhaserGame.Preloader.prototype = {
  preload: function () {
    //Load the elements from the Boot.js for the splash screen

    //Load the rest of the element for our game
    //This adds the json file from tiles of the map and my images
    this.load.tilemap('map', 'assets/river-defense.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('terrain', 'assets/terrain_atlas.png');
    this.load.image('turrets', 'assets/turrets32.png');
    this.load.image('tank', 'assets/enemy30.png');

    var welcome = game.add.text(100, 100, 'coming...', {font: '30px Courier', fill: '#eeeeee'});

  },

  create: function () {

    this.state.start('MainMenu');

  }
};
