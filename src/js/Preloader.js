PhaserGame.Preloader = function (game) {

};

PhaserGame.Preloader.prototype = {
  preload: function () {
    //Load the elements from the Boot.js for the splash screen
    this.load.tilemap('title', 'assets/title-screen.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tanks', 'assets/15_tank_set 68x68.png');

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
    this.load.image('tank10', 'assets/enemy10.png');
    this.load.image('tank11', 'assets/enemy11.png');
    this.load.image('tank12', 'assets/enemy12.png');
    this.load.image('tank13', 'assets/enemy13.png');
    this.load.image('tank14', 'assets/enemy14.png');
    this.load.image('tank15', 'assets/enemy15.png');
    this.load.image('tank16', 'assets/enemy16.png');
    this.load.image('tank17', 'assets/enemy17.png');
    this.load.image('tank18', 'assets/enemy18.png');
    this.load.image('tank19', 'assets/enemy19.png');
    this.load.image('tank20', 'assets/enemy20.png');
    this.load.image('tank21', 'assets/enemy21.png');
    this.load.image('tank22', 'assets/enemy22.png');
    this.load.image('tank23', 'assets/enemy23.png');
    this.load.image('tank24', 'assets/enemy24.png');
    this.load.image('tank25', 'assets/enemy25.png');
    this.load.image('tank26', 'assets/enemy26.png');
    this.load.image('tank27', 'assets/enemy27.png');
    this.load.image('tank28', 'assets/enemy28.png');
    this.load.image('tank29', 'assets/enemy29.png');
    this.load.image('tank30', 'assets/enemy30.png');
    this.load.image('tank31', 'assets/enemy31.png');


    this.load.image('turret1', 'assets/turret1.png');

    var welcome = game.add.text(100, 100, 'coming...', {font: '30px Courier', fill: '#eeeeee'});


  },

  create: function () {

    this.state.start('MainMenu');

  }
};

game.state.add('Preloader', PhaserGame.Preloader);
