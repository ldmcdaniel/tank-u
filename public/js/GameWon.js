'use strict';

PhaserGame.GameWon = {
  create: function create() {
    var titleLabel = game.add.text(100, 100, 'You won!  Your score is ' + score + '.', { font: '50px Arial', fill: '#eeeeee' });
    var startLabel = game.add.text(100, game.world.height - 100, 'Click to Restart', { font: '20px Arial', fill: '#eeeeee' });
    game.input.onDown.addOnce(this.restart, this);
  },
  restart: function restart() {
    game.state.start('Boot');
  }
};

game.state.add('GameWon', PhaserGame.GameWon);
game.state.start('Boot');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9qcy9HYW1lV29uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsVUFBVSxDQUFDLE9BQU8sR0FBRztBQUNuQixRQUFNLEVBQUEsa0JBQUc7QUFDUCxRQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLDBCQUEwQixHQUFHLEtBQUssR0FBRyxHQUFHLEVBQUUsRUFBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0FBQzFILFFBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBQyxHQUFHLEVBQUUsa0JBQWtCLEVBQUUsRUFBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO0FBQ3RILFFBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0dBQy9DO0FBQ0QsU0FBTyxFQUFBLG1CQUFHO0FBQ1IsUUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7R0FDMUI7Q0FDRixDQUFBOztBQUVELElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDOUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMiLCJmaWxlIjoiR2FtZVdvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlBoYXNlckdhbWUuR2FtZVdvbiA9IHtcbiAgY3JlYXRlKCkge1xuICAgIHZhciB0aXRsZUxhYmVsID0gZ2FtZS5hZGQudGV4dCgxMDAsIDEwMCwgJ1lvdSB3b24hICBZb3VyIHNjb3JlIGlzICcgKyBzY29yZSArICcuJywge2ZvbnQ6ICc1MHB4IEFyaWFsJywgZmlsbDogJyNlZWVlZWUnfSk7XG4gICAgdmFyIHN0YXJ0TGFiZWwgPSBnYW1lLmFkZC50ZXh0KDEwMCwgZ2FtZS53b3JsZC5oZWlnaHQtMTAwLCAnQ2xpY2sgdG8gUmVzdGFydCcsIHtmb250OiAnMjBweCBBcmlhbCcsIGZpbGw6ICcjZWVlZWVlJ30pO1xuICAgIGdhbWUuaW5wdXQub25Eb3duLmFkZE9uY2UodGhpcy5yZXN0YXJ0LCB0aGlzKTtcbiAgfSxcbiAgcmVzdGFydCgpIHtcbiAgICBnYW1lLnN0YXRlLnN0YXJ0KCdCb290Jyk7XG4gIH1cbn1cblxuZ2FtZS5zdGF0ZS5hZGQoJ0dhbWVXb24nLCBQaGFzZXJHYW1lLkdhbWVXb24pO1xuZ2FtZS5zdGF0ZS5zdGFydCgnQm9vdCcpOyJdfQ==
