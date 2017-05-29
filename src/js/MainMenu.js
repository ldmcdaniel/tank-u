PhaserGame.MainMenu = game => { /*create this.varName here for use in the prototype for the menu*/ };

PhaserGame.MainMenu.prototype = {
  create() {
    const map = this.add.tilemap('title');
    map.addTilesetImage('terrain_atlas', 'terrain');
    map.addTilesetImage('15_tank_set 68x68', 'tanks');
    map.createLayer('Rock');
    map.createLayer('Fire');
    map.createLayer('Sand');
    map.createLayer('Grass');
    map.createLayer('11Tanks');
    this.menuBackgroundMusic = game.add.audio('menuBackgroundMusic');
    this.menuBackgroundMusic.play();
    // use the variables using this.varName to add to the menu
    // var titleLabel = game.add.text(100, 100, 'Saving the World', {font: '50px Arial', fill: '#eeeeee'});
    // var startLabel = game.add.text(100, game.world.height-100, 'Press "w" to Begin', {font: '20px Arial', fill: '#eeeeee'});
    game.input.onDown.addOnce(this.start, this);
  },
  start() {
    this.menuBackgroundMusic.stop();
    game.state.start('Game');
  },
  update() { /*Do some nice funky main menu effect here */ },
  resize() { }
};

game.state.add('MainMenu', PhaserGame.MainMenu);
