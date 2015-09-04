var explosions, score, waveNumber, startingMoney, startingWaveNumber, startingScore;

var fireRate = 300;
var nextFire = [];
for(var i = 0; i < 10; i++) {
  nextFire[i] = 0;
}
var money = 40;

PhaserGame.Game = function (game) {
  // this.weapons = [];
}

PhaserGame.Game.prototype = {
  create: function () {
    var $ = this;

    ///////////////////////////////////////
    //      Map and Layers Creation      //
    ///////////////////////////////////////

    var map = this.add.tilemap('map');

      //First param :name of tileset from tiled; second: game.load.image
    map.addTilesetImage('terrain_atlas', 'terrain');
    map.addTilesetImage('turrets32', 'turrets');

    $.road = map.createLayer('Road');
    $.grass = map.createLayer('Grass');
    $.trees = map.createLayer('Tree bases');

    ////////////////////////////////////////////////////////
    //      Enemy sprite and travel path information      //
    ////////////////////////////////////////////////////////

    $.enemies = game.add.group();
    $.enemies.hp = 3;
    $.enemies.enableBody = true;
    $.enemies.physicsBodyType = Phaser.Physics.ARCADE;

    $.enemyWave = ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6', 'tank7', 'tank8', 'tank9'];


    for (var i = 0; i < $.enemyWave.length; i++) {
      $.enemyWave[i] = $.enemies.create(-16, 116, $.enemyWave[i]);
      $.enemyWave[i].anchor.set(0.5);
      $.enemyWave[i].animations.add('explosion', false);
      $.enemyWave[i].health = 10;
    }

    ///////////////////////
    //      Bullets      //
    ///////////////////////

    $.bullets = game.add.group();

    $.bullets.enableBody = true;
    $.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    $.bullets.createMultiple(500, 'bullet1');
    $.bullets.setAll('checkWorldBounds', true);
    $.bullets.setAll('outOfBoundsKill', true);

    ///////////////////////////////
    //     Turrets and Coins     //
    ///////////////////////////////

    $.guns = game.add.group();

    $.turretPosition = ['turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1']
    $.coinPosition = ['coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin']


    $.turretSpots = {
      'x' : [352, 800, 256, 448, 96, 320, 128, 354, 832, 864],
      'y' : [32, 96, 256, 256, 320, 480, 640, 704, 384, 544]
    }

    for (var i = 0; i < this.turretPosition.length; i++) {
      $.turretPosition[i] = $.guns.create($.turretSpots.x[i], $.turretSpots.y[i], $.turretPosition[i]);
      $.turretPosition[i].anchor.set(0.5);
      $.coinPosition[i] = game.add.button($.turretSpots.x[i], $.turretSpots.y[i], $.coinPosition[i], $.createTurret);
      $.coinPosition[i].anchor.set(0.5);
    }

    /////////////////////////////////
    //     Explosions and fire     //
    /////////////////////////////////

    explosions = game.add.group();
    explosions.createMultiple(20, 'explosion');

    ///////////////////////////////////////////////
    //      Add Bit Mad Data and Last Layer      //
    ///////////////////////////////////////////////

    $.bmd = $.add.bitmapData(game.width, game.height);
    $.bmd.addToWorld();
    $.plot();

    $.bridges = map.createLayer('Tree Tops and Bridges');

    ////////////////////////////////////////////////////
    //     Texts for Score, Money, and Wave Count     //
    ////////////////////////////////////////////////////

    startingMoney = 40;
    startingScore = 0;
    startingWaveNumber = 1;
    score = game.add.text(820, 10, 'Score:');
    money = game.add.text(412, 10, "$ 40");
    waveNumber = game.add.text(30, 10, 'Wave 1');

    /////////////////////////////////////
    //     Music and Sound Effects     //
    /////////////////////////////////////

    $.backgroundMusic = game.add.audio('backgroundMusic', true);
    $.backgroundMusic.play();
  },

  plot: function () {
    var $ = this;

    ////////////////////////////////////////////////////
    //      Path plot info for the enemy sprites      //
    ////////////////////////////////////////////////////

    $.path = [];
    var ix = 0;
    var x = 1 / (game.width + ($.enemyWave.length - 1) * 100);

    $.points= {
      'x': [-466, -416, -366, -316, -266, -216, -156, -56, -16, 100, 200, 300, 400, 500, 600, 700, 740, 675, 600, 500, 400, 300, 205, 180, 190, 290, 390, 490, 590, 690, 790, 850, 860, 860, 860, 860, 860, 860, 860, 860, 860, 860],
      'y': [130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 145, 160, 180, 250, 310, 340, 350, 350, 365, 400, 475, 550, 590, 610, 623, 630, 638, 650, 720, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250]
    };

    $.pi = 0;

    for (var i = 0; i <= 1; i += x) {

      var px = $.math.catmullRomInterpolation($.points.x, i);
      var py = $.math.catmullRomInterpolation($.points.y, i);

      //This draws the path onto the screen to edit the path
      // this.bmd.rect(px, py, 1, 1, 'rgba(255, 255, 255, 1)');

      var node = {x: px, y: py, angle: 0};
      if (ix > 0) {
        node.angle = $.math.angleBetweenPoints($.path[ix - 1], node);
      }
      $.path.push(node);
      ix++;

    }

    //This draws rectangles onto the path where the nodes are located
    // for (var p = 0; p < this.points.x.length; p++) {
    //   this.bmd.rect(this.points.x[p]-3, this.points.y[p]-3, 6, 6, 'rgba(255, 0, 0, 1)');
    // }

  },

  update: function (){
    var $ = this;

    //////////////////////////////////////////////
    //     Places enemy tanks into the wave     //
    //////////////////////////////////////////////


    for (var i = 0; i < $.enemyWave.length; i++) {
      var offset = $.path[$.pi + (($.enemyWave.length - 1) * 40 - i * 40)];
      if ($.enemyWave[8].x !== 860) {
        $.enemyWave[i].x = offset.x;
        $.enemyWave[i].y = offset.y;
        $.enemyWave[i].rotation = offset.angle;
      }
    };


    $.pi++;
    // if (this.pi >= this.path.length) {
    //   this.pi = 0;
    // }

    for (var i = 0; i < $.enemyWave.length; i++) {
      for (var j = 0; j < $.turretPosition.length; j++) {
        if ($.physics.arcade.distanceToXY($.enemyWave[i], $.turretPosition[j].x, $.turretPosition[j].y) < 200 && $.enemyWave[i].alive === true) {
          $.turretPosition[j].rotation = game.physics.arcade.angleBetween($.turretPosition[j], $.enemyWave[i]);
        }
      }
    }

    ///////////////////////////////////////
    //     Coin kill for turret fire     //
    ///////////////////////////////////////
    for (var y = 0; y < 10; y++) {
      if ($.coinPosition[y].alive === false) {
        $.aim(y);
      }
    }

    game.physics.arcade.overlap($.bullets, $.enemies, $.collisionHandler);

  },

  playCashRegister: function () {
    console.log("works");
  },

  createTurret: function (coin) {
    coin.kill()
    this.cashRegister = game.add.audio('cashRegister');
    this.cashRegister.play();
  },

  collisionHandler: function (bullet, enemy) {
    bullet.kill();
    // console.log(enemy.health);
    enemy.health -= 1;
    if(enemy.health <= 0) {
      this.explosionSound = game.add.audio('explosion');
      this.explosionSound.play();
      enemy.kill();
      var explosion = explosions.getFirstExists(false);
      explosion.reset(enemy.body.x - 70, enemy.body.y - 70);
      explosion.animations.add('explosion');
      explosion.animations.play('explosion');
    }
  },
  aim: function (x) {
    var turr = this.turretPosition[x];
    if (game.time.now > nextFire[x] && this.bullets.countDead() > 0) {
      nextFire[x] = game.time.now + fireRate;
      var bullet = this.bullets.getFirstDead();
      bullet.anchor.set(0.5);
      bullet.reset(turr.x, turr.y);
      //Try decrimenting the function to have it aim at the first turret
      for (var i = 0; i < this.enemyWave.length; i++) {
        var enem = this.enemyWave[i];
        if (this.physics.arcade.distanceToXY(enem, turr.x, turr.y) < 200 && enem.alive === true && enem.x > 0 && enem.y < 768) {
          bullet.rotation = game.physics.arcade.angleBetween(turr, enem);
          game.physics.arcade.moveToObject(bullet, enem, 300);
          var shot = game.add.audio('shot');
          shot.play();
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
