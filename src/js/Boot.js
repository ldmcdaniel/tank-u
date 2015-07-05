// var EnemyTank = function (index, game, player) {

//     this.game = game;
//     this.health = 3;
//     this.player = player;
//     this.alive = true;

//     this.tank = game.add.sprite(-16, 116, 'enemy', 'tank1');

//     this.tank.anchor.set(0.5);

//     this.tank.name = index.toString();
//     game.physics.enable(this.tank, Phaser.Physics.ARCADE);

// };

// EnemyTank.prototype.damage = function() {

//     this.health -= 1;

//     if (this.health <= 0)
//     {
//         this.alive = false;
//         this.tank.kill();
//         return true;
//     }

//     return false;

// }

var game = new Phaser.Game(1024, 768, Phaser.AUTO, 'game');

var PhaserGame = function (){
};

PhaserGame.Boot = function (game) {

};


PhaserGame.Boot.prototype = {

  init: function () {

    this.input.maxPointers= 1;

    // this.scale.scaleMode = Phaser.ScaleManager.RESIZE;

  },

  preload: function () {

    //Load the assets needed for your preloader bootscreen here

  },

  create: function () {

    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.cursors = game.input.keyboard.createCursorKeys();
    this.state.start('Preloader')

  }

};

game.state.add('Boot', PhaserGame.Boot);
