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

PhaserGame.Game = function (game) {};

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

// this.weapons = [];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9qcy9HYW1lX2V4dHJhcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQztBQUN4SSxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFDbkIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0NqQixVQUFVLENBQUMsSUFBSSxHQUFHLFVBQVUsSUFBSSxFQUFFLEVBRWpDLENBQUE7O0FBRUQsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUc7O0FBRTFCLFFBQU0sRUFBRSxrQkFBWTs7Ozs7QUFLbEIsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7O0FBR25DLFFBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRCxRQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7O0FBRWpELFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDekMsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMzQyxRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDOzs7Ozs7O0FBT2hELFFBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FB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Qzs7Ozs7O0FBTUQsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN4RCxRQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFWixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLHVCQUF1QixDQUFDLENBQUM7Ozs7Ozs7OztHQVU5RDs7QUFFRCxNQUFJLEVBQUUsZ0JBQVk7Ozs7O0FBS2hCLFFBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2YsUUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ1gsUUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUEsR0FBSSxHQUFHLENBQUEsQUFBQyxDQUFDOztBQUU3RCxRQUFJLENBQUMsTUFBTSxHQUFFO0FBQ1gsU0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7QUFDOU4sU0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUM7S0FDOU4sQ0FBQzs7QUFFRixRQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFWixTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUU7O0FBRTlCLFVBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDN0QsVUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQzs7Ozs7QUFLN0QsVUFBSSxJQUFJLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFF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S0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDIiwiZmlsZSI6InNyYy9qcy9HYW1lX2V4dHJhcy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBtYXAsIHJvYWQsIHRyZWVzLCB0dXJyZXRzLCB0ZXN0LCBibWQsIG1hcmtlciwgY3VycmVudFRpbGUsIGVuZW1pZXMsIHdhdmVDcmVhdG9yLCBlbmVteVdhdmUsIHR1cnJldFBvc2l0aW9uLCBtb3VzZURvd25Db3VudCwgYnVsbGV0cztcbnZhciBmaXJlUmF0ZSA9IDEwMDtcbnZhciBuZXh0RmlyZSA9IDA7XG5cbi8vIHZhciBCdWxsZXQgPSBmdW5jdGlvbiAoZ2FtZSwga2V5KSB7XG4vLyAgIFBoYXNlci5TcHJpdGUuY2FsbCh0aGlzLCBnYW1lLCAwLCAwLCBrZXkpO1xuLy8gICB0aGlzLmNoZWNrV29ybGRCb3VuZHMgPSB0cnVlO1xuLy8gICB0aGlzLm91dE9mQm91bmRzS2lsbCA9IHRydWU7XG4vLyAgIHRoaXMuZXhpc3RzID0gZmFsc2U7XG4vLyB9O1xuXG4vLyBCdWxsZXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQaGFzZXIuU3ByaXRlLnByb3RvdHlwZSk7XG5cbi8vIEJ1bGxldC5wcm90b3R5cGUuZmlyZSA9IGZ1bmN0aW9uICh4LCB5LCBhbmdsZSwgc3BlZWQpIHtcbi8vICAgdGhpcy5yZXNldCh4LCB5KTtcbi8vICAgdGhpcy5nYW1lLnBoeXNpY3MuYXJjYWRlLnZlbG9jaXR5RnJvbUFuZ2xlKGFuZ2xlLCBzcGVlZCwgdGhpcy5ib2R5LnZlbG9jaXR5KTtcbi8vIH07XG5cbi8vIHZhciBXZWFwb24gPSB7fTtcblxuLy8gV2VhcG9uLlNpbmdsZUJ1bGxldCA9IGZ1bmN0aW9uIChnYW1lKSB7XG4vLyAgIFBoYXNlci5Hcm91cC5jYWxsKHRoaXMsIGdhbWUsIGdhbWUud29ybGQsICdTaW5nbGUgQnVsbGV0JywgZmFsc2UsIHRydWUsIFBoYXNlci5QaHlzaWNzLkFSQ0FERSk7XG4vLyAgIHRoaXMubmV4dEZpcmUgPSAwO1xuLy8gICB0aGlzLmJ1bGxldFNwZWVkID0gNTAwO1xuLy8gICB0aGlzLmZpcmVSYXRlID0gMTAwO1xuLy8gICBmb3IgKHZhciBpID0gMDsgaSA8IDY0OyBpKyspIHtcbi8vICAgICB0aGlzLmFkZChuZXcgQnVsbGV0KGdhbWUsICdidWxsZXQnKSwgdHJ1ZSk7XG4vLyAgIH1cbi8vIH07XG5cbi8vIFdlYXBvbi5TaW5nbGVCdWxsZXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShQaGFzZXIuR3JvdXAucHJvdG90eXBlKTtcblxuLy8gV2VhcG9uLlNpbmdsZUJ1bGxldC5wcm90b3R5cGUuZmlyZSA9IGZ1bmN0aW9uIChzb3VyY2UpIHtcbi8vICAgaWYgKHRoaXMuZ2FtZS50aW1lLnRpbWUgPCB0aGlzLm5leHRGaXJlKSB7XG4vLyAgICAgcmV0dXJuO1xuLy8gICB9XG4vLyAgIHZhciB4ID0gc291cmNlLnggLSAxNjtcbi8vICAgdmFyIHkgPSBzb3VyY2UueSAtIDE2O1xuLy8gICB0aGlzLmdldEZpcnN0RXhpc3RzKGZhbHNlKS5maXJlKHgsIHksIDkwLCB0aGlzLmJ1bGxldFNwZWVkKTtcbi8vICAgdGhpcy5uZXh0RmlyZSA9IHRoaXMuZ2FtZS50aW1lLnRpbWUgKyB0aGlzLmZpcmVSYXRlO1xuLy8gfTtcblxuUGhhc2VyR2FtZS5HYW1lID0gZnVuY3Rpb24gKGdhbWUpIHtcbiAgLy8gdGhpcy53ZWFwb25zID0gW107XG59XG5cblBoYXNlckdhbWUuR2FtZS5wcm90b3R5cGUgPSB7XG5cbiAgY3JlYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gICAgICBNYXAgYW5kIExheWVycyBDcmVhdGlvbiAgICAgIC8vXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICB0aGlzLm1hcCA9IHRoaXMuYWRkLnRpbGVtYXAoJ21hcCcpO1xuXG4gICAgICAvL0ZpcnN0IHBhcmFtIDpuYW1lIG9mIHRpbGVzZXQgZnJvbSB0aWxlZDsgc2Vjb25kOiBnYW1lLmxvYWQuaW1hZ2VcbiAgICB0aGlzLm1hcC5hZGRUaWxlc2V0SW1hZ2UoJ3RlcnJhaW5fYXRsYXMnLCAndGVycmFpbicpO1xuICAgIHRoaXMubWFwLmFkZFRpbGVzZXRJbWFnZSgndHVycmV0czMyJywgJ3R1cnJldHMnKTtcblxuICAgIHRoaXMucm9hZCA9IHRoaXMubWFwLmNyZWF0ZUxheWVyKCdSb2FkJyk7XG4gICAgdGhpcy5ncmFzcyA9IHRoaXMubWFwLmNyZWF0ZUxheWVyKCdHcmFzcycpO1xuICAgIHRoaXMudHJlZXMgPSB0aGlzLm1hcC5jcmVhdGVMYXllcignVHJlZSBiYXNlcycpO1xuICAgIC8vIHRoaXMudHVycmV0cyA9IHRoaXMubWFwLmNyZWF0ZUxheWVyKCdUdXJyZXRzJyk7XG5cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICAgIC8vICAgICAgRW5lbXkgc3ByaXRlIGFuZCB0cmF2ZWwgcGF0aCBpbmZvcm1hdGlvbiAgICAgIC8vXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIHRoaXMuZW5lbWllcyA9IGdhbWUuYWRkLmdyb3VwKCk7XG4gICAgdGhpcy5lbmVtaWVzLmVuYWJsZUJvZHkgPSB0cnVlO1xuICAgIHRoaXMuZW5lbWllcy5waHlzaWNzQm9keVR5cGUgPSBQaGFzZXIuUGh5c2ljcy5BUkNBREU7XG5cbiAgICB0aGlzLmVuZW15V2F2ZSA9IFsndGFuazEnLCAndGFuazInLCAndGFuazMnLCAndGFuazQnLCAndGFuazUnLCAndGFuazYnLCAndGFuazcnLCAndGFuazgnLCAndGFuazknXTtcblxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmVuZW15V2F2ZS5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5lbmVteVdhdmVbaV0gPSB0aGlzLmVuZW1pZXMuY3JlYXRlKC0xNiwgMTE2LCB0aGlzLmVuZW15V2F2ZVtpXSk7XG4gICAgICB0aGlzLmVuZW15V2F2ZVtpXS5hbmNob3Iuc2V0KDAuNSk7XG4gICAgfVxuXG4gICAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyAgICAgIEJ1bGxldHMgYW5kIFR1cnJldHMgICAgICAvL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgICAvLyB0aGlzLndlYXBvbnMucHVzaChuZXcgV2VhcG9uLlNpbmdsZUJ1bGxldCh0aGlzLmdhbWUpKTtcblxuICAgIC8vIHRoaXMuU0hPVF9ERUxBWSA9IDEwMDsgLy8gbWlsbGlzZWNvbmRzICgxMCBidWxsZXRzL3NlY29uZClcbiAgICAvLyB0aGlzLkJVTExFVF9TUEVFRCA9IDUwMDsgLy8gcGl4ZWxzL3NlY29uZFxuICAgIC8vIHZhciBOVU1CRVJfT0ZfQlVMTEVUUyA9IDIwO1xuXG4gICAgdGhpcy5idWxsZXRzID0gZ2FtZS5hZGQuZ3JvdXAoKTtcblxuICAgIC8vIGZvciAodmFyIGkgPSAwOyBpIDwgTlVNQkVSX09GX0JVTExFVFM7IGkrKykge1xuICAgIC8vICAgdmFyIGJ1bGxldCA9IHRoaXMuZ2FtZS5hZGQuc3ByaXRlKDAsIDAsICdidWxsZXQnKTtcblxuICAgIC8vICAgdGhpcy5idWxsZXRzLmFkZChidWxsZXQpO1xuICAgIC8vICAgYnVsbGV0LmFuY2hvci5zZXQoMC41KTtcblxuICAgIC8vICAgdGhpcy5nYW1lLnBoeXNpY3MuZW5hYmxlKGJ1bGxldCwgUGhhc2VyLlBoeXNpY3MuQXJjYWRlKTtcblxuICAgIC8vICAgYnVsbGV0LmtpbGwoKTtcblxuICAgIC8vIH1cblxuICAgIHRoaXMuYnVsbGV0cy5lbmFibGVCb2R5ID0gdHJ1ZTtcbiAgICB0aGlzLmJ1bGxldHMucGh5c2ljc0JvZHlUeXBlID0gUGhhc2VyLlBoeXNpY3MuQVJDQURFO1xuICAgIHRoaXMuYnVsbGV0cy5jcmVhdGVNdWx0aXBsZSg1MCwgJ2J1bGxldCcpO1xuICAgIHRoaXMuYnVsbGV0cy5zZXRBbGwoJ2NoZWNrV29ybGRCb3VuZHMnLCB0cnVlKTtcbiAgICB0aGlzLmJ1bGxldHMuc2V0QWxsKCdvdXRPZkJvdW5kc0tpbGwnLCB0cnVlKTtcblxuXG5cbiAgICB0aGlzLmd1bnMgPSBnYW1lLmFkZC5ncm91cCgpO1xuXG4gICAgdGhpcy50dXJyZXRQb3NpdGlvbiA9IFsndHVycmV0MScsICd0dXJyZXQyJywgJ3R1cnJldDMnLCAndHVycmV0NCcsICd0dXJyZXQ1JywgJ3R1cnJldDYnLCAndHVycmV0NycsICd0dXJyZXQ4JywgJ3R1cnJldDcnLCAndHVycmV0NicsXVxuXG4gICAgdGhpcy50dXJyZXRTcG90cyA9IHtcbiAgICAgICd4JyA6IFszNTIsIDgwMCwgMjU2LCA0NDgsIDk2LCAzMjAsIDEyOCwgMzU0LCA4MzIsIDg2NF0sXG4gICAgICAneScgOiBbMzIsIDk2LCAyNTYsIDI1NiwgMzIwLCA0ODAsIDY0MCwgNzA0LCAzODQsIDU0NF1cbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudHVycmV0UG9zaXRpb24ubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMudHVycmV0UG9zaXRpb25baV0gPSB0aGlzLmd1bnMuY3JlYXRlKHRoaXMudHVycmV0U3BvdHMueFtpXSwgdGhpcy50dXJyZXRTcG90cy55W2ldLCB0aGlzLnR1cnJldFBvc2l0aW9uW2ldKTtcbiAgICAgIHRoaXMudHVycmV0UG9zaXRpb25baV0uYW5jaG9yLnNldCgwLjUpO1xuICAgIH1cblxuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gICAgICBBZGQgQml0IE1hZCBEYXRhIGFuZCBMYXN0IExheWVyICAgICAgLy9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuXG4gICAgdGhpcy5ibWQgPSB0aGlzLmFkZC5iaXRtYXBEYXRhKGdhbWUud2lkdGgsIGdhbWUuaGVpZ2h0KTtcbiAgICB0aGlzLmJtZC5hZGRUb1dvcmxkKCk7XG4gICAgdGhpcy5wbG90KCk7XG5cbiAgICB0aGlzLmJyaWRnZXMgPSB0aGlzLm1hcC5jcmVhdGVMYXllcignVHJlZSBUb3BzIGFuZCBCcmlkZ2VzJyk7XG5cbiAgICAvL01vdXNlIG1hcmtlclxuICAgIC8vIG1hcmtlciA9IGdhbWUuYWRkLmdyYXBoaWNzKCk7XG4gICAgLy8gbWFya2VyLmxpbmVTdHlsZSgyLCAweDAwMDAwMCwgMSk7XG4gICAgLy8gbWFya2VyLmRyYXdSZWN0KC0zMiwgLTMyLCA2NCwgNjQpO1xuICAgIC8vIG1vdXNlRG93bkNvdW50ID0gMDtcblxuICAgIC8vIGN1cnJlbnRUaWxlID0gdGhpcy5tYXAuZ2V0VGlsZSgzMCwgMCwgJ1R1cnJldHMnKTtcblxuICB9LFxuXG4gIHBsb3Q6IGZ1bmN0aW9uICgpIHtcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gICAgLy8gICAgICBQYXRoIHBsb3QgaW5mbyBmb3IgdGhlIGVuZW15IHNwcml0ZXMgICAgICAvL1xuICAgIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIHRoaXMucGF0aCA9IFtdO1xuICAgIHZhciBpeCA9IDA7XG4gICAgdmFyIHggPSAxIC8gKGdhbWUud2lkdGggKyAodGhpcy5lbmVteVdhdmUubGVuZ3RoIC0gMSkgKiAxMDApO1xuXG4gICAgdGhpcy5wb2ludHM9IHtcbiAgICAgICd4JzogWy00NjYsIC00MTYsIC0zNjYsIC0zMTYsIC0yNjYsIC0yMTYsIC0xNTYsIC01NiwgLTE2LCAxMDAsIDIwMCwgMzAwLCA0MDAsIDUwMCwgNjAwLCA3MDAsIDc0MCwgNjc1LCA2MDAsIDUwMCwgNDAwLCAzMDAsIDIwNSwgMTgwLCAxOTAsIDI5MCwgMzkwLCA0OTAsIDU5MCwgNjkwLCA3OTAsIDg1MCwgODYwLCA4NjAsIDg2MCwgODYwLCA4NjAsIDg2MCwgODYwLCA4NjAsIDg2MCwgODYwXSxcbiAgICAgICd5JzogWzEzMCwgMTMwLCAxMzAsIDEzMCwgMTMwLCAxMzAsIDEzMCwgMTMwLCAxMzAsIDEzMCwgMTMwLCAxMzAsIDEzMCwgMTQ1LCAxNjAsIDE4MCwgMjUwLCAzMTAsIDM0MCwgMzUwLCAzNTAsIDM2NSwgNDAwLCA0NzUsIDU1MCwgNTkwLCA2MTAsIDYyMywgNjMwLCA2MzgsIDY1MCwgNzIwLCA4MDAsIDg1MCwgOTAwLCA5NTAsIDEwMDAsIDEwNTAsIDExMDAsIDExNTAsIDEyMDAsIDEyNTBdXG4gICAgfTtcblxuICAgIHRoaXMucGkgPSAwO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gMTsgaSArPSB4KSB7XG5cbiAgICAgIHZhciBweCA9IHRoaXMubWF0aC5jYXRtdWxsUm9tSW50ZXJwb2xhdGlvbih0aGlzLnBvaW50cy54LCBpKTtcbiAgICAgIHZhciBweSA9IHRoaXMubWF0aC5jYXRtdWxsUm9tSW50ZXJwb2xhdGlvbih0aGlzLnBvaW50cy55LCBpKTtcblxuICAgICAgLy9UaGlzIGRyYXdzIHRoZSBwYXRoIG9udG8gdGhlIHNjcmVlbiB0byBlZGl0IHRoZSBwYXRoXG4gICAgICAvLyB0aGlzLmJtZC5yZWN0KHB4LCBweSwgMSwgMSwgJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMSknKTtcblxuICAgICAgdmFyIG5vZGUgPSB7eDogcHgsIHk6IHB5LCBhbmdsZTogMH07XG4gICAgICBpZiAoaXggPiAwKSB7XG4gICAgICAgIG5vZGUuYW5nbGUgPSB0aGlzLm1hdGguYW5nbGVCZXR3ZWVuUG9pbnRzKHRoaXMucGF0aFtpeCAtIDFdLCBub2RlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucGF0aC5wdXNoKG5vZGUpO1xuICAgICAgaXgrKztcblxuICAgIH1cblxuICAgIC8vVGhpcyBkcmF3cyByZWN0YW5nbGVzIG9udG8gdGhlIHBhdGggd2hlcmUgdGhlIG5vZGVzIGFyZSBsb2NhdGVkXG4gICAgLy8gZm9yICh2YXIgcCA9IDA7IHAgPCB0aGlzLnBvaW50cy54Lmxlbmd0aDsgcCsrKSB7XG4gICAgLy8gICB0aGlzLmJtZC5yZWN0KHRoaXMucG9pbnRzLnhbcF0tMywgdGhpcy5wb2ludHMueVtwXS0zLCA2LCA2LCAncmdiYSgyNTUsIDAsIDAsIDEpJyk7XG4gICAgLy8gfVxuXG4gIH0sXG5cbiAgdXBkYXRlOiBmdW5jdGlvbiAoKXtcbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgICAvLyAgICAgVGhpcyBwbGFjZXMgZW5lbXkgdGFua3MgaW50byB0aGUgd2F2ZSAgICAgLy9cbiAgICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5lbmVteVdhdmUubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvZmZzZXQgPSB0aGlzLnBhdGhbdGhpcy5waSArICgodGhpcy5lbmVteVdhdmUubGVuZ3RoIC0gMSkgKiA0MCAtIGkgKiA0MCldO1xuICAgICAgdGhpcy5lbmVteVdhdmVbaV0ueCA9IG9mZnNldC54O1xuICAgICAgdGhpcy5lbmVteVdhdmVbaV0ueSA9IG9mZnNldC55O1xuICAgICAgdGhpcy5lbmVteVdhdmVbaV0ucm90YXRpb24gPSBvZmZzZXQuYW5nbGU7XG4gICAgfTtcblxuICAgIHRoaXMucGkrKztcbiAgICBpZiAodGhpcy5waSA+PSB0aGlzLnBhdGgubGVuZ3RoKSB7XG4gICAgICB0aGlzLnBpID0gMDtcbiAgICB9XG5cbiAgICAvL01hcmtzIHRoZSBjdXJyZW50IGxvY2F0aW9uIG9mIHRoZSBtb3VzZVxuICAgIC8vIG1hcmtlci54ID0gdGhpcy50dXJyZXRzLmdldFRpbGVYKGdhbWUuaW5wdXQuYWN0aXZlUG9pbnRlci53b3JsZFgpICogMzI7XG4gICAgLy8gbWFya2VyLnkgPSB0aGlzLnR1cnJldHMuZ2V0VGlsZVkoZ2FtZS5pbnB1dC5hY3RpdmVQb2ludGVyLndvcmxkWSkgKiAzMjtcblxuXG4gICAgLy8gaWYgKGdhbWUuaW5wdXQubW91c2VQb2ludGVyLmlzRG93bikge1xuICAgIC8vICAgLy8gdmFyICd0dXJyZXQnICsgbW91c2VEb3duQ291bnQ7XG4gICAgLy8gICAvLyB0aGlzLigndHVycmV0JyArIG1vdXNlRG93bkNvdW50KSA9IHRoaXMuZ3Vucy5jcmVhdGUobWFya2VyLngsIG1hcmtlci55LCAndHVycmV0MScpO1xuICAgIC8vICAgLy8gdGhpcy4oJ3R1cnJldCcgKyBtb3VzZURvd25Db3VudCkuYW5jaG9yLnNldCgwLjUpO1xuICAgIC8vICAgLy8gdGhpcy4oJ3R1cnJldCcgKyBtb3VzZURvd25Db3VudCkgPSBnYW1lLnBoeXNpY3MuYXJjYWRlLmFuZ2xlQmV0d2Vlbih0aGlzLigndHVycmV0JyArIG1vdXNlRG93bkNvdW50KSwgdGhpcy5lbmVteVdhdmVbMV0pO1xuICAgIC8vICAgLy8gdGhpcy5tb3VzZURvd25Db3VudCsrO1xuICAgIC8vICAgdGhpcy50dXJyZXRQb3NpdGlvbiA9IHRoaXMuZ3Vucy5jcmVhdGUobWFya2VyLngsIG1hcmtlci55LCAndHVycmV0MScpO1xuICAgIC8vICAgdGhpcy50dXJyZXRQb3NpdGlvbi5hbmNob3Iuc2V0KDAuNSk7XG4gICAgLy8gICAvLyB0aGlzLnR1cnJldFBvc2l0aW9uLnJvdGF0aW9uID0gZ2FtZS5waHlzaWNzLmFyY2FkZS5hbmdsZUJldHdlZW4odGhpcy50dXJyZXRQb3NpdGlvbiwgdGhpcy5lbmVteVdhdmVbMV0pO1xuXG4gICAgLy8gfVxuXG4gICAgLy8gLy8gaWYgKGdhbWUuaW5wdXQubW91c2VQb2ludGVyLmlzRG93bikge1xuICAgIC8vIC8vICAgaWYgKGdhbWUuaW5wdXQua2V5Ym9hcmQuaXNEb3duKFBoYXNlci5LZXlib2FyZC5TSElGVCkpIHtcbiAgICAvLyAvLyAgICAgY3VycmVudFRpbGUgPSB0aGlzLm1hcC5nZXRUaWxlKHRoaXMudHVycmV0cy5nZXRUaWxlWChtYXJrZXIueCksIHRoaXMudHVycmV0cy5nZXRUaWxlWShtYXJrZXIueSksICdUdXJyZXRzJyk7XG4gICAgLy8gLy8gICB9IGVsc2Uge1xuICAgIC8vIC8vICAgICBpZiAodGhpcy5tYXAuZ2V0VGlsZSh0aGlzLnR1cnJldHMuZ2V0VGlsZVgobWFya2VyLngpLCB0aGlzLnR1cnJldHMuZ2V0VGlsZVkobWFya2VyLnkpKSAhPT0gY3VycmVudFRpbGUpIHtcbiAgICAvLyAvLyAgICAgICB0aGlzLm1hcC5wdXRUaWxlKGN1cnJlbnRUaWxlLCB0aGlzLnR1cnJldHMuZ2V0VGlsZVgobWFya2VyLngpLCB0aGlzLnR1cnJldHMuZ2V0VGlsZVkobWFya2VyLnkpLCAnVHVycmV0cycpO1xuICAgIC8vIC8vICAgICB9XG4gICAgLy8gLy8gICB9XG4gICAgLy8gLy8gfVxuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLnR1cnJldFBvc2l0aW9uLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLnR1cnJldFBvc2l0aW9uW2ldLnJvdGF0aW9uID0gZ2FtZS5waHlzaWNzLmFyY2FkZS5hbmdsZUJldHdlZW4odGhpcy50dXJyZXRQb3NpdGlvbltpXSwgdGhpcy5lbmVteVdhdmVbMV0pO1xuXG4gICAgfVxuICAgIC8vIHRoaXMud2VhcG9uc1swXS5maXJlKHRoaXMudHVycmV0UG9zaXRpb25bMV0pO1xuICAgIHRoaXMuZmlyZSgpO1xuICB9LFxuXG4gIGZpcmU6IGZ1bmN0aW9uICgpIHtcblxuICAgIHRoaXMuYnVsbGV0LnJlc2V0KHRoaXMudHVycmV0UG9zaXRpb25bMV0ueCArIDE2LCB0aGlzLnR1cnJldFBvc2l0aW9uWzFdLnkgKyAxNik7XG4gICAgdGhpcy5idWxsZXQucm90YXRpb24gPSBnYW1lLnBoeXNpY3MuYXJjYWRlLmFuZ2xlQmV0d2Vlbih0aGlzLnR1cnJldFBvc2l0aW9uWzFdLCB0aGlzLmVuZW15V2F2ZVsxXSlcbiAgICBnYW1lLnBoeXNpY3MuYXJjYWRlLm1vdmVUb09iamVjdCh0aGlzLmJ1bGxldCwgdGhpcy5lbmVteVdhdmVbMV0sIDEyMDApO1xuICB9XG5cblxufTtcblxuZ2FtZS5zdGF0ZS5hZGQoJ0dhbWUnLCBQaGFzZXJHYW1lLkdhbWUpO1xuXG5nYW1lLnN0YXRlLnN0YXJ0KCdCb290Jyk7XG4iXX0=
