var map, water, sand, grass, trees, bridges, game, marker, layer, cursors, PhaserGame, currentTile;

var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game');

PhaserGame = function () {};

PhaserGame.prototype = {
  preload: function () {
    //This adds the json file from tiles of the map and my images
    this.load.tilemap('map', 'assets/river-defense.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('terrain', 'assets/terrain_atlas.png');
    this.load.image('turrets', 'assets/turrets32.png');
    this.load.image('tank', 'assets/enemy10.png');
    this.points= {
      'x': [-16, 100, 200, 300, 400, 500, 600, 700, 740, 675, 600, 500, 400, 300, 205, 180, 190, 290, 390, 490, 590, 690, 790, 850, 860],
      'y': [130, 130, 130, 130, 130, 145, 160, 180, 250, 310, 340, 350, 350, 365, 400, 475, 550, 590, 610, 623, 630, 638, 650, 720, 800]
    };
    this.pi = 0;
  },
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
  }
}

game.state.add('Game', PhaserGame, true);
