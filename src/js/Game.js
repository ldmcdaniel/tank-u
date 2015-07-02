var map, road, trees, turrets, test, bmd, marker, currentTile, enemies, waveCreator, enemyWave, turretPosition, mouseDownCount;

PhaserGame.Game = function (game) {
}

PhaserGame.Game.prototype = {

  create: function () {

    //***** Map and Layers Creation *****//
    this.map = this.add.tilemap('map');

      //First param :name of tileset from tiled; second: game.load.image
    this.map.addTilesetImage('terrain_atlas', 'terrain');
    this.map.addTilesetImage('turrets32', 'turrets');

    this.road = this.map.createLayer('Road');
    this.grass = this.map.createLayer('Grass');
    this.trees = this.map.createLayer('Tree bases');
    this.turrets = this.map.createLayer('Turrets');

    //***** Enemy sprite and travel path information *****//
    this.enemies = game.add.group();
    this.enemies.enableBody = true;
    this.enemies.enableBodyType = Phaser.Physics.ARCADE;

    this.enemyWave = ['tank01', 'tank01', 'tank01', 'tank04', 'tank04', 'tank04', 'tank07', 'tank07', 'tank07'];


    for (var i = 0; i < this.enemyWave.length; i++) {
      this.enemyWave[i] = this.enemies.create(-16, 116, this.enemyWave[i]);
      this.enemyWave[i].anchor.set(0.5);
    }

    this.guns = game.add.group();

    this.turretPosition = ['turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1',]

    this.turretSpots = {
      'x' : [352, 800, 256, 448, 96, 320, 128, 354, 832, 864],
      'y' : [32, 96, 256, 256, 320, 480, 640, 704, 384, 544]
    }

    for (var i = 0; i < this.turretPosition.length; i++) {
      this.turretPosition[i] = this.guns.create(this.turretSpots.x[i], this.turretSpots.y[i], this.turretPosition[i]);
      this.turretPosition[i].anchor.set(0.5);
    }

    this.bmd = this.add.bitmapData(game.width, game.height);
    this.bmd.addToWorld();
    this.plot();

    this.bridges = this.map.createLayer('Tree Tops and Bridges');

    //Mouse marker
    marker = game.add.graphics();
    marker.lineStyle(2, 0x000000, 1);
    marker.drawRect(-32, -32, 64, 64);
    mouseDownCount = 0;

    // currentTile = this.map.getTile(30, 0, 'Turrets');

  },

  plot: function () {

    //***** Path plot info for the enemy sprites *****//

    this.path = [];
    var ix = 0;
    var x = 1 / (game.width + (this.enemyWave.length - 1) * 100);

    this.points= {
      'x': [-466, -416, -366, -316, -266, -216, -156, -56, -16, 100, 200, 300, 400, 500, 600, 700, 740, 675, 600, 500, 400, 300, 205, 180, 190, 290, 390, 490, 590, 690, 790, 850, 860, 860, 860, 860, 860, 860, 860, 860, 860, 860],
      'y': [130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 145, 160, 180, 250, 310, 340, 350, 350, 365, 400, 475, 550, 590, 610, 623, 630, 638, 650, 720, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250]
    };

    this.pi = 0;

    for (var i = 0; i <= 1; i += x) {

      var px = this.math.catmullRomInterpolation(this.points.x, i);
      var py = this.math.catmullRomInterpolation(this.points.y, i);

      //This draws the path onto the screen to edit the path
      // this.bmd.rect(px, py, 1, 1, 'rgba(255, 255, 255, 1)');

      var node = {x: px, y: py, angle: 0};
      if (ix > 0) {
        node.angle = this.math.angleBetweenPoints(this.path[ix - 1], node);
      }
      this.path.push(node);
      ix++;

    }

    //This draws rectangles onto the path where the nodes are located
    // for (var p = 0; p < this.points.x.length; p++) {
    //   this.bmd.rect(this.points.x[p]-3, this.points.y[p]-3, 6, 6, 'rgba(255, 0, 0, 1)');
    // }

  },

  update: function (){

    //This places enemy tanks into the wave
    for (var i = 0; i < this.enemyWave.length; i++) {
      var offset = this.path[this.pi + ((this.enemyWave.length - 1) * 40 - i * 40)];
      this.enemyWave[i].x = offset.x;
      this.enemyWave[i].y = offset.y;
      this.enemyWave[i].rotation = offset.angle;
    };

    this.pi++;

    if (this.pi >= this.path.length) {
      this.pi = 0;
    }

    //Marks the current location of the mouse
    marker.x = this.turrets.getTileX(game.input.activePointer.worldX) * 32;
    marker.y = this.turrets.getTileY(game.input.activePointer.worldY) * 32;


    // if (game.input.mousePointer.isDown) {
    //   // var 'turret' + mouseDownCount;
    //   // this.('turret' + mouseDownCount) = this.guns.create(marker.x, marker.y, 'turret1');
    //   // this.('turret' + mouseDownCount).anchor.set(0.5);
    //   // this.('turret' + mouseDownCount) = game.physics.arcade.angleBetween(this.('turret' + mouseDownCount), this.enemyWave[1]);
    //   // this.mouseDownCount++;
    //   this.turretPosition = this.guns.create(marker.x, marker.y, 'turret1');
    //   this.turretPosition.anchor.set(0.5);
    //   // this.turretPosition.rotation = game.physics.arcade.angleBetween(this.turretPosition, this.enemyWave[1]);

    // }

    // // if (game.input.mousePointer.isDown) {
    // //   if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)) {
    // //     currentTile = this.map.getTile(this.turrets.getTileX(marker.x), this.turrets.getTileY(marker.y), 'Turrets');
    // //   } else {
    // //     if (this.map.getTile(this.turrets.getTileX(marker.x), this.turrets.getTileY(marker.y)) !== currentTile) {
    // //       this.map.putTile(currentTile, this.turrets.getTileX(marker.x), this.turrets.getTileY(marker.y), 'Turrets');
    // //     }
    // //   }
    // // }
    for(var i = 0; i < this.turretPosition.length; i++) {
      this.turretPosition[i].rotation = game.physics.arcade.angleBetween(this.turretPosition[i], this.enemyWave[1]);
    }

  }


};

game.state.add('Game', PhaserGame.Game);

game.state.start('Boot');
