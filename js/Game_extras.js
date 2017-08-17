'use strict';

var map, road, trees, turrets, test, bmd, marker, currentTile, enemies, waveCreator, enemyWave, turretPosition, mouseDownCount, bullets;
var fireRate = 100;
var nextFire = 0;

// var Bullet = function (game, key) {
//   Phaser.Sprite.call(this, game, 0, 0, key);
//   this.checkWorldBounds = true;
//   this.outOfBoundsKill = true;
//   this.exists = false;
// };

// Bullet.prototype = Object.create(Phaser.Sprite.prototype);

// Bullet.prototype.fire = function (x, y, angle, speed) {
//   this.reset(x, y);
//   this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);
// };

// var Weapon = {};

// Weapon.SingleBullet = function (game) {
//   Phaser.Group.call(this, game, game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);
//   this.nextFire = 0;
//   this.bulletSpeed = 500;
//   this.fireRate = 100;
//   for (var i = 0; i < 64; i++) {
//     this.add(new Bullet(game, 'bullet'), true);
//   }
// };

// Weapon.SingleBullet.prototype = Object.create(Phaser.Group.prototype);

// Weapon.SingleBullet.prototype.fire = function (source) {
//   if (this.game.time.time < this.nextFire) {
//     return;
//   }
//   var x = source.x - 16;
//   var y = source.y - 16;
//   this.getFirstExists(false).fire(x, y, 90, this.bulletSpeed);
//   this.nextFire = this.game.time.time + this.fireRate;
// };

PhaserGame.Game = function (game) {
  // this.weapons = [];
};

