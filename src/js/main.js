var map, water, sand, grass, trees, bridges, game, PhaserGame;

game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game');

PhaserGame = function () {};

PhaserGame.prototype = {
  preload: function () {
    //This adds the json file from tiles of the map and my images
    this.load.tilemap('map', 'images/river-defense.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles', 'images/terrain_atlas.png');
    this.load.image('boat', 'images/boat.gif');
    this.points= {
      'x': [-16, 100, 200, 300, 400, 500, 600, 700, 740, 675, 600, 500, 400, 300, 205, 180, 190, 290, 390, 490, 590, 690, 790, 850, 860],
      'y': [130, 130, 130, 130, 130, 145, 160, 180, 250, 310, 340, 350, 350, 365, 400, 475, 550, 590, 610, 623, 630, 638, 650, 720, 800]
    };
    this.pi = 0;
  },

  create: function () {
    this.map = this.add.tilemap('map');
      //The first param is the name of the tileset from tiled; the second is from game.load.image
    this.map.addTilesetImage('terrain_atlas', 'tiles');

    //These are the layers from my map
    this.water = this.map.createLayer('River');
    this.sand = this.map.createLayer('Dirt');
    this.grass = this.map.createLayer('Grass');
    this.trees = this.map.createLayer('Tree bases');

    this.test = this.add.sprite(-16, 116, 'boat');
    this.test.scale.setTo(2, 2);
    this.test.anchor.set(0.5);
    this.bmd = this.add.bitmapData(game.width, game.height);
    this.bmd.addToWorld();
    this.plot();
    this.bridges = this.map.createLayer('Tree Tops and Bridges');

  },

  plot: function () {
    this.path = [];
    var ix = 0;
    var x = 1 / 500;

    for (var i = 0; i <= 1; i += x) {
      var px = this.math.catmullRomInterpolation(this.points.x, i);
      var py = this.math.catmullRomInterpolation(this.points.y, i);
      // this.path.push( { x: px, y: py });
      // this.bmd.rect(px, py, 1, 1, 'rgba(255, 255, 255, 1)');
      var node = {x: px, y: py, angle: 0};
      if (ix > 0) {
        node.angle = this.math.angleBetweenPoints(this.path[ix - 1], node);
      }
      this.path.push(node);
      ix++;
    }

    // for (var p = 0; p < this.points.x.length; p++) {
    //   this.bmd.rect(this.points.x[p]-3, this.points.y[p]-3, 6, 6, 'rgba(255, 0, 0, 1)');
    // }

  },
  update: function (){
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




