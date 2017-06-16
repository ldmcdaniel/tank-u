var explosions, money, moneyText, score, scoreText, restartGame; 
let nextFire = [];
let wave = 1;
let enemiesKilled = 0;
let pausedGame = false;
for(let i = 0; i < 10; i++) {
  nextFire[i] = 0;
}
PhaserGame.Game = {
  create() {
    this.createScale();
    const map = this.add.tilemap('map');
    this.createMap(map);
    this.createBullets();
    this.createTurrets();
    this.createEnemies();
    map.createLayer('Tree Tops and Bridges').scale.set(this.scale);
    this.createEnemyPlot(this.enemyWave);
    this.createScoreAndStats();
    this.createGameMusic();
    restartGame = game.add.text(0, 0, 'Restart');
    restartGame.inputEnabled = true;
    restartGame.events.onInputUp.add(function () {
      PhaserGame.Game.createEnemies();
      this.pi = 0;
      PhaserGame.Game.createEnemyPlot(PhaserGame.Game.enemyWave1);
      // enemiesKilled = 0;
      // game.state.start('Game');
    });
  },
  createScale() {
    this.scale = 1;
    if (window.innerWidth < 1024 || window.innerHeight < 768) {
      if ((window.innerWidth/1024) > (window.innerHeight/768)) {
        this.scale = window.innerHeight/768;
      } else {
        this.scale = window.innerWidth/1024;
      }
    }
  },
  createMap(map) {
    // First param :name of tileset from tiled; second: game.load.image
    map.addTilesetImage('terrain_atlas', 'terrain');
    map.addTilesetImage('turrets32', 'turrets');
    let layers = ['Road', 'Grass', 'Tree bases'];
    layers.forEach(layer => map.createLayer(layer).scale.set(this.scale));
    this.bmd = this.add.bitmapData(game.width * this.scale, game.height * this.scale);
    this.bmd.addToWorld();
  },
  createBullets() {
    this.bullets = game.add.group();
    let bullets = this.bullets;
    bullets.scale.set(this.scale);
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(5000, 'bullet1');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
  },
  createEnemies() {
    this.enemies = game.add.group();
    const enemies = this.enemies;
    enemies.scale.set(this.scale);
    enemies.enableBody = true;
    enemies.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyWave = ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6', 'tank7', 'tank8', 'tank9', 'tank10', 'tank11'];
    this.enemyWave1 = ['tank10', 'tank11', 'tank12', 'tank13'];
    let enemyWave = this.enemyWave;
    enemyWave.forEach((enemyString, i) => {
      enemyWave[i] = enemies.create(-16, 116, enemyString);
      enemyWave[i].anchor.set(0.5);
      enemyWave[i].animations.add('explosion', false);
      enemyWave[i].health = 10 + i * 2;
    });
  },
  createTurrets() {
    this.guns = game.add.group();
    let guns = this.guns;
    guns.scale.set(this.scale);
    this.turretPosition = ['turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1', 'turret1']
    let turretPosition = this.turretPosition;
    this.coinPosition = ['coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin', 'coin']
    let coinPosition = this.coinPosition;
    this.turretSpots = {
      'x' : [352, 800, 256, 448, 96, 320, 128, 354, 832, 864],
      'y' : [32, 96, 256, 256, 320, 480, 640, 704, 384, 544]
    }
    let turretSpots = this.turretSpots;
    let createTurret = this.createTurret;
    let scale = this.scale;
    turretPosition.forEach((turret, i) => {
      turretPosition[i] = guns.create(turretSpots.x[i], turretSpots.y[i], turretPosition[i]);
      turretPosition[i].anchor.set(0.5);
      coinPosition[i] = game.add.button(turretSpots.x[i] * scale, turretSpots.y[i] * scale, coinPosition[i], createTurret);
      coinPosition[i].anchor.set(0.5);
    });
    explosions = game.add.group();
    explosions.scale.set(this.scale);
    explosions.createMultiple(100, 'explosion');
  },
  createScore() {
    score = 0;
    scoreText = game.add.text(820 * this.scale, 10 * this.scale, 'Score: ' + score);
  },
  createMoney() {
    money = 40;
    moneyText = game.add.text(412 * this.scale, 10 * this.scale, "$ " + money);
  },
  createScoreAndStats() {
    this.createScore();
    this.createMoney();
    // const startingWaveNumber = 1;
    // const waveNumber = game.add.text(30, 10, 'Wave 1');
  },
  createGameMusic() {
    this.backgroundMusic = game.add.audio('backgroundMusic', true);
    this.backgroundMusic.play();
  },
  createEnemyPlot(enemies) {
    this.path = [];
    let ix = 0;
    const x = 1 / (game.width + (enemies.length - 1) * 100);
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
    const map = this.add.tilemap('map');
    if (wave === 1) {
      this.startTankMission(this.enemyWave);
      if (enemiesKilled >= this.enemyWave.length * wave) {
        PhaserGame.Game.createEnemies();
        // map.createLayer('Tree Tops and Bridges').scale.set(this.scale);
        PhaserGame.Game.createEnemyPlot(PhaserGame.Game.enemyWave);
        wave++;
      }
    }
    if (wave === 2) {
      this.startTankMission(this.enemyWave);
      if (enemiesKilled >= this.enemyWave.length * wave) {
        PhaserGame.Game.createEnemies();
        // map.createLayer('Tree Tops and Bridges').scale.set(this.scale);
        PhaserGame.Game.createEnemyPlot(PhaserGame.Game.enemyWave);
        wave++;
      }
    }
    if (wave === 3) {
      this.startTankMission(this.enemyWave);
      if (enemiesKilled >= this.enemyWave.length * wave) {
        enemiesKilled = 0;
        game.state.start('Boot');
      }
    }
  },
  startTankMission(enemies) {
    for (let i = 0; i < enemies.length; i++) {
      try {
        const offset = this.path[this.pi + ((enemies.length - 1) * 40 - i * 40)];
        enemies[i].x = offset.x;
        enemies[i].y = offset.y;
        enemies[i].rotation = offset.angle;
      }
      catch(e) {
        game.state.start('Game');
      }
    }
    this.pi++;
    let turretPosition = this.turretPosition;
    for (let i = 0; i < enemies.length; i++) {
      for (let j = 0; j < turretPosition.length; j++) {
        if (this.physics.arcade.distanceToXY(enemies[i], turretPosition[j].x, turretPosition[j].y) < 200 && enemies[i].alive === true) {
          turretPosition[j].rotation = game.physics.arcade.angleBetween(turretPosition[j], enemies[i]);
        }
      }
    }
    this.updateTurretAim();
    game.physics.arcade.overlap(this.bullets, this.enemies, this.collisionHandler);
  },
  updateTurretAim() {
    for (let y = 0; y < 10; y++) {
      if (this.coinPosition[y].alive === false) {
        this.aim(y);
      }
    }
  },
  updateMoney(amount) {
    money -= amount;
    moneyText.setText('$ ' + money);
  },
  createTurret: coin => {
    if (money - 8 >= 0) {
      coin.kill();
      PhaserGame.Game.updateMoney(8);
      game.add.audio('cashRegister').play();
    }
  },
  updateScore(points) {
    score += points;
    scoreText.setText('Score: ' + score); 
  },
  collisionHandler: (bullet, enemy) => {
    bullet.kill();
    enemy.health -= 1;
    PhaserGame.Game.updateScore(1);
    if(enemy.health <= 0) {
      game.add.audio('explosion').play();
      enemy.kill();
      enemiesKilled +=1
      PhaserGame.Game.updateScore(5);
      PhaserGame.Game.updateMoney(-5);
      const explosion = explosions.getFirstExists(false);
      explosion.reset(enemy.body.x - 70, enemy.body.y - 70);
      explosion.animations.add('explosion');
      explosion.animations.play('explosion', null, false, true);
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
  }
};

game.state.add('Game', PhaserGame.Game);
game.state.start('Boot');
