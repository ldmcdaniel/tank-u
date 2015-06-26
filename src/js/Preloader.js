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
    this.points= {
      'x': [-16, 100, 200, 300, 400, 500, 600, 700, 740, 675, 600, 500, 400, 300, 205, 180, 190, 290, 390, 490, 590, 690, 790, 850, 860],
      'y': [130, 130, 130, 130, 130, 145, 160, 180, 250, 310, 340, 350, 350, 365, 400, 475, 550, 590, 610, 623, 630, 638, 650, 720, 800]
    };
    this.pi = 0;

    var welcome = game.add.text(100, 100, 'coming...', {font: '30px Courier', fill: '#eeeeee'});

  },

  create: function () {

    this.state.start('MainMenu');

  }
};