PhaserGame.Game.prototype = {

  create: function create() {
    ///////////////////////////////////////
    //      Map and Layers Creation      //
    ///////////////////////////////////////
    this.map = this.add.tilemap('map');
    //First param :name of tileset from tiled; second: game.load.image
    this.map.addTilesetImage('terrain_atlas', 'terrain');
    this.map.addTilesetImage('turrets32', 'turrets');
    this.road = this.map.createLayer('Road');
    this.grass = this.map.createLayer('Grass');
    this.trees = this.map.createLayer('Tree bases');
    // this.turrets = this.map.createLayer('Turrets');
    ////////////////////////////////////////////////////////
    //      Enemy sprite and travel path information      //
    ////////////////////////////////////////////////////////
    this.enemies = game.add.group();
    this.enemies.enableBody = true;
    this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyWave = ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6', 'tank7', 'tank8', 'tank9'];
    for (var i = 0; i < this.enemyWave.length; i++) {
      this.enemyWave[i] = this.enemies.create(-16, 116, this.enemyWave[i]);
      this.enemyWave[i].anchor.set(0.5);
    }
    ///////////////////////////////////
    //      Bullets and Turrets      //
    ///////////////////////////////////
    // this.weapons.push(new Weapon.SingleBullet(this.game));
    // this.SHOT_DELAY = 100; // milliseconds (10 bullets/second)
    // this.BULLET_SPEED = 500; // pixels/second
    // var NUMBER_OF_BULLETS = 20;
    this.bullets = game.add.group();
    // for (var i = 0; i < NUMBER_OF_BULLETS; i++) {
    //   var bullet = this.game.add.sprite(0, 0, 'bullet');
    //   this.bullets.add(bullet);
    //   bullet.anchor.set(0.5);
    //   this.game.physics.enable(bullet, Phaser.Physics.Arcade);
    //   bullet.kill();
    // }
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(50, 'bullet');
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);
    this.guns = game.add.group();
    this.turretPosition = ['turret1', 'turret2', 'turret3', 'turret4', 'turret5', 'turret6', 'turret7', 'turret8', 'turret7', 'turret6'];
    this.turretSpots = {
      'x': [352, 800, 256, 448, 96, 320, 128, 354, 832, 864],
      'y': [32, 96, 256, 256, 320, 480, 640, 704, 384, 544]
    };
    for (var i = 0; i < this.turretPosition.length; i++) {
      this.turretPosition[i] = this.guns.create(this.turretSpots.x[i], this.turretSpots.y[i], this.turretPosition[i]);
      this.turretPosition[i].anchor.set(0.5);
    }
    ///////////////////////////////////////////////
    //      Add Bit Mad Data and Last Layer      //
    ///////////////////////////////////////////////
    this.bmd = this.add.bitmapData(game.width, game.height);
    this.bmd.addToWorld();
    this.plot();
    this.bridges = this.map.createLayer('Tree Tops and Bridges');
    //Mouse marker
    // marker = game.add.graphics();
    // marker.lineStyle(2, 0x000000, 1);
    // marker.drawRect(-32, -32, 64, 64);
    // mouseDownCount = 0;
    // currentTile = this.map.getTile(30, 0, 'Turrets');
  },

  plot: function plot() {
    ////////////////////////////////////////////////////
    //      Path plot info for the enemy sprites      //
    ////////////////////////////////////////////////////
    this.path = [];
    var ix = 0;
    var x = 1 / (game.width + (this.enemyWave.length - 1) * 100);
    this.points = {
      'x': [-466, -416, -366, -316, -266, -216, -156, -56, -16, 100, 200, 300, 400, 500, 600, 700, 740, 675, 600, 500, 400, 300, 205, 180, 190, 290, 390, 490, 590, 690, 790, 850, 860, 860, 860, 860, 860, 860, 860, 860, 860, 860],
      'y': [130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 145, 160, 180, 250, 310, 340, 350, 350, 365, 400, 475, 550, 590, 610, 623, 630, 638, 650, 720, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250]
    };
    this.pi = 0;
    for (var i = 0; i <= 1; i += x) {
      var px = this.math.catmullRomInterpolation(this.points.x, i);
      var py = this.math.catmullRomInterpolation(this.points.y, i);
      //This draws the path onto the screen to edit the path
      // this.bmd.rect(px, py, 1, 1, 'rgba(255, 255, 255, 1)');
      var node = { x: px, y: py, angle: 0 };
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
  update: function update() {
    ///////////////////////////////////////////////////
    //     This places enemy tanks into the wave     //
    ///////////////////////////////////////////////////
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
    // marker.x = this.turrets.getTileX(game.input.activePointer.worldX) * 32;
    // marker.y = this.turrets.getTileY(game.input.activePointer.worldY) * 32;
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
    for (var i = 0; i < this.turretPosition.length; i++) {
      this.turretPosition[i].rotation = game.physics.arcade.angleBetween(this.turretPosition[i], this.enemyWave[1]);
    }
    // this.weapons[0].fire(this.turretPosition[1]);
    this.fire();
  },
  fire: function fire() {
    this.bullet.reset(this.turretPosition[1].x + 16, this.turretPosition[1].y + 16);
    this.bullet.rotation = game.physics.arcade.angleBetween(this.turretPosition[1], this.enemyWave[1]);
    game.physics.arcade.moveToObject(this.bullet, this.enemyWave[1], 1200);
  }
};

game.state.add('Game', PhaserGame.Game);
game.state.start('Boot');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9qcy9HYW1lX2V4dHJhcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQztBQUN4SSxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFDbkIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0NqQixVQUFVLENBQUMsSUFBSSxHQUFHLFVBQVUsSUFBSSxFQUFFOztDQUVqQyxDQUFBOztBQUVELFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHOztBQUUxQixRQUFNLEVBQUUsa0JBQVk7Ozs7QUFJbEIsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFbkMsUUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsZUFBZSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3JELFFBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNqRCxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3pDLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0MsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQzs7Ozs7QUFLaEQsUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQ2hDLFFBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztBQUMvQixRQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUNyRCxRQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNuRyxTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDOUMsVUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3JFLFVBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNuQzs7Ozs7Ozs7QUFRRCxRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7Ozs7Ozs7O0FBUWhDLFFBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztBQUMvQixRQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUNyRCxRQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDMUMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDOUMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDN0MsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUUsQ0FBQTtBQUNySSxRQUFJLENBQUMsV0FBVyxHQUFHO0FBQ2pCLFNBQUcsRUFBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztBQUN2RCxTQUFHLEVBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7S0FDdkQsQ0FBQTtBQUNELFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNuRCxVQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoSCxVQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDeEM7Ozs7QUFJRCxRQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hELFFBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDdEIsUUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1osUUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDOzs7Ozs7O0dBTzlEOztBQUVELE1BQUksRUFBRSxnQkFBWTs7OztBQUloQixRQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNmLFFBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztBQUNYLFFBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFBLEdBQUksR0FBRyxDQUFBLEFBQUMsQ0FBQztBQUM3RCxRQUFJLENBQUMsTUFBTSxHQUFFO0FBQ1gsU0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7QUFDOU4sU0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUM7S0FDOU4sQ0FBQztBQUNGLFFBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ1osU0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQzlCLFVBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0QsVUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7O0FBRzdELFVBQUksSUFBSSxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUMsQ0FBQztBQUNwQyxVQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7QUFDVixZQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDcEU7QUFDRCxVQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNyQixRQUFFLEVBQUUsQ0FBQztLQUNOOzs7OztHQUtGO0FBQ0QsUUFBTSxFQUFFLGtCQUFXOzs7O0FBSWpCLFNBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUM5QyxVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUEsR0FBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQSxBQUFDLENBQUMsQ0FBQztBQUM5RSxVQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQy9CLFVBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDL0IsVUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztLQUMzQyxDQUFDO0FBQ0YsUUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO0FBQ1YsUUFBSSxJQUFJLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQy9CLFVBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0tBQ2I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUJELFNBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNsRCxVQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDL0c7O0FBRUQsUUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ2I7QUFDRCxNQUFJLEVBQUUsZ0JBQVk7QUFDaEIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ2hGLFFBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNsRyxRQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0dBQ3hFO0NBQ0YsQ0FBQzs7QUFFRixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDIiwiZmlsZSI6IkdhbWVfZXh0cmFzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIG1hcCwgcm9hZCwgdHJlZXMsIHR1cnJldHMsIHRlc3QsIGJtZCwgbWFya2VyLCBjdXJyZW50VGlsZSwgZW5lbWllcywgd2F2ZUNyZWF0b3IsIGVuZW15V2F2ZSwgdHVycmV0UG9zaXRpb24sIG1vdXNlRG93bkNvdW50LCBidWxsZXRzO1xudmFyIGZpcmVSYXRlID0gMTAwO1xudmFyIG5leHRGaXJlID0gMDtcblxuLy8gdmFyIEJ1bGxldCA9IGZ1bmN0aW9uIChnYW1lLCBrZXkpIHtcbi8vICAgUGhhc2VyLlNwcml0ZS5jYWxsKHRoaXMsIGdhbWUsIDAsIDAsIGtleSk7XG4vLyAgIHRoaXMuY2hlY2tXb3JsZEJvdW5kcyA9IHRydWU7XG4vLyAgIHRoaXMub3V0T2ZCb3VuZHNLaWxsID0gdHJ1ZTtcbi8vICAgdGhpcy5leGlzdHMgPSBmYWxzZTtcbi8vIH07XG5cbi8vIEJ1bGxldC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBoYXNlci5TcHJpdGUucHJvdG90eXBlKTtcblxuLy8gQnVsbGV0LnByb3RvdHlwZS5maXJlID0gZnVuY3Rpb24gKHgsIHksIGFuZ2xlLCBzcGVlZCkge1xuLy8gICB0aGlzLnJlc2V0KHgsIHkpO1xuLy8gICB0aGlzLmdhbWUucGh5c2ljcy5hcmNhZGUudmVsb2NpdHlGcm9tQW5nbGUoYW5nbGUsIHNwZWVkLCB0aGlzLmJvZHkudmVsb2NpdHkpO1xuLy8gfTtcblxuLy8gdmFyIFdlYXBvbiA9IHt9O1xuXG4vLyBXZWFwb24uU2luZ2xlQnVsbGV0ID0gZnVuY3Rpb24gKGdhbWUpIHtcbi8vICAgUGhhc2VyLkdyb3VwLmNhbGwodGhpcywgZ2FtZSwgZ2FtZS53b3JsZCwgJ1NpbmdsZSBCdWxsZXQnLCBmYWxzZSwgdHJ1ZSwgUGhhc2VyLlBoeXNpY3MuQVJDQURFKTtcbi8vICAgdGhpcy5uZXh0RmlyZSA9IDA7XG4vLyAgIHRoaXMuYnVsbGV0U3BlZWQgPSA1MDA7XG4vLyAgIHRoaXMuZmlyZVJhdGUgPSAxMDA7XG4vLyAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjQ7IGkrKykge1xuLy8gICAgIHRoaXMuYWRkKG5ldyBCdWxsZXQoZ2FtZSwgJ2J1bGxldCcpLCB0cnVlKTtcbi8vICAgfVxuLy8gfTtcblxuLy8gV2VhcG9uLlNpbmdsZUJ1bGxldC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKFBoYXNlci5Hcm91cC5wcm90b3R5cGUpO1xuXG4vLyBXZWFwb24uU2luZ2xlQnVsbGV0LnByb3RvdHlwZS5maXJlID0gZnVuY3Rpb24gKHNvdXJjZSkge1xuLy8gICBpZiAodGhpcy5nYW1lLnRpbWUudGltZSA8IHRoaXMubmV4dEZpcmUpIHtcbi8vICAgICByZXR1cm47XG4vLyAgIH1cbi8vICAgdmFyIHggPSBzb3VyY2UueCAtIDE2O1xuLy8gICB2YXIgeSA9IHNvdXJjZS55IC0gMTY7XG4vLyAgIHRoaXMuZ2V0Rmlyc3RFeGlzdHMoZmFsc2UpLmZpcmUoeCwgeSwgOTAsIHRoaXMuYnVsbGV0U3BlZWQpO1xuLy8gICB0aGlzLm5leHRGaXJlID0gdGhpcy5nYW1lLnRpbWUudGltZSArIHRoaXMuZmlyZVJhdGU7XG4vLyB9O1xuXG5QaGFzZXJHYW1lLkdhbWUgPSBmdW5jdGlvbiAoZ2FtZSkge1xuICAvLyB0aGlzLndlYXBvbnMgPSBbXTtcbn1cblxuUGhhc2VyR2FtZS5HYW1lLnByb3RvdHlwZSA9IHtcblxuICBjcmVhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyAgICAgIE1hcCBhbmQgTGF5ZXJzIENyZWF0aW9uICAgICAgLy9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICB0aGlzLm1hcCA9IHRoaXMuYWRkLnRpbGVtYXAoJ21hcCcpO1xuICAgIC8vRmlyc3QgcGFyYW0gOm5hbWUgb2YgdGlsZXNldCBmcm9tIHRpbGVkOyBzZWNvbmQ6IGdhbWUubG9hZC5pbWFnZVxuICAgIHRoaXMubWFwLmFkZFRpbGVzZXRJbWFnZSgndGVycmFpbl9hdGxhcycsICd0ZXJyYWluJyk7XG4gICAgdGhpcy5tYXAuYWRkVGlsZXNldEltYWdlKCd0dXJyZXRzMzInLCAndHVycmV0cycpO1xuICAgIHRoaXMucm9hZCA9IHRoaXMubWFwLmNyZWF0ZUxheWVyKCdSb2FkJyk7XG4gICAgdGhpcy5ncmFzcyA9IHRoaXMubWFwLmNyZWF0ZUxheWVyKCdHcmFzcycpO1xuICAgIHRoaXMudHJlZXMgPSB0aGlzLm1hcC5jcmVhdGVMYXllcignVHJlZSBiYXNlcycpO1xuICAgIC8vIHRoaXMudHVycmV0cyA9IHRoaXMubWFwLmNyZWF0ZUxheWVyKCdUdXJyZXRzJyk7XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyAgICAgIEVuZW15IHNwcml0ZSBhbmQgdHJhdmVsIHBhdGggaW5mb3JtYXRpb24gICAgICAvL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgdGhpcy5lbmVtaWVzID0gZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICB0aGlzLmVuZW1pZXMuZW5hYmxlQm9keSA9IHRydWU7XG4gICAgdGhpcy5lbmVtaWVzLnBoeXNpY3NCb2R5VHlwZSA9IFBoYXNlci5QaHlzaWNzLkFSQ0FERTtcbiAgICB0aGlzLmVuZW15V2F2ZSA9IFsndGFuazEnLCAndGFuazInLCAndGFuazMnLCAndGFuazQnLCAndGFuazUnLCAndGFuazYnLCAndGFuazcnLCAndGFuazgnLCAndGFuazknXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZW5lbXlXYXZlLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmVuZW15V2F2ZVtpXSA9IHRoaXMuZW5lbWllcy5jcmVhdGUoLTE2LCAxMTYsIHRoaXMuZW5lbXlXYXZlW2ldKTtcbiAgICAgIHRoaXMuZW5lbXlXYXZlW2ldLmFuY2hvci5zZXQoMC41KTtcbiAgICB9XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyAgICAgIEJ1bGxldHMgYW5kIFR1cnJldHMgICAgICAvL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gdGhpcy53ZWFwb25zLnB1c2gobmV3IFdlYXBvbi5TaW5nbGVCdWxsZXQodGhpcy5nYW1lKSk7XG4gICAgLy8gdGhpcy5TSE9UX0RFTEFZID0gMTAwOyAvLyBtaWxsaXNlY29uZHMgKDEwIGJ1bGxldHMvc2Vjb25kKVxuICAgIC8vIHRoaXMuQlVMTEVUX1NQRUVEID0gNTAwOyAvLyBwaXhlbHMvc2Vjb25kXG4gICAgLy8gdmFyIE5VTUJFUl9PRl9CVUxMRVRTID0gMjA7XG4gICAgdGhpcy5idWxsZXRzID0gZ2FtZS5hZGQuZ3JvdXAoKTtcbiAgICAvLyBmb3IgKHZhciBpID0gMDsgaSA8IE5VTUJFUl9PRl9CVUxMRVRTOyBpKyspIHtcbiAgICAvLyAgIHZhciBidWxsZXQgPSB0aGlzLmdhbWUuYWRkLnNwcml0ZSgwLCAwLCAnYnVsbGV0Jyk7XG4gICAgLy8gICB0aGlzLmJ1bGxldHMuYWRkKGJ1bGxldCk7XG4gICAgLy8gICBidWxsZXQuYW5jaG9yLnNldCgwLjUpO1xuICAgIC8vICAgdGhpcy5nYW1lLnBoeXNpY3MuZW5hYmxlKGJ1bGxldCwgUGhhc2VyLlBoeXNpY3MuQXJjYWRlKTtcbiAgICAvLyAgIGJ1bGxldC5raWxsKCk7XG4gICAgLy8gfVxuICAgIHRoaXMuYnVsbGV0cy5lbmFibGVCb2R5ID0gdHJ1ZTtcbiAgICB0aGlzLmJ1bGxldHMucGh5c2ljc0JvZHlUeXBlID0gUGhhc2VyLlBoeXNpY3MuQVJDQURFO1xuICAgIHRoaXMuYnVsbGV0cy5jcmVhdGVNdWx0aXBsZSg1MCwgJ2J1bGxldCcpO1xuICAgIHRoaXMuYnVsbGV0cy5zZXRBbGwoJ2NoZWNrV29ybGRCb3VuZHMnLCB0cnVlKTtcbiAgICB0aGlzLmJ1bGxldHMuc2V0QWxsKCdvdXRPZkJvdW5kc0tpbGwnLCB0cnVlKTtcbiAgICB0aGlzLmd1bnMgPSBnYW1lLmFkZC5ncm91cCgpO1xuICAgIHRoaXMudHVycmV0UG9zaXRpb24gPSBbJ3R1cnJldDEnLCAndHVycmV0MicsICd0dXJyZXQzJywgJ3R1cnJldDQnLCAndHVycmV0NScsICd0dXJyZXQ2JywgJ3R1cnJldDcnLCAndHVycmV0OCcsICd0dXJyZXQ3JywgJ3R1cnJldDYnLF1cbiAgICB0aGlzLnR1cnJldFNwb3RzID0ge1xuICAgICAgJ3gnIDogWzM1MiwgODAwLCAyNTYsIDQ0OCwgOTYsIDMyMCwgMTI4LCAzNTQsIDgzMiwgODY0XSxcbiAgICAgICd5JyA6IFszMiwgOTYsIDI1NiwgMjU2LCAzMjAsIDQ4MCwgNjQwLCA3MDQsIDM4NCwgNTQ0XVxuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudHVycmV0UG9zaXRpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMudHVycmV0UG9zaXRpb25baV0gPSB0aGlzLmd1bnMuY3JlYXRlKHRoaXMudHVycmV0U3BvdHMueFtpXSwgdGhpcy50dXJyZXRTcG90cy55W2ldLCB0aGlzLnR1cnJldFBvc2l0aW9uW2ldKTtcbiAgICAgIHRoaXMudHVycmV0UG9zaXRpb25baV0uYW5jaG9yLnNldCgwLjUpO1xuICAgIH1cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vICAgICAgQWRkIEJpdCBNYWQgRGF0YSBhbmQgTGFzdCBMYXllciAgICAgIC8vXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICB0aGlzLmJtZCA9IHRoaXMuYWRkLmJpdG1hcERhdGEoZ2FtZS53aWR0aCwgZ2FtZS5oZWlnaHQpO1xuICAgIHRoaXMuYm1kLmFkZFRvV29ybGQoKTtcbiAgICB0aGlzLnBsb3QoKTtcbiAgICB0aGlzLmJyaWRnZXMgPSB0aGlzLm1hcC5jcmVhdGVMYXllcignVHJlZSBUb3BzIGFuZCBCcmlkZ2VzJyk7XG4gICAgLy9Nb3VzZSBtYXJrZXJcbiAgICAvLyBtYXJrZXIgPSBnYW1lLmFkZC5ncmFwaGljcygpO1xuICAgIC8vIG1hcmtlci5saW5lU3R5bGUoMiwgMHgwMDAwMDAsIDEpO1xuICAgIC8vIG1hcmtlci5kcmF3UmVjdCgtMzIsIC0zMiwgNjQsIDY0KTtcbiAgICAvLyBtb3VzZURvd25Db3VudCA9IDA7XG4gICAgLy8gY3VycmVudFRpbGUgPSB0aGlzLm1hcC5nZXRUaWxlKDMwLCAwLCAnVHVycmV0cycpO1xuICB9LFxuXG4gIHBsb3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gICAgICBQYXRoIHBsb3QgaW5mbyBmb3IgdGhlIGVuZW15IHNwcml0ZXMgICAgICAvL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICB0aGlzLnBhdGggPSBbXTtcbiAgICB2YXIgaXggPSAwO1xuICAgIHZhciB4ID0gMSAvIChnYW1lLndpZHRoICsgKHRoaXMuZW5lbXlXYXZlLmxlbmd0aCAtIDEpICogMTAwKTtcbiAgICB0aGlzLnBvaW50cz0ge1xuICAgICAgJ3gnOiBbLTQ2NiwgLTQxNiwgLTM2NiwgLTMxNiwgLTI2NiwgLTIxNiwgLTE1NiwgLTU2LCAtMTYsIDEwMCwgMjAwLCAzMDAsIDQwMCwgNTAwLCA2MDAsIDcwMCwgNzQwLCA2NzUsIDYwMCwgNTAwLCA0MDAsIDMwMCwgMjA1LCAxODAsIDE5MCwgMjkwLCAzOTAsIDQ5MCwgNTkwLCA2OTAsIDc5MCwgODUwLCA4NjAsIDg2MCwgODYwLCA4NjAsIDg2MCwgODYwLCA4NjAsIDg2MCwgODYwLCA4NjBdLFxuICAgICAgJ3knOiBbMTMwLCAxMzAsIDEzMCwgMTMwLCAxMzAsIDEzMCwgMTMwLCAxMzAsIDEzMCwgMTMwLCAxMzAsIDEzMCwgMTMwLCAxNDUsIDE2MCwgMTgwLCAyNTAsIDMxMCwgMzQwLCAzNTAsIDM1MCwgMzY1LCA0MDAsIDQ3NSwgNTUwLCA1OTAsIDYxMCwgNjIzLCA2MzAsIDYzOCwgNjUwLCA3MjAsIDgwMCwgODUwLCA5MDAsIDk1MCwgMTAwMCwgMTA1MCwgMTEwMCwgMTE1MCwgMTIwMCwgMTI1MF1cbiAgICB9O1xuICAgIHRoaXMucGkgPSAwO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IDE7IGkgKz0geCkge1xuICAgICAgdmFyIHB4ID0gdGhpcy5tYXRoLmNhdG11bGxSb21JbnRlcnBvbGF0aW9uKHRoaXMucG9pbnRzLngsIGkpO1xuICAgICAgdmFyIHB5ID0gdGhpcy5tYXRoLmNhdG11bGxSb21JbnRlcnBvbGF0aW9uKHRoaXMucG9pbnRzLnksIGkpO1xuICAgICAgLy9UaGlzIGRyYXdzIHRoZSBwYXRoIG9udG8gdGhlIHNjcmVlbiB0byBlZGl0IHRoZSBwYXRoXG4gICAgICAvLyB0aGlzLmJtZC5yZWN0KHB4LCBweSwgMSwgMSwgJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMSknKTtcbiAgICAgIHZhciBub2RlID0ge3g6IHB4LCB5OiBweSwgYW5nbGU6IDB9O1xuICAgICAgaWYgKGl4ID4gMCkge1xuICAgICAgICBub2RlLmFuZ2xlID0gdGhpcy5tYXRoLmFuZ2xlQmV0d2VlblBvaW50cyh0aGlzLnBhdGhbaXggLSAxXSwgbm9kZSk7XG4gICAgICB9XG4gICAgICB0aGlzLnBhdGgucHVzaChub2RlKTtcbiAgICAgIGl4Kys7XG4gICAgfVxuICAgIC8vVGhpcyBkcmF3cyByZWN0YW5nbGVzIG9udG8gdGhlIHBhdGggd2hlcmUgdGhlIG5vZGVzIGFyZSBsb2NhdGVkXG4gICAgLy8gZm9yICh2YXIgcCA9IDA7IHAgPCB0aGlzLnBvaW50cy54Lmxlbmd0aDsgcCsrKSB7XG4gICAgLy8gICB0aGlzLmJtZC5yZWN0KHRoaXMucG9pbnRzLnhbcF0tMywgdGhpcy5wb2ludHMueVtwXS0zLCA2LCA2LCAncmdiYSgyNTUsIDAsIDAsIDEpJyk7XG4gICAgLy8gfVxuICB9LFxuICB1cGRhdGU6IGZ1bmN0aW9uICgpe1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vICAgICBUaGlzIHBsYWNlcyBlbmVteSB0YW5rcyBpbnRvIHRoZSB3YXZlICAgICAvL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbmVteVdhdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvZmZzZXQgPSB0aGlzLnBhdGhbdGhpcy5waSArICgodGhpcy5lbmVteVdhdmUubGVuZ3RoIC0gMSkgKiA0MCAtIGkgKiA0MCldO1xuICAgICAgdGhpcy5lbmVteVdhdmVbaV0ueCA9IG9mZnNldC54O1xuICAgICAgdGhpcy5lbmVteVdhdmVbaV0ueSA9IG9mZnNldC55O1xuICAgICAgdGhpcy5lbmVteVdhdmVbaV0ucm90YXRpb24gPSBvZmZzZXQuYW5nbGU7XG4gICAgfTtcbiAgICB0aGlzLnBpKys7XG4gICAgaWYgKHRoaXMucGkgPj0gdGhpcy5wYXRoLmxlbmd0aCkge1xuICAgICAgdGhpcy5waSA9IDA7XG4gICAgfVxuICAgIC8vTWFya3MgdGhlIGN1cnJlbnQgbG9jYXRpb24gb2YgdGhlIG1vdXNlXG4gICAgLy8gbWFya2VyLnggPSB0aGlzLnR1cnJldHMuZ2V0VGlsZVgoZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWCkgKiAzMjtcbiAgICAvLyBtYXJrZXIueSA9IHRoaXMudHVycmV0cy5nZXRUaWxlWShnYW1lLmlucHV0LmFjdGl2ZVBvaW50ZXIud29ybGRZKSAqIDMyO1xuICAgIC8vIGlmIChnYW1lLmlucHV0Lm1vdXNlUG9pbnRlci5pc0Rvd24pIHtcbiAgICAvLyAgIC8vIHZhciAndHVycmV0JyArIG1vdXNlRG93bkNvdW50O1xuICAgIC8vICAgLy8gdGhpcy4oJ3R1cnJldCcgKyBtb3VzZURvd25Db3VudCkgPSB0aGlzLmd1bnMuY3JlYXRlKG1hcmtlci54LCBtYXJrZXIueSwgJ3R1cnJldDEnKTtcbiAgICAvLyAgIC8vIHRoaXMuKCd0dXJyZXQnICsgbW91c2VEb3duQ291bnQpLmFuY2hvci5zZXQoMC41KTtcbiAgICAvLyAgIC8vIHRoaXMuKCd0dXJyZXQnICsgbW91c2VEb3duQ291bnQpID0gZ2FtZS5waHlzaWNzLmFyY2FkZS5hbmdsZUJldHdlZW4odGhpcy4oJ3R1cnJldCcgKyBtb3VzZURvd25Db3VudCksIHRoaXMuZW5lbXlXYXZlWzFdKTtcbiAgICAvLyAgIC8vIHRoaXMubW91c2VEb3duQ291bnQrKztcbiAgICAvLyAgIHRoaXMudHVycmV0UG9zaXRpb24gPSB0aGlzLmd1bnMuY3JlYXRlKG1hcmtlci54LCBtYXJrZXIueSwgJ3R1cnJldDEnKTtcbiAgICAvLyAgIHRoaXMudHVycmV0UG9zaXRpb24uYW5jaG9yLnNldCgwLjUpO1xuICAgIC8vICAgLy8gdGhpcy50dXJyZXRQb3NpdGlvbi5yb3RhdGlvbiA9IGdhbWUucGh5c2ljcy5hcmNhZGUuYW5nbGVCZXR3ZWVuKHRoaXMudHVycmV0UG9zaXRpb24sIHRoaXMuZW5lbXlXYXZlWzFdKTtcbiAgICAvLyB9XG4gICAgLy8gLy8gaWYgKGdhbWUuaW5wdXQubW91c2VQb2ludGVyLmlzRG93bikge1xuICAgIC8vIC8vICAgaWYgKGdhbWUuaW5wdXQua2V5Ym9hcmQuaXNEb3duKFBoYXNlci5LZXlib2FyZC5TSElGVCkpIHtcbiAgICAvLyAvLyAgICAgY3VycmVudFRpbGUgPSB0aGlzLm1hcC5nZXRUaWxlKHRoaXMudHVycmV0cy5nZXRUaWxlWChtYXJrZXIueCksIHRoaXMudHVycmV0cy5nZXRUaWxlWShtYXJrZXIueSksICdUdXJyZXRzJyk7XG4gICAgLy8gLy8gICB9IGVsc2Uge1xuICAgIC8vIC8vICAgICBpZiAodGhpcy5tYXAuZ2V0VGlsZSh0aGlzLnR1cnJldHMuZ2V0VGlsZVgobWFya2VyLngpLCB0aGlzLnR1cnJldHMuZ2V0VGlsZVkobWFya2VyLnkpKSAhPT0gY3VycmVudFRpbGUpIHtcbiAgICAvLyAvLyAgICAgICB0aGlzLm1hcC5wdXRUaWxlKGN1cnJlbnRUaWxlLCB0aGlzLnR1cnJldHMuZ2V0VGlsZVgobWFya2VyLngpLCB0aGlzLnR1cnJldHMuZ2V0VGlsZVkobWFya2VyLnkpLCAnVHVycmV0cycpO1xuICAgIC8vIC8vICAgICB9XG4gICAgLy8gLy8gICB9XG4gICAgLy8gLy8gfVxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLnR1cnJldFBvc2l0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnR1cnJldFBvc2l0aW9uW2ldLnJvdGF0aW9uID0gZ2FtZS5waHlzaWNzLmFyY2FkZS5hbmdsZUJldHdlZW4odGhpcy50dXJyZXRQb3NpdGlvbltpXSwgdGhpcy5lbmVteVdhdmVbMV0pO1xuICAgIH1cbiAgICAvLyB0aGlzLndlYXBvbnNbMF0uZmlyZSh0aGlzLnR1cnJldFBvc2l0aW9uWzFdKTtcbiAgICB0aGlzLmZpcmUoKTtcbiAgfSxcbiAgZmlyZTogZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuYnVsbGV0LnJlc2V0KHRoaXMudHVycmV0UG9zaXRpb25bMV0ueCArIDE2LCB0aGlzLnR1cnJldFBvc2l0aW9uWzFdLnkgKyAxNik7XG4gICAgdGhpcy5idWxsZXQucm90YXRpb24gPSBnYW1lLnBoeXNpY3MuYXJjYWRlLmFuZ2xlQmV0d2Vlbih0aGlzLnR1cnJldFBvc2l0aW9uWzFdLCB0aGlzLmVuZW15V2F2ZVsxXSlcbiAgICBnYW1lLnBoeXNpY3MuYXJjYWRlLm1vdmVUb09iamVjdCh0aGlzLmJ1bGxldCwgdGhpcy5lbmVteVdhdmVbMV0sIDEyMDApO1xuICB9XG59O1xuXG5nYW1lLnN0YXRlLmFkZCgnR2FtZScsIFBoYXNlckdhbWUuR2FtZSk7XG5nYW1lLnN0YXRlLnN0YXJ0KCdCb290Jyk7XG4iXX0=
