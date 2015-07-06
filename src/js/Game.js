var map, road, trees, turrets, test, bmd, marker, currentTile, enemies, waveCreator, enemyWave, turretPosition, mouseDownCount, bullets, enemy, explosions, coins, coinPosition, score, waveNumber, startingMoney, startingWaveNumber, startingScore, backgroundMusic;
var fireRate = 300;
var nextFire0 = 0;
var nextFire1 = 0;
var nextFire2 = 0;
var nextFire3 = 0;
var nextFire4 = 0;
var nextFire5 = 0;
var nextFire6 = 0;
var nextFire7 = 0;
var nextFire8 = 0;
var nextFire9 = 0;
var money = 40;



PhaserGame.Game = function (game) {
  // this.weapons = [];
}

PhaserGame.Game.prototype = {

  create: function () {
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

    ////////////////////////////////////////////////////////
    //      Enemy sprite and travel path information      //
    ////////////////////////////////////////////////////////

    this.enemies = game.add.group();
    this.enemies.hp = 3;
    this.enemies.enableBody = true;
    this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

    this.enemyWave = ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6', 'tank7', 'tank8', 'tank9'];


    for (var i = 0; i < this.enemyWave.length; i++) {
      this.enemyWave[i] = this.enemies.create(-16, 116, this.enemyWave[i]);
      this.enemyWave[i].anchor.set(0.5);
      this.enemyWave[i].animations.add('explosion', false);
      this.enemyWave[i].health = 10;
    }

    ///////////////////////
    //      Bullets      //
    ///////////////////////

    this.bullets = game.add.group();

    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(500, 'bullet1');
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);

    ///////////////////////////////
    //     Turrets and Coins     //
    ///////////////////////////////

    this.guns = game.add.group();

    this.turretPosition = ['turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1']
    this.coinPosition = ['coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin']

    this.turretSpots = {
      'x' : [352, 800, 256, 448, 96, 320, 128, 354, 832, 864],
      'y' : [32, 96, 256, 256, 320, 480, 640, 704, 384, 544]
    }

    for (var i = 0; i < this.turretPosition.length; i++) {
      this.turretPosition[i] = this.guns.create(this.turretSpots.x[i], this.turretSpots.y[i], this.turretPosition[i]);
      this.turretPosition[i].anchor.set(0.5);
      this.coinPosition[i] = game.add.button(this.turretSpots.x[i], this.turretSpots.y[i], this.coinPosition[i], this.createTurret);
      this.coinPosition[i].anchor.set(0.5);
    }

    /////////////////////////////////
    //     Explosions and fire     //
    /////////////////////////////////

    explosions = game.add.group();
    explosions.createMultiple(20, 'explosion');
    // var exp = game.add.sprite(512, 384, 'explosion');
    // exp.animations.add('fire');
    // exp.animations.play('fire', 10, false, true);

    ///////////////////////////////////////////////
    //      Add Bit Mad Data and Last Layer      //
    ///////////////////////////////////////////////

    this.bmd = this.add.bitmapData(game.width, game.height);
    this.bmd.addToWorld();
    this.plot();

    this.bridges = this.map.createLayer('Tree Tops and Bridges');

    ////////////////////////////////////////////////////
    //     Texts for Score, Money, and Wave Count     //
    ////////////////////////////////////////////////////

    startingMoney = 40;
    startingScore = 0;
    startingWaveNumber = 1;
    score = game.add.text(820, 10, 'Score:');
    money = game.add.text(412, 10, "$ 40");
    waveNumber = game.add.text(30, 10, 'Wave 1')

    /////////////////////////////////////
    //     Music and Sound Effects     //
    /////////////////////////////////////

    this.backgroundMusic = game.add.audio('backgroundMusic', true);
    this.backgroundMusic.play();

  },

  plot: function () {
    ////////////////////////////////////////////////////
    //      Path plot info for the enemy sprites      //
    ////////////////////////////////////////////////////

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

    //////////////////////////////////////////////
    //     Places enemy tanks into the wave     //
    //////////////////////////////////////////////

    for (var i = 0; i < this.enemyWave.length; i++) {
      var offset = this.path[this.pi + ((this.enemyWave.length - 1) * 40 - i * 40)];
      this.enemyWave[i].x = offset.x;
      this.enemyWave[i].y = offset.y;
      this.enemyWave[i].rotation = offset.angle;
    };

    this.pi++;
    // if (this.pi >= this.path.length) {
    //   this.pi = 0;
    // }

    for (var i = 0; i < this.enemyWave.length; i++) {
      for (var j = 0; j < this.turretPosition.length; j++) {
        if (this.physics.arcade.distanceToXY(this.enemyWave[i], this.turretPosition[j].x, this.turretPosition[j].y) < 200 && this.enemyWave[i].alive === true) {
          this.turretPosition[j].rotation = game.physics.arcade.angleBetween(this.turretPosition[j], this.enemyWave[i]);
        }
      }
    }

    ///////////////////////////////////////
    //     Coin kill for turret fire     //
    ///////////////////////////////////////

    if (this.coinPosition[0].alive === false) {
      this.fire0();
    }
    if (this.coinPosition[1].alive === false) {
      this.fire1();
    }
    if (this.coinPosition[2].alive === false) {
      this.fire2();
    }

    if (this.coinPosition[3].alive === false) {
      this.fire3();
    }

    if (this.coinPosition[4].alive === false) {
      this.fire4();
    }

    if (this.coinPosition[5].alive === false) {
      this.fire5();
    }

    if (this.coinPosition[6].alive === false) {
      this.fire6();
    }

    if (this.coinPosition[7].alive === false) {
      this.fire7();
    }

    if (this.coinPosition[8].alive === false) {
      this.fire8();
    }

    if (this.coinPosition[9].alive === false) {
      this.fire9();
    }

    game.physics.arcade.overlap(this.bullets, this.enemies, this.collisionHandler);
  },

  createTurret: function (coin) {
    coin.kill()
  },

  collisionHandler: function (bullet, enemy) {
    bullet.kill();
    console.log(enemy.health);
    enemy.health -= 1;
    if(enemy.health <= 0) {
      enemy.kill();
      var explosion = explosions.getFirstExists(false);
      explosion.reset(enemy.body.x - 70, enemy.body.y - 70);
      explosion.play('explosion', 15, 15, false, true);
    }
  },

  fire0: function () {
    if (game.time.now > nextFire0 && this.bullets.countDead() > 0) {
      nextFire0 = game.time.now + fireRate;
      var bullet = this.bullets.getFirstDead();
      bullet.anchor.set(0.5);
      bullet.reset(this.turretPosition[0].x, this.turretPosition[0].y);
      for (var i = 0; i < this.enemyWave.length; i++) {
        if (this.physics.arcade.distanceToXY(this.enemyWave[i], this.turretPosition[0].x, this.turretPosition[0].y) < 200 && this.enemyWave[i].x > 0 && this.enemyWave[i].y < 768) {
          bullet.rotation = game.physics.arcade.angleBetween(this.turretPosition[0], this.enemyWave[i]);
          game.physics.arcade.moveToObject(bullet, this.enemyWave[i], 300)
        }
      }
    }
  },
  fire1: function () {
    if (game.time.now > nextFire1 && this.bullets.countDead() > 0) {
      nextFire1 = game.time.now + fireRate;
      var bullet = this.bullets.getFirstDead();
      bullet.anchor.set(0.5);
      bullet.reset(this.turretPosition[1].x, this.turretPosition[1].y);
      for (var i = 0; i < this.enemyWave.length; i++) {
        if (this.physics.arcade.distanceToXY(this.enemyWave[i], this.turretPosition[1].x, this.turretPosition[1].y) < 200 && this.enemyWave[i].alive === true && this.enemyWave[i].x > 0 && this.enemyWave[i].y < 768) {
          bullet.rotation = game.physics.arcade.angleBetween(this.turretPosition[1], this.enemyWave[i])
          game.physics.arcade.moveToObject(bullet, this.enemyWave[i], 300)
        }
      }
    }
  },
  fire2: function () {
    if (game.time.now > nextFire2 && this.bullets.countDead() > 0) {
      nextFire2 = game.time.now + fireRate;
      var bullet = this.bullets.getFirstDead();
      bullet.anchor.set(0.5);
      bullet.reset(this.turretPosition[2].x, this.turretPosition[2].y);
      for (var i = 0; i < this.enemyWave.length; i++) {
        if (this.physics.arcade.distanceToXY(this.enemyWave[i], this.turretPosition[2].x, this.turretPosition[2].y) < 200 && this.enemyWave[i].alive === true && this.enemyWave[i].x > 0 && this.enemyWave[i].y < 768) {
          bullet.rotation = game.physics.arcade.angleBetween(this.turretPosition[2], this.enemyWave[i])
          game.physics.arcade.moveToObject(bullet, this.enemyWave[i], 300)
        }
      }
    }
  },
  fire3: function () {
    if (game.time.now > nextFire3 && this.bullets.countDead() > 0) {
      nextFire3 = game.time.now + fireRate;
      var bullet = this.bullets.getFirstDead();
      bullet.anchor.set(0.5);
      bullet.reset(this.turretPosition[3].x, this.turretPosition[3].y);
      for (var i = 0; i < this.enemyWave.length; i++) {
        if (this.physics.arcade.distanceToXY(this.enemyWave[i], this.turretPosition[3].x, this.turretPosition[3].y) < 200 && this.enemyWave[i].alive === true && this.enemyWave[i].x > 0 && this.enemyWave[i].y < 768) {
          bullet.rotation = game.physics.arcade.angleBetween(this.turretPosition[3], this.enemyWave[i])
          game.physics.arcade.moveToObject(bullet, this.enemyWave[i], 300)
        }
      }

    }
  },
  fire4: function () {
    if (game.time.now > nextFire4 && this.bullets.countDead() > 0) {
      nextFire4 = game.time.now + fireRate;
      var bullet = this.bullets.getFirstDead();
      bullet.anchor.set(0.5);
      bullet.reset(this.turretPosition[4].x, this.turretPosition[4].y);
      for (var i = 0; i < this.enemyWave.length; i++) {
        if (this.physics.arcade.distanceToXY(this.enemyWave[i], this.turretPosition[4].x, this.turretPosition[4].y) < 200 && this.enemyWave[i].alive === true && this.enemyWave[i].x > 0 && this.enemyWave[i].y < 768) {
          bullet.rotation = game.physics.arcade.angleBetween(this.turretPosition[4], this.enemyWave[i])
          game.physics.arcade.moveToObject(bullet, this.enemyWave[i], 300)
        }
      }
    }
  },
  fire5: function () {
    if (game.time.now > nextFire5 && this.bullets.countDead() > 0) {
      nextFire5 = game.time.now + fireRate;
      var bullet = this.bullets.getFirstDead();
      bullet.anchor.set(0.5);
      bullet.reset(this.turretPosition[5].x, this.turretPosition[5].y);
      for (var i = 0; i < this.enemyWave.length; i++) {
        if (this.physics.arcade.distanceToXY(this.enemyWave[i], this.turretPosition[5].x, this.turretPosition[5].y) < 200 && this.enemyWave[i].alive === true && this.enemyWave[i].x > 0 && this.enemyWave[i].y < 768) {
          bullet.rotation = game.physics.arcade.angleBetween(this.turretPosition[5], this.enemyWave[i])
          game.physics.arcade.moveToObject(bullet, this.enemyWave[i], 300)
        }
      }
    }
  },
  fire6: function () {
    if (game.time.now > nextFire6 && this.bullets.countDead() > 0) {
      nextFire6 = game.time.now + fireRate;
      var bullet = this.bullets.getFirstDead();
      bullet.anchor.set(0.5);
      bullet.reset(this.turretPosition[6].x, this.turretPosition[6].y);
      for (var i = 0; i < this.enemyWave.length; i++) {
        if (this.physics.arcade.distanceToXY(this.enemyWave[i], this.turretPosition[6].x, this.turretPosition[6].y) < 200 && this.enemyWave[i].alive === true && this.enemyWave[i].x > 0 && this.enemyWave[i].y < 768) {
          bullet.rotation = game.physics.arcade.angleBetween(this.turretPosition[6], this.enemyWave[i])
          game.physics.arcade.moveToObject(bullet, this.enemyWave[i], 300)
        }
      }
    }
  },
  fire7: function () {
    if (game.time.now > nextFire7 && this.bullets.countDead() > 0) {
      nextFire7 = game.time.now + fireRate;
      var bullet = this.bullets.getFirstDead();
      bullet.anchor.set(0.5);
      bullet.reset(this.turretPosition[7].x, this.turretPosition[7].y);
      for (var i = 0; i < this.enemyWave.length; i++) {
        if (this.physics.arcade.distanceToXY(this.enemyWave[i], this.turretPosition[7].x, this.turretPosition[7].y) < 200 && this.enemyWave[i].alive === true && this.enemyWave[i].x > 0 && this.enemyWave[i].y < 768) {
          bullet.rotation = game.physics.arcade.angleBetween(this.turretPosition[7], this.enemyWave[i])
          game.physics.arcade.moveToObject(bullet, this.enemyWave[i], 300)
        }
      }
    }
  },
  fire8: function () {
    if (game.time.now > nextFire8 && this.bullets.countDead() > 0) {
      nextFire8 = game.time.now + fireRate;
      var bullet = this.bullets.getFirstDead();
      bullet.anchor.set(0.5);
      bullet.reset(this.turretPosition[8].x, this.turretPosition[8].y);
      for (var i = 0; i < this.enemyWave.length; i++) {
        if (this.physics.arcade.distanceToXY(this.enemyWave[i], this.turretPosition[8].x, this.turretPosition[8].y) < 200 && this.enemyWave[i].alive === true && this.enemyWave[i].x > 0 && this.enemyWave[i].y < 768) {
          bullet.rotation = game.physics.arcade.angleBetween(this.turretPosition[8], this.enemyWave[i])
          game.physics.arcade.moveToObject(bullet, this.enemyWave[i], 300)
        }
      }
    }
  },
  fire9: function () {
    if (game.time.now > nextFire9 && this.bullets.countDead() > 0) {
      nextFire9 = game.time.now + fireRate;
      var bullet = this.bullets.getFirstDead();
      bullet.anchor.set(0.5);
      bullet.reset(this.turretPosition[9].x, this.turretPosition[9].y);
      for (var i = 0; i < this.enemyWave.length; i++) {
        if (this.physics.arcade.distanceToXY(this.enemyWave[i], this.turretPosition[9].x, this.turretPosition[9].y) < 200 && this.enemyWave[i].alive === true && this.enemyWave[i].x > 0 && this.enemyWave[i].y < 768) {
          bullet.rotation = game.physics.arcade.angleBetween(this.turretPosition[9], this.enemyWave[i])
          game.physics.arcade.moveToObject(bullet, this.enemyWave[i], 300)
        }
      }
    }
  },
  render: function () {

    // game.debug.text('Active Bullets: ' + this.bullets.countLiving() + ' / ' + this.bullets.countDead() + ' / ' + this.bullets.total, 32, 32);
    // game.debug.text(game.time.now + ' / ' + nextFire, 32, 64)

  }

};

game.state.add('Game', PhaserGame.Game);

game.state.start('Boot');
