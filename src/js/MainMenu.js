PhaserGame.MainMenu = {
  create() {
    this.createScale();
    this.createSplashScreen();
    this.createBackgroundMusic();
    game.input.onDown.addOnce(this.start, this);
  },
  createScale() {
    this.scale = 1;
    if (window.innerWidth < 1024 || window.innerHeight < 768) {
      if ((window.innerWidth/1024) > (window.innerHeight/768)) {
        this.scale = window.innerHeight/768;
      } else {
        this.scale = window.innerWidth/1024;
      }
    }
  },
  createSplashScreen() {
    const map = this.add.tilemap('title');
    map.addTilesetImage('terrain_atlas', 'terrain');
    map.addTilesetImage('15_tank_set 68x68', 'tanks');
    let layers = ['Rock', 'Fire', 'Sand', 'Grass', '11Tanks'];
    layers.forEach(layer => {
      let thisLayer = map.createLayer(layer);
      thisLayer.scale.set(this.scale);
    });
  },
  createBackgroundMusic() {
    this.menuBackgroundMusic = game.add.audio('menuBackgroundMusic');
    this.menuBackgroundMusic.play();
  },
  start() {
    this.menuBackgroundMusic.stop();
    game.state.start('Game');
  }
};

game.state.add('MainMenu', PhaserGame.MainMenu);
