PhaserGame.MainMenu = function (game) {
  //create this.varName here for use in the prototype for the menu
};

var menuBackgroundMusic;

PhaserGame.MainMenu.prototype = {
  create: function () {

    this.map = this.add.tilemap('title');
    this.map.addTilesetImage('terrain_atlas', 'terrain');
    this.map.addTilesetImage('15_tank_set 68x68', 'tanks');

    this.rock = this.map.createLayer('Rock');
    this.fire = this.map.createLayer('Fire');
    this.sand = this.map.createLayer('Sand');
    this.grass = this.map.createLayer('Grass');
    this.titleTanks = this.map.createLayer('11Tanks');
    this.menuBackgroundMusic = game.add.audio('menuBackgroundMusic');
    this.menuBackgroundMusic.play();


    //use the variables using this.varName to add to the menu

    // var titleLabel = game.add.text(100, 100, 'Saving the World', {font: '50px Arial', fill: '#eeeeee'});

    // var startLabel = game.add.text(100, game.world.height-100, 'Press "w" to Begin', {font: '20px Arial', fill: '#eeeeee'});

    game.input.onDown.addOnce(this.start, this);

  },

  start: function () {
    this.menuBackgroundMusic.stop();

    game.state.start('Game');

  },


  update: function () {

    //Do some nice funky main menu effect here

  },

  resize: function () {

  }

};

game.state.add('MainMenu', PhaserGame.MainMenu);
