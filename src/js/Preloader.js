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
    this.load.image('tank01', 'assets/enemy01.png');
    this.load.image('tank02', 'assets/enemy02.png');
    this.load.image('tank03', 'assets/enemy03.png');
    this.load.image('tank04', 'assets/enemy04.png');
    this.load.image('tank05', 'assets/enemy05.png');
    this.load.image('tank06', 'assets/enemy06.png');
    this.load.image('tank07', 'assets/enemy07.png');
    this.load.image('tank08', 'assets/enemy08.png');
    this.load.image('tank09', 'assets/enemy09.png');

    var welcome = game.add.text(100, 100, 'coming...', {font: '30px Courier', fill: '#eeeeee'});

  },

  create: function () {

    this.state.start('MainMenu');

  }
};

game.state.add('Preloader', PhaserGame.Preloader);
