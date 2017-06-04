var explosions; 
let nextFire = [];
for(let i = 0; i < 10; i++) {
  nextFire[i] = 0;
}

PhaserGame.Game = game => { /* this.weapons = [];*/ }

PhaserGame.Game.prototype = {
  createMap() {
    const map = this.add.tilemap('map');
    // First param :name of tileset from tiled; second: game.load.image
    map.addTilesetImage('terrain_atlas', 'terrain');
    map.addTilesetImage('turrets32', 'turrets');
    let layers = ['Road', 'Grass', 'Tree bases', 'Tree Tops and Bridges'];
    layers.forEach(layer => map.createLayer(layer).scale.set(1));
    this.bmd = this.add.bitmapData(game.width, game.height);
    this.bmd.addToWorld();
  },
  createBullets() {
    this.bullets = game.add.group();
    let bullets = this.bullets;
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(500, 'bullet1');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
  },
  createEnemies() {
    this.enemies = game.add.group();
    const enemies = this.enemies;
    enemies.hp = 3;
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyWave = ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6', 'tank7', 'tank8', 'tank9'];
    let enemyWave = this.enemyWave;
    this.enemyWave.forEach(function(enemyString, i) {
      enemyWave[i] = enemies.create(-16, 116, enemyString);
      enemyWave[i].anchor.set(0.5);
      enemyWave[i].animations.add('explosion', false);
      enemyWave[i].health = 10;
    });
  },
  createTurrets() {
    this.guns = game.add.group();
    let guns = this.guns;
    this.turretPosition = ['turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1']
    let turretPosition = this.turretPosition;
    this.coinPosition = ['coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin']
    let coinPosition = this.coinPosition;
    this.turretSpots = {
      'x' : [352, 800, 256, 448, 96, 320, 128, 354, 832, 864],
      'y' : [32, 96, 256, 256, 320, 480, 640, 704, 384, 544]
    }
    let turretSpots = this.turretSpots;
    for (let i = 0; i < turretPosition.length; i++) {
      turretPosition[i] = guns.create(turretSpots.x[i], turretSpots.y[i], turretPosition[i]);
      turretPosition[i].anchor.set(0.5);
      coinPosition[i] = game.add.button(turretSpots.x[i], turretSpots.y[i], coinPosition[i], this.createTurret);
      coinPosition[i].anchor.set(0.5);
    }
    explosions = game.add.group();
    explosions.createMultiple(20, 'explosion');
  },
  createScoreAndStats() {
    const startingMoney = 40;
    const startingScore = 0;
    const startingWaveNumber = 1;
    let score = game.add.text(820, 10, 'Score:');
    let money = game.add.text(412, 10, "$ 40");
    const waveNumber = game.add.text(30, 10, 'Wave 1');
  },
  createGameMusic() {
    this.backgroundMusic = game.add.audio('backgroundMusic', true);
    this.backgroundMusic.play();
  },
  create() {
    this.createMap();
    this.createBullets();
    this.createEnemies();
    this.createTurrets();
    this.createScoreAndStats();
    this.createEnemyPlot();
    this.createGameMusic();
  },
  createEnemyPlot() {
    this.path = [];
    let ix = 0;
    const x = 1 / (game.width + (this.enemyWave.length - 1) * 100);
    this.points= {
      'x': [-466, -416, -366, -316, -266, -216, -156, -56, -16, 100, 200, 300, 400, 500, 600, 700, 740, 675, 600, 500, 400, 300, 205, 180, 190, 290, 390, 490, 590, 690, 790, 850, 860, 860, 860, 860, 860, 860, 860, 860, 860, 860],
      'y': [130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 145, 160, 180, 250, 310, 340, 350, 350, 365, 400, 475, 550, 590, 610, 623, 630, 638, 650, 720, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250]
    };
    this.pi = 0;
    for (let i = 0; i <= 1; i += x) {
      const px = this.math.catmullRomInterpolation(this.points.x, i);
      const py = this.math.catmullRomInterpolation(this.points.y, i);
      //This draws the path onto the screen to edit the path
      // this.bmd.rect(px, py, 1, 1, 'rgba(255, 255, 255, 1)');
      const node = {x: px, y: py, angle: 0};
      if (ix > 0) {
        node.angle = this.math.angleBetweenPoints(this.path[ix - 1], node);
      }
      this.path.push(node);
      ix++;
    }
    // This draws rectangles onto the path where the nodes are located
    // for (var p = 0; p < this.points.x.length; p++) {
    //   this.bmd.rect(this.points.x[p]-3, this.points.y[p]-3, 6, 6, 'rgba(255, 0, 0, 1)');
    // }
  },
  update() {
    let enemyWave = this.enemyWave;
    for (let i = 0; i < enemyWave.length; i++) {
      const offset = this.path[this.pi + ((enemyWave.length - 1) * 40 - i * 40)];
      if (enemyWave[8].x !== 860) {
        enemyWave[i].x = offset.x;
        enemyWave[i].y = offset.y;
        enemyWave[i].rotation = offset.angle;
      }
    };
    this.pi++;
    // if (this.pi >= this.path.length) {
    //   this.pi = 0;
    // }
    let turretPosition = this.turretPosition;
    for (let i = 0; i < enemyWave.length; i++) {
      for (let j = 0; j < turretPosition.length; j++) {
        if (this.physics.arcade.distanceToXY(enemyWave[i], turretPosition[j].x, turretPosition[j].y) < 200 && enemyWave[i].alive === true) {
          turretPosition[j].rotation = game.physics.arcade.angleBetween(turretPosition[j], enemyWave[i]);
        }
      }
    }

    for (let y = 0; y < 10; y++) {
      if (this.coinPosition[y].alive === false) {
        this.aim(y);
      }
    }
    game.physics.arcade.overlap(this.bullets, this.enemies, this.collisionHandler);
  },
  createTurret: coin => {
    coin.kill()
    game.add.audio('cashRegister').play();
  },
  collisionHandler: (bullet, enemy) => {
    bullet.kill();
    enemy.health -= 1;
    if(enemy.health <= 0) {
      game.add.audio('explosion').play();
      enemy.kill();
      const explosion = explosions.getFirstExists(false);
      explosion.reset(enemy.body.x - 70, enemy.body.y - 70);
      explosion.animations.add('explosion');
      explosion.animations.play('explosion');
    }
  },
  aim: function (x) {
    let turretPosition = this.turretPosition[x];
    if (game.time.now > nextFire[x] && this.bullets.countDead() > 0) {
      let bullet = this.bullets.getFirstDead();
      let fireRate = 300;
      nextFire[x] = game.time.now + fireRate;
      bullet.anchor.set(0.5);
      bullet.reset(turretPosition.x, turretPosition.y);
      // Try decrimenting the function to have it aim at the first turret
      for (let i = 0; i < this.enemyWave.length; i++) {
        let enemy = this.enemyWave[i];
        if (this.physics.arcade.distanceToXY(enemy, turretPosition.x, turretPosition.y) < 200 && enemy.alive === true && enemy.x > 0 && enemy.y < 768) {
          bullet.rotation = game.physics.arcade.angleBetween(turretPosition, enemy);
          game.physics.arcade.moveToObject(bullet, enemy, 300);
          game.add.audio('shot').play();
        }
      }
    }
  },
  render() { }
};

game.state.add('Game', PhaserGame.Game);
game.state.start('Boot');
