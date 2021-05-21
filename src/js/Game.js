var Display = require('./Display');
var World = require('./World');
var Player = require('./Player');
var Input = require('./Input');

// Remove after tests
var Item = require('./Item.class');
var Items = require('./Items.enum');

var Game = {
	start: function () {
		this.display = Display;
		this.world = World;
		this.player = Player;
		this.input = Input;

		this.reset();
	},
	reset: function () {
		this.player.init(this);
		this.world.init(this);
		this.input.init(this);
		this.display.init(this, { centered: false, animated: false });

		this.display.showStart();
	}
}

window.Game = Game;

module.exports = Game;