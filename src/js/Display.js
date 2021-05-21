var TextBox = require('./ui/TextBox.class');
var Box = require('./ui/Box.class');
var Colors = require('./Colors.enum');

module.exports = {
	BLANK_TILE: new ut.Tile(' ', 255, 255, 255),
	CURSOR_TILE: new ut.Tile('*', 255, 255, 255),
	GOLD_TILE: new ut.Tile('$', 255, 255, 191),
	init: function (game, config) {
		this.game = game;

		this.term = new ut.Viewport(document.getElementById("game"), this.game.world.width, this.game.world.height);
		this.eng = new ut.Engine(this.term, this.getDisplayedTile.bind(this), this.game.world.width, this.game.world.height);
		this.historyText = new TextBox(this.term, 2, this.game.world.width, { x: 0, y: 0 }, this);
		this.inventoryBox = new Box(this.term, 15, 40, { x: 19, y: 4 });
		this.centered = config && config.centered;

		if (config && config.animated) {
			this.eng.setShaderFunc(this._shading);
			window.setInterval(this.refresh.bind(this), 100);
		}
	},
	_shading: function (tile, x, y, time) {

		if (y < 3) return tile;
		if (this.game && this.game.world && y > this.game.world.height - 1) return tile;

		let p = Math.sin(time);
		let i = Math.floor(Math.abs(p) * 255);

		let shaded = new ut.Tile(tile.getChar(), i, 0, 0);

		return shaded;
	},
	getDisplayedTile: function (x, y) {
		var level = this.game.world.level;
		if (x === level.player.x && y === level.player.y) {
			return level.player.tile;
		}
		var xr = x - level.player.x;
		var yr = y - level.player.y;
		if (level.player.canSee(xr, yr)) {
			if (level.beings[x] && level.beings[x][y]) {
				return level.beings[x][y].tile;
			} else if (level.items[x] && level.items[x][y]) {
				return level.items[x][y].def.tile;
			} else if (level.gold[x] && level.gold[x][y]) {
				return this.GOLD_TILE;
			} else if (level.map[x] && level.map[x][y]) {
				return level.map[x][y].tile;
			} else {
				return ut.NULLTILE;
			}
		} else if (level.player.remembers(x, y)) {
			if (level.map[x] && level.map[x][y]) {
				return level.map[x][y].darkTile;
			} else {
				return ut.NULLTILE;
			}
		} else {
			return ut.NULLTILE;
		}
	},
	refresh: function () {
		if (this.centered) {
			this.eng.update(this.game.player.x, this.game.player.y);
		} else {
			this.eng.update(Math.floor(this.game.world.width / 2), Math.floor(this.game.world.height / 2));
		}
		this.historyText.draw();
		this.showStatus();
		this.term.render();
	},
	showInventory: function () {
		this.inventoryBox.draw();
		let xBase = 20;
		let yBase = 5;
		this.term.putString("Inventory", xBase, yBase, ...Colors.PRIMARY);
		for (let i = 0; i < this.game.player.items.length; i++) {
			let item = this.game.player.items[i];
			if (item == this.game.input.selectedItem) {
				this.term.put(this.CURSOR_TILE, xBase, yBase + 1 + i);
			} else {
				this.term.put(this.BLANK_TILE, xBase, yBase + 1 + i);
			}
			this.term.put(item.def.tile, xBase + 2, yBase + 1 + i);
			this.term.put(item.def.tile, xBase + 2, yBase + 1 + i);
			this.term.putString(item.def.name, xBase + 4, yBase + 1 + i, ...Colors.DEFAULT);
		}
		this.term.render();
	},
	showStart: function () {
		this.term.clear();

		let center = Math.floor(this.game.world.width / 2);
		let message = 'JavaScript Roguelike';
		let x = center - Math.floor(message.length / 2);
		let y = Math.floor(this.game.world.height / 2);

		this.term.putString(message, x, y, ...Colors.DEFAULT);

		this.term.putString("Press [s] to start.", 0, this.game.world.height - 5, ...Colors.DEFAULT);
		this.term.putString("Press [?] for help.", 0, this.game.world.height - 4, ...Colors.DEFAULT);

		this.term.render();
	},
	showGameOver: function () {
		this.term.clear();

		let center = Math.floor(this.game.world.width / 2);
		let message = 'You died. Game Over';
		let x = center - Math.floor(message.length / 2);
		let y = Math.floor(this.game.world.height / 2);

		this.term.putString(message, x, y, ...Colors.DEFAULT);

		this.term.putString("Press [r] to restart.", 0, this.game.world.height - 5, ...Colors.DEFAULT);

		this.historyText.draw();
		this.showStatus();
		
		this.term.render();
	},
	showHelp: function () {
		this.term.clear();
		this.term.putString('General commands:', 0, 0, ...Colors.PRIMARY);
		this.term.putString('?       help    display help', 0, 1, ...Colors.DEFAULT);
		this.term.putString(',       pickup  pick up item', 0, 2, ...Colors.DEFAULT);
		this.term.putString('i       invent  show inventory', 0, 3, ...Colors.DEFAULT);

		this.term.render();
	},
	hideHelp: function () {
		this.term.clear();
		this.refresh();
	},
	hideInventory: function () {
		this.term.clear();
		this.refresh();
	},
	message: function (str) {
		this.historyText.addText(str);
		this.historyText.draw();
		this.term.render();
	},
	showStatus: function () {
		//this.term.putString(`Level:${this.game.world.level.id}`, 0, 24, ...Colors.DEFAULT);
		if (this.game.player.hitPoints <= this.game.player.maxHitPoints / 4) {
			this.term.putString(`Hits:${this.game.player.hitPoints}(${this.game.player.maxHitPoints})`, 12, 24, ...Colors.DANGER);
		} else {
			this.term.putString(`Hits:${this.game.player.hitPoints}(${this.game.player.maxHitPoints})`, 12, 24, ...Colors.DEFAULT);
		}
		this.term.putString(`Str:${this.game.player.getStrength()}`, 27, 24, ...Colors.DEFAULT);
		this.term.putString(`Gold:${this.game.player.gold}`, 37, 24, ...Colors.DEFAULT);
		this.term.putString(`Armor:${this.game.player.armor}`, 47, 24, ...Colors.DEFAULT);
	}
}
