PhaserGame.Game = function (game) {
  this.map;
  this.road;
  this.trees;
  this.turrets;
  this.test;
  this.bmd;
}

PhaserGame.Game.prototype = {
  create: function () {
    this.map = this.add.tilemap('map');

    //The first param is the name of the tileset from tiled; the second is from game.load.image
    this.map.addTilesetImage('terrain_atlas', 'terrain');
    this.map.addTilesetImage('turrets32', 'turrets')

    //Layers from my map
    this.road = this.map.createLayer('Road');
    this.grass = this.map.createLayer('Grass');
    this.trees = this.map.createLayer('Tree bases');
    this.turrets = this.map.createLayer('Turrets');

    //Enemy sprite and travel path information
    this.test = this.add.sprite(-16, 116, 'tank');
    // this.test.scale.setTo(1, 1);
    this.test.anchor.set(0.5);
    this.bmd = this.add.bitmapData(game.width, game.height);
    this.bmd.addToWorld();
    this.plot();
    this.bridges = this.map.createLayer('Tree Tops and Bridges');

    //Mouse marker
    marker = game.add.graphics();
    marker.lineStyle(2, 0x000000, 1);
    marker.drawRect(0, 0, 32, 32);

    currentTile = this.map.getTile(30, 0, 'Turrets')

    this.cursors = game.input.keyboard.createCursorKeys();
  },

  plot: function () {

    //Path plot info for the enemy sprites
    this.path = [];
    var ix = 0;
    var x = 1 / game.width;

    for (var i = 0; i <= 1; i += x) {
      var px = this.math.catmullRomInterpolation(this.points.x, i);
      var py = this.math.catmullRomInterpolation(this.points.y, i);

      //This code was before I put the angle rotation of the ships into the code
      // this.path.push( { x: px, y: py });

      //This draws the path onto the screen to edit the path
      // this.bmd.rect(px, py, 1, 1, 'rgba(255, 255, 255, 1)');

      var node = {x: px, y: py, angle: 0};
      if (ix > 0) {
        node.angle = this.math.angleBetweenPoints(this.path[ix - 1], node);
      }
      this.path.push(node);
      ix++;
    }

    //This code draws rectangles onto the path where the nodes are located
    // for (var p = 0; p < this.points.x.length; p++) {
    //   this.bmd.rect(this.points.x[p]-3, this.points.y[p]-3, 6, 6, 'rgba(255, 0, 0, 1)');
    // }

  },

  update: function (){

    //Marks the current location of the mouse
    marker.x = this.turrets.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = this.turrets.getTileY(game.input.activePointer.worldY) * 32;

    if (game.input.mousePointer.isDown) {
      if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
        currentTile = this.map.getTile(this.turrets.getTileX(marker.x), this.turrets.getTileY(marker.y), 'Turrets');
      } else {
        if (this.map.getTile(this.turrets.getTileX(marker.x), this.turrets.getTileY(marker.y)) !== currentTile) {
          this.map.putTile(currentTile, this.turrets.getTileX(marker.x), this.turrets.getTileY(marker.y), 'Turrets')
        }
      }
    }

    //Information for the path of enemy sprite
    this.test.x = this.path[this.pi].x;
    this.test.y = this.path[this.pi].y;
    this.test.rotation = this.path[this.pi].angle;

    this.pi++;

    if (this.pi >= this.path.length) {
      this.pi = 0;
    }
  },

  quitGame: function (pointer) {

    //  Here you should destroy anything you no longer need.
    //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

    game.state.start('MainMenu');

  }

};

game.state.add('Boot', PhaserGame.Boot);
game.state.add('Preloader', PhaserGame.Preloader);
game.state.add('MainMenu', PhaserGame.MainMenu);
game.state.add('Game', PhaserGame.Game);

game.state.start('Boot');
