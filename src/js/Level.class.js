var Level = function (game, id) {
	this.init(game, id);
}

Level.prototype = {
	init: function (game, id) {
		this.map = [];
		this.beings = [];
		this.beingsList = [];
		this.exits = [];
		this.items = [];
		this.gold = [];
		this.villages = [];
		this.caves = [];

		this.game = game;
		this.id = id;
		this.player = game.player;
	},
	beingsTurn: function () {
		for (var i = 0; i < this.beingsList.length; i++) {
			this.beingsList[i].act();
		}
		this.player.updateFOV();
		this.game.display.refresh();
		this.game.input.inputEnabled = true;
	},
	addBeing: function (being, x, y) {
		this.beingsList.push(being);
		if (!this.beings[x])
			this.beings[x] = [];
		being.x = x;
		being.y = y;
		this.beings[x][y] = being;
	},
	isOccupiedByPlayer: function (x, y) {
		if (this.player && this.player.x === x && this.player.y === y)
			return true;
		
		return false;
	},
	isOccupiedByBeing: function (x, y) {
		if (this.beings[x] && this.beings[x][y]) {
			return true;
		}

		return false
	},
	canWalkTo: function (x, y) {
		try {
			if (this.map[x][y].solid) {
				return false;
			}
		} catch (e) {
			// Catch out of bounds
			return false;
		}
		
		if (this.beings[x] && this.beings[x][y]) {
			return false;
		}
		
		if (this.player && this.player.x === x && this.player.y === y)
			return false;
		
		return true;
	},
	addExit: function (x, y, levelId, tile) {
		if (!this.map[x])
			this.map[x] = [];
		this.map[x][y] = tile;
		if (!this.exits[x])
			this.exits[x] = [];
		this.exits[x][y] = levelId;
	},
	addItem: function (item, x, y) {
		if (!this.items[x])
			this.items[x] = [];
		this.items[x][y] = item;
	},
	addGold: function (amount, x, y) {
		if (!this.gold[x])
			this.gold[x] = [];
		this.gold[x][y] = amount;
	},
	addVillage: function (x, y, levelId, tile) {
		if (!this.map[x])
			this.map[x] = [];
		this.map[x][y] = tile;
		if (!this.villages[x])
			this.villages[x] = [];
		this.villages[x][y] = levelId;
	},
	addCave: function (x, y, levelId, tile) {
		if (!this.map[x])
			this.map[x] = [];
		this.map[x][y] = tile;
		if (!this.caves[x])
			this.caves[x] = [];
		this.caves[x][y] = levelId;
	},
	removeGold: function (x, y) {
		if (!this.gold[x])
			this.gold[x] = [];
		this.gold[x][y] = false;
	},
	getItem: function (x, y) {
		if (!this.items[x])
			return false;
		return this.items[x][y];
	},
	removeItem: function (x, y) {
		if (!this.items[x])
			this.items[x] = [];
		this.items[x][y] = false;
	},
	removeBeing: function(x, y) {
		let index = this.beingsList.indexOf(this.beings[x][y]);
        this.beingsList.splice(index, 1);

		if (!this.beings[x])
			this.beings[x] = [];
		this.beings[x][y] = false;
	}
}

module.exports = Level;