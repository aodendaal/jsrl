module.exports = {
	MAX_SIGHT_RANGE: 10,
	x: 20,
	y: 20,
	totalSteps: 0,
	gold: 0,
	hitPoints: 5,
	maxHitPoints: 5,
	strength: 1,
	armor: 0,
	tile: new ut.Tile('@', 255, 255, 255),
	visible: [],
	memory: {},
	items: [],
	wielding: null,
	init: function (game) {
		this.game = game;
		
		this.totalSteps = 0;
		this.gold = 0;
		this.hitPoints = 5;
		this.maxHitPoints = 5;
		this.strength = 1;
		this.armor = 0;
		this.visible = [],
		this.memory = {},
		this.items = [];
		this.wielding = null;

		for (let j = -this.MAX_SIGHT_RANGE; j <= this.MAX_SIGHT_RANGE; j++) {
			this.visible[j] = [];
		}
	},
	wait: function () {
		this.endTurn();
	},
	tryMove: function (dir) {
		if (this.game.world.level.isOccupiedByBeing(this.x + dir.x, this.y + dir.y)) {
			this.attack(this.game.world.level.beings[this.x + dir.x][this.y + dir.y]);
			return;
		}

		if (!this.game.world.level.canWalkTo(this.x + dir.x, this.y + dir.y)) {
			this.game.input.inputEnabled = true;
			return;
		}

		this.x += dir.x;
		this.y += dir.y;
		this.land();
	},
	getStrength: function () {
		if (!this.wielding)
			return 1;

		return 1 + parseInt(this.wielding.def.strength);
	},
	attack: function (being) {
        this.game.display.message(`${being.name} explodes like a blood sausage.`);

        this.game.world.level.removeBeing(being.x, being.y);

		this.game.input.inputEnabled = true;
		this.endTurn();
	},
	land: function () {
		if (this.game.world.level.gold[this.x] && this.game.world.level.gold[this.x][this.y]) {
			let amount = this.game.world.level.gold[this.x][this.y];
			this.game.display.message(`You pick up ${amount} gold.`);
			this.gold += amount;
			this.game.world.level.removeGold(this.x, this.y);
		}

		if (this.game.world.level.exits[this.x] && this.game.world.level.exits[this.x][this.y]) {
			this.game.world.loadLevel(this.game.world.level.exits[this.x][this.y]);
		}
		else if (this.game.world.level.villages[this.x] && this.game.world.level.villages[this.x][this.y]) {
			this.game.world.loadVillage(this.game.world.level.villages[this.x][this.y]);
		}
		else if (this.game.world.level.caves[this.x] && this.game.world.level.caves[this.x][this.y]) {
			this.game.world.loadCave(this.game.world.level.caves[this.x][this.y]);
		}

		this.endTurn();
	},
	endTurn: function () {
		this.updateFOV();
		this.game.display.refresh();
		this.game.world.level.beingsTurn();

		this.totalSteps++;

		if (this.hitPoints <= 0) {
			this.game.display.message('You died. Press r to restart.');
			this.game.input.mode = 'GAME_OVER';
		}
	},
	remember: function (x, y) {
		let memory = this.memory[this.game.world.level.id];
		if (!memory) {
			memory = [];
			this.memory[this.game.world.level.id] = memory;
		}
		if (!memory[x]) {
			memory[x] = [];
		}
		memory[x][y] = true;
	},
	remembers: function (x, y) {
		let memory = this.memory[this.game.world.level.id];
		if (!memory) {
			return false;
		}
		if (!memory[x]) {
			return false;
		}
		return memory[x][y] === true;
	},
	canSee: function (dx, dy) {
		try {
			return this.visible[dx][dy] === true;
		} catch (err) {
			// Catch OOB
			return false;
		}
	},
	getSightRange: function () {
		return 15;
	},
	updateFOV: function () {
		/*
		 * This function uses simple raycasting, 
		 * use something better for longer ranges
		 * or increased performance
		 */
		for (let j = -this.MAX_SIGHT_RANGE; j <= this.MAX_SIGHT_RANGE; j++)
			for (let i = -this.MAX_SIGHT_RANGE; i <= this.MAX_SIGHT_RANGE; i++)
				this.visible[i][j] = false;
		let step = Math.PI * 2.0 / 1080;
		for (let a = 0; a < Math.PI * 2; a += step)
			this.shootRay(a);
	},
	shootRay: function (a) {
		let step = 0.3333;
		let maxdist = this.getSightRange() < this.MAX_SIGHT_RANGE ? this.getSightRange() : this.MAX_SIGHT_RANGE;
		maxdist /= step;
		let dx = Math.cos(a) * step;
		let dy = -Math.sin(a) * step;
		let xx = this.x, yy = this.y;
		for (let i = 0; i < maxdist; ++i) {
			let testx = Math.round(xx);
			let testy = Math.round(yy);
			this.visible[testx - this.x][testy - this.y] = true;
			this.remember(testx, testy);
			try {
				if (this.game.world.level.map[testx][testy].opaque)
					return;
			} catch (err) {
				// Catch OOB
				return;
			}
			xx += dx; yy += dy;
		}
	},
	canPick: function () {
		return this.items.length < 24;
	},
	addItem: function (item) {
		if (this.items.length === 24) {
			return;
		}
		this.items.push(item);
		this.items.sort(this.itemSorter);
	},
	removeItem: function (item) {
		this.items.splice(this.items.indexOf(item), 1);
		this.items.sort(this.itemSorter);
	},
	itemSorter: function (a, b) {
		if (a.def.type.name === b.def.type.name) {
			return a.def.name > b.def.name ? 1 : -1;
		} else {
			return a.def.type.name > b.def.type.name ? 1 : -1;
		}
	},
	tryPickup: function () {
		let item = this.game.world.level.getItem(this.x, this.y);
		if (item) {
			if (!this.canPick()) {
				this.game.display.message("You can't pickup the " + item.def.name);
			} else {
				this.game.display.message("You pickup the " + item.def.name);
				this.game.world.level.removeItem(this.x, this.y);
				this.addItem(item);
			}
		}
	},
	tryDrop: function (item) {
		let underItem = this.game.world.level.items[this.x] && this.game.world.level.items[this.x][this.y];
		if (underItem) {
			this.game.display.message("Cannot drop the " + item.def.name + " here.");
		} else {
			this.game.world.level.addItem(item, this.x, this.y);
			this.removeItem(item);
			this.game.display.message("You drop the " + item.def.name + ".");
		}
	},
	tryUse: function (item, index, dx, dy) {
		item.def.type.useFunction(this.game, item, index, dx, dy);
	}
}