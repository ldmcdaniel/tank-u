PhaserGame.MainMenu = function (game) {
  //create this.varName here for use in the prototype for the menu
};

PhaserGame.MainMenu.prototype = {
  create: function () {

    //use the variables using this.varName to add to the menu

    var titleLabel = game.add.text(100, 100, 'Saving the World', {font: '50px Arial', fill: '#eeeeee'});

    var startLabel = game.add.text(100, game.world.height-100, 'Press "w" to Begin', {font: '20px Arial', fill: '#eeeeee'});

    var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);

    wKey.onDown.addOnce(this.start, this);

  },

  start: function () {

    game.state.start('Game');

  },


  update: function () {

    //Do some nice funky main menu effect here

  },

  resize: function () {

  }

};

game.state.add('MainMenu', PhaserGame.MainMenu);
