var winState = {

  create: function () {

    var titleLabel = game.add.text(100, 100, 'Game Over!', {font: '50px Arial', fill: '#eeeeee'});

    var startLabel = game.add.text(100, game.world.height-100, 'Press "w" to Restart', {font: '20px Arial', fill: '#eeeeee'});

    var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);

    wKey.onDown.addOnce(this.restart, this);
  },

  restart: function () {

    game.state.start('menu');

  }

}
