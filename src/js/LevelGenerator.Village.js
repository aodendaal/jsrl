var Tiles = require('./Tiles.enum');
var Utilities = require('./LevelGenerator.Utilities');
var Races = require('./Races.enum');
var Being = require('./Being.class');

module.exports = {
    yShift: 0,
    generate: function (level, width, height, fromId) {
        Utilities.blockOutLevel(level, width, height);

        let topOffset = 4
        this.yShift = topOffset - 1;
        let bottomOffset = 1;

        let map = new ROT.Map.Arena(width, height - topOffset - bottomOffset);

        let freeCells = [];
       
        let callback = function (x, y, value) {
            if (value) {
                level.map[x][y + this.yShift] = Tiles.FENCE;
            }
            else {
                level.map[x][y + this.yShift] = Tiles.GRASS;
                freeCells.push(x + ',' + (y + this.yShift));
            }
        }
        
        for (let i = 0; i < 4; i++) map.create(callback.bind(this));

        this._placeEntrance(level, freeCells, fromId);

        this._placeBeings(level, freeCells);

        //Utilities.placeGold(level, freeCells);

        //Utilities.placeItems(level, freeCells);

        //this._placeExit(level, freeCells);
    },
    _placeEntrance: function (level, freeCells, fromId) {
        let cell = Utilities.getFreeCell(freeCells);

        if (fromId) {
            level.addExit(cell.x, cell.y, fromId, Tiles.STAIRS_UP);
        }
        level.player.x = cell.x;
        level.player.y = cell.y;
    },
    _placeExit: function (level, freeCells) {
        let cell = Utilities.getFreeCell(freeCells);

        level.addExit(cell.x, cell.y, String(++level.game.world.levelCount), Tiles.STAIRS_DOWN);
    },
    _placeBeings: function (level, freeCells) {
        // add rats
        for (let i = 0; i < 10; i++) {
            let being = new Being(level.game, level, Races.PEASANT);
            being.intent = 'RANDOM';

            let cell = Utilities.getFreeCell(freeCells);
            level.addBeing(being, cell.x, cell.y);
        }
    },
}