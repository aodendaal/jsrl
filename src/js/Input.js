module.exports = {
	inputEnabled: true,
	init: function (game) {
		this.game = game;
		ut.initInput(this.onKeyDown.bind(this));
		this.mode = 'START_MENU';
	},
	movedir: { x: 0, y: 0 },
	onKeyDown: function (k) {
		if (!this.inputEnabled)
			return;
		
		if (this.mode === 'MOVEMENT') {
			this._handleMovementInput(k);
		} else if (this.mode === 'INVENTORY') {
			this._handleInventoryInput(k);
		} else if (this.mode === 'SELECT_DIRECTION') {
			this._handleDirectionInput(k);
		} else if (this.mode === 'START_MENU') {
			this._handleStartMenuInput(k);
		} else if (this.mode === 'GAME_OVER') {
			this._handleGameOverInput(k);
		} else if (this.mode === 'HELP') {
			this._handleHelpInput(k);
		}
	},
	_handleMovementInput: function (k) {
		if (k === ut.KEY_SHIFT) {
			if (ut.isKeyPressed(ut.KEY_FORWARDSLASH)) {
				this.game.display.showHelp();
				this.mode = 'HELP';
				return;
			}
		}
		if (k === ut.KEY_SPACE) {
			this.game.player.wait();
			return;
		}
		if (k === ut.KEY_COMMA) {
			this.game.player.tryPickup();
			return;
		}
		if (k === ut.KEY_I) {
			if (this.game.player.items.length === 0) {
				this.game.display.message("You don't have any items");
				return;
			}
			this.mode = 'INVENTORY';
			this.selectedItemIndex = 0;
			this.selectedItem = this.game.player.items[0];
			this.game.display.showInventory();
			return;
		}
		this.movedir.x = 0;
		this.movedir.y = 0;
		if (k === ut.KEY_LEFT ||
			k === ut.KEY_H ||
			k === ut.KEY_NUMPAD4 || k === ut.KEY_NUMPAD1 || k === ut.KEY_NUMPAD7 ||
			k === ut.KEY_Q || k === ut.KEY_A || k === ut.KEY_Z
		) {
			this.movedir.x = -1;
		}
		if (k === ut.KEY_RIGHT ||
			k === ut.KEY_L ||
			k === ut.KEY_NUMPAD6 || k === ut.KEY_NUMPAD9 || k === ut.KEY_NUMPAD3 ||
			k === ut.KEY_E || k === ut.KEY_D || k === ut.KEY_C
		) {
			this.movedir.x = 1;
		}
		if (k === ut.KEY_UP ||
			k === ut.KEY_K ||
			k === ut.KEY_NUMPAD8 || k === ut.KEY_NUMPAD7 || k === ut.KEY_NUMPAD9 ||
			k === ut.KEY_Q || k === ut.KEY_W || k === ut.KEY_E
		) {
			this.movedir.y = -1;
		}
		if (k === ut.KEY_DOWN ||
			k === ut.KEY_J ||
			k === ut.KEY_NUMPAD2 || k === ut.KEY_NUMPAD1 || k === ut.KEY_NUMPAD3 ||
			k === ut.KEY_Z || k === ut.KEY_X || k === ut.KEY_C
		) {
			this.movedir.y = 1;
		}
		if (this.movedir.x === 0 && this.movedir.y === 0) {
			return;
		}
		this.inputEnabled = false;
		this.game.player.tryMove(this.movedir);
	},
	_handleInventoryInput: function (k) {
		if (k === ut.KEY_ESCAPE) {
			this.game.display.hideInventory();
			this.mode = 'MOVEMENT';
		} else if (k === ut.KEY_UP || k === ut.KEY_K) {
			if (this.selectedItemIndex > 0) {
				this.selectedItemIndex--;
			}
			this.selectedItem = this.game.player.items[this.selectedItemIndex];
			this.game.display.showInventory();
		} else if (k === ut.KEY_DOWN || k === ut.KEY_J) {
			if (this.selectedItemIndex < this.game.player.items.length - 1) {
				this.selectedItemIndex++;
			}
			this.selectedItem = this.game.player.items[this.selectedItemIndex];
			this.game.display.showInventory();
		} else if (k === ut.KEY_D) {
			this.game.player.tryDrop(this.selectedItem);
			this.game.display.hideInventory();
			this.mode = 'MOVEMENT';
		} else if (k === ut.KEY_ENTER || k === ut.KEY_U) {
			if (this.selectedItem.def.targetted || this.selectedItem.def.type.targetted) {
				this.game.display.message("Select a direction.");
				this.game.display.hideInventory();
				this.mode = 'SELECT_DIRECTION';
				this.directionAction = 'USE_ITEM';
			} else {
				this.game.player.tryUse(this.selectedItem, this.selectedItemIndex);
				this.game.display.hideInventory();
				this.mode = 'MOVEMENT';
			}
		}
	},
	_handleDirectionInput: function (k) {
		if (k === ut.KEY_ESCAPE) {
			this.mode = 'INVENTORY';
			this.game.display.showInventory();
			this.game.display.message("Cancelled.");
			return;
		}
		this.movedir.x = 0;
		this.movedir.y = 0;
		if (k === ut.KEY_LEFT || k === ut.KEY_H) this.movedir.x = -1;
		else if (k === ut.KEY_RIGHT || k === ut.KEY_L) this.movedir.x = 1;
		else if (k === ut.KEY_UP || k === ut.KEY_K) this.movedir.y = -1;
		else if (k === ut.KEY_DOWN || k === ut.KEY_J) this.movedir.y = 1;
		else return;
		this.game.player.tryUse(this.selectedItem, this.selectedItemIndex, this.movedir.x, this.movedir.y);
		this.mode = 'MOVEMENT';
	},
	_handleStartMenuInput: function (k) {
		if (k === ut.KEY_S) {
			this.game.player.updateFOV();
			this.game.display.refresh();

			this.mode = "MOVEMENT"
		}
	},
	_handleGameOverInput: function (k) {
		if (k === ut.KEY_R) {
			this.game.reset();
		}		
	},
	_handleHelpInput: function (k) {
		if (k === ut.KEY_ESCAPE) {
			this.game.display.hideHelp();
			this.mode = 'MOVEMENT';
		}
	}
}