var map, road, trees, turrets, test, bmd, marker, currentTile;

PhaserGame.Game = function (game) {
}

PhaserGame.Game.prototype = {

  create: function () {
    this.map = this.add.tilemap('map');

    //The first param is the name of the tileset from tiled; the second is from game.load.image
    this.map.addTilesetImage('terrain_atlas', 'terrain');
    this.map.addTilesetImage('turrets32', 'turrets');

    //Layers from my map
    this.road = this.map.createLayer('Road');
    this.grass = this.map.createLayer('Grass');
    this.trees = this.map.createLayer('Tree bases');
    this.turrets = this.map.createLayer('Turrets');

    // game.time.events.add(Phaser.Timer.SECOND * 4, this.addWaves, this);

    //Enemy sprite and travel path information
    this.tank01 = this.add.sprite(-16, 116, 'tank01');
    this.tank02 = this.add.sprite(-66, 116, 'tank02');
    this.tank03 = this.add.sprite(-116, 116, 'tank03');
    this.tank04 = this.add.sprite(-166, 116, 'tank04');
    this.tank05 = this.add.sprite(-216, 116, 'tank05');
    this.tank06 = this.add.sprite(-266, 116, 'tank06');
    this.tank07 = this.add.sprite(-316, 116, 'tank07');
    this.tank08 = this.add.sprite(-366, 116, 'tank08');
    this.tank09 = this.add.sprite(-416, 116, 'tank09');

    // this.test.scale.setTo(1, 1);
    this.tank01.anchor.set(0.5);
    this.tank02.anchor.set(0.5);
    this.tank03.anchor.set(0.5);
    this.tank04.anchor.set(0.5);
    this.tank05.anchor.set(0.5);
    this.tank06.anchor.set(0.5);
    this.tank07.anchor.set(0.5);
    this.tank08.anchor.set(0.5);
    this.tank09.anchor.set(0.5);


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

  // addWaves: function () {
  //   //Enemy sprite and travel path information
  //   this.tank01 = this.add.sprite(-16, 116, 'tank01');
  //   // this.test.scale.setTo(1, 1);
  //   this.tank01.anchor.set(0.5);

  //   this.bmd = this.add.bitmapData(game.width, game.height);
  //   this.bmd.addToWorld();
  //   this.plot();
  // },

  plot: function () {

    //Path plot info for the enemy sprites

    this.path = [];

    var ix = 0;
    var x = 1 / (game.width + 800);

    this.points= {
      'x': [-416, -366, -316, -266, -216, -156, -56, -16, 100, 200, 300, 400, 500, 600, 700, 740, 675, 600, 500, 400, 300, 205, 180, 190, 290, 390, 490, 590, 690, 790, 850, 860, 860, 860, 860, 860, 860, 860, 860, 860, 860],
      'y': [130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 145, 160, 180, 250, 310, 340, 350, 350, 365, 400, 475, 550, 590, 610, 623, 630, 638, 650, 720, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250]
    };
    this.pi = 0;

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
    this.tank09.x = this.path[this.pi].x;
    this.tank09.y = this.path[this.pi].y;
    this.tank09.rotation = this.path[this.pi].angle;

    this.tank08.x = this.path[this.pi + 40].x;
    this.tank08.y = this.path[this.pi + 40].y;
    this.tank08.rotation = this.path[this.pi + 40].angle;

    this.tank07.x = this.path[this.pi + 80].x;
    this.tank07.y = this.path[this.pi + 80].y;
    this.tank07.rotation = this.path[this.pi + 80].angle;

    this.tank06.x = this.path[this.pi + 120].x;
    this.tank06.y = this.path[this.pi + 120].y;
    this.tank06.rotation = this.path[this.pi + 120].angle;

    this.tank05.x = this.path[this.pi + 160].x;
    this.tank05.y = this.path[this.pi + 160].y;
    this.tank05.rotation = this.path[this.pi + 160].angle;

    this.tank04.x = this.path[this.pi + 200].x;
    this.tank04.y = this.path[this.pi + 200].y;
    this.tank04.rotation = this.path[this.pi + 200].angle;

    this.tank03.x = this.path[this.pi + 240].x;
    this.tank03.y = this.path[this.pi + 240].y;
    this.tank03.rotation = this.path[this.pi + 240].angle;

    this.tank02.x = this.path[this.pi + 280].x;
    this.tank02.y = this.path[this.pi + 280].y;
    this.tank02.rotation = this.path[this.pi + 280].angle;

    this.tank01.x = this.path[this.pi + 320].x;
    this.tank01.y = this.path[this.pi + 320].y;
    this.tank01.rotation = this.path[this.pi + 320].angle;


    this.pi++;

    // if (this.pi >= this.path.length) {
    //   this.pi = 0;
    // }
  }

};

game.state.add('Game', PhaserGame.Game);

game.state.start('Boot');
