PhaserGame.Preloader = game => { };

PhaserGame.Preloader.prototype = {
  preload() {
    let load = this.load;
    //Load the elements from the Boot.js for the splash screen
    load.tilemap('title', 'assets/title-screen.json', null, Phaser.Tilemap.TILED_JSON);
    load.image('tanks', 'assets/15_tank_set 68x68.png');
    //Load the rest of the element for our game
    //This adds the json file from tiles of the map and my images
    load.tilemap('map', 'assets/river-defense.json', null, Phaser.Tilemap.TILED_JSON);
    load.image('terrain', 'assets/terrain_atlas.png');
    load.image('turrets', 'assets/turrets32.png');
    for (let i = 1; i < 32; i++) {
      load.image('tank' + i, 'assets/enemy' + i + '.png');
    };
    for (let i = 1; i < 9; i++) {
      load.image('turret' + i, 'assets/turret' + i + '.png')
    }
    load.image('bullet', 'assets/bullet_right.png');
    load.image('bullet1', 'assets/bullet.png');
    load.spritesheet('explosion', 'assets/explosion192.png', 192, 192);
    load.image('coin', 'assets/coin64.png');
    load.audio('menuBackgroundMusic', 'assets/superhappycheesyloop1of2.wav');
    load.audio('backgroundMusic', 'assets/superhappycheesyloop2of2.wav');
    load.audio('cashRegister', 'assets/cash-register.mp3');
    load.audio('explosion', 'assets/explosion.wav');
    load.audio('shot', 'assets/gun-shot.wav');
    game.add.text(100, 100, 'Preparing for battle...', {font: '30px Courier', fill: '#eeeeee'});
  },
  create() { this.state.start('MainMenu'); }
};

game.state.add('Preloader', PhaserGame.Preloader);
