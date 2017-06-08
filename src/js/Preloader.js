PhaserGame.Preloader = {
  preload() {
    this.createVisualAssets();
    this.createAudioAssets();
  },
  create() { 
    this.state.start('MainMenu');
  },
  createVisualAssets() {
    let load = this.load;
    this.createSplashScreen(load);
    this.createGameAssets(load);
  },
  createSplashScreen(load) {
    load.tilemap('title', 'assets/title-screen.json', null, Phaser.Tilemap.TILED_JSON);
    load.image('tanks', 'assets/15_tank_set 68x68.png');
  },
  createGameAssets(load) {
    this.createMap(load);
    this.createTurrets(load);
    this.createTanks(load);
    game.add.text(100, 100, 'Preparing for battle...', {font: '30px Courier', fill: '#eeeeee'});
  },
  createMap(load) {
    load.tilemap('map', 'assets/river-defense.json', null, Phaser.Tilemap.TILED_JSON);
    load.image('terrain', 'assets/terrain_atlas.png');
  },
  createTurrets(load) {
    load.image('turrets', 'assets/turrets32.png');
    for (let i = 1; i < 9; i++) {
      load.image('turret' + i, 'assets/turret' + i + '.png')
    }
    load.image('coin', 'assets/coin64.png');
    load.image('bullet', 'assets/bullet_right.png');
    load.image('bullet1', 'assets/bullet.png');
  },
  createTanks(load) {
    for (let i = 1; i < 32; i++) {
      load.image('tank' + i, 'assets/enemy' + i + '.png');
    };
    load.spritesheet('explosion', 'assets/explosion192.png', 192, 192);
  },
  createAudioAssets() {
    let load = this.load;
    load.audio('menuBackgroundMusic', 'assets/superhappycheesyloop1of2.wav');
    load.audio('backgroundMusic', 'assets/superhappycheesyloop2of2.wav');
    load.audio('cashRegister', 'assets/cash-register.mp3');
    load.audio('explosion', 'assets/explosion.wav');
    load.audio('shot', 'assets/gun-shot.wav');
  }
};

game.state.add('Preloader', PhaserGame.Preloader);
