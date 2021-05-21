module.exports = {
	WEAPON: {
		name: 'Weapon',
		useFunction: function (game, item, index) {
			game.display.message("You wield the " + item.def.name);
			
			game.player.items.splice(index, 1);

			game.player.wielding = item;
		}
	},
	CONSUME: {
		name: 'Consume',
		useFunction: function (game, item, index) {
			item.def.use(game);
			game.player.items.splice(index, 1);
		}
	},
	BOOK: {
		name: 'Book',
		useFunction: function (game, item, index) {
			game.display.message("You read the " + item.def.name);
		}
	},
	SPELL: {
		name: 'Spell',
		targetted: true,
		useFunction: function (game, item, index, dx, dy) {
			game.display.message("You cast the " + item.def.name + " in direction x " + dx + " y " + dy);

			game.player.items.splice(index, 1);
		}
	}
}