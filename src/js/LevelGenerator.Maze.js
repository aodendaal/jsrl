var Tiles = require('./Tiles.enum');
var Utilities = require('./LevelGenerator.Utilities');

module.exports = {
    yShift: 0,
    generate: function (level, width, height, fromId) {
        Utilities.blockOutLevel(level, width, height);

        let topOffset = 4
        this.yShift = topOffset - 1;
        let bottomOffset = 1;

        let mazeHeight = height - topOffset - bottomOffset;
        if (mazeHeight % 2 == 0) mazeHeight -= 1;

        let mazeWidth = width;
        if (mazeWidth % 2 == 0) mazeWidth -= 1;

        let map = new ROT.Map.DividedMaze(mazeWidth, mazeHeight);

        let freeCells = [];
       
        let callback = function (x, y, value) {
            if (value) {
                level.map[x][y + this.yShift] = Tiles.MAZEWALL;
            }
            else {
                level.map[x][y + this.yShift] = Tiles.MAZEFLOOR;
                freeCells.push(x + ',' + (y + this.yShift));
            }
        }

        map.create(callback.bind(this));

        this._placeEntrance(level, freeCells, fromId);

        Utilities.placeBeings(level, freeCells);

        Utilities.placeGold(level, freeCells);

        Utilities.placeItems(level, freeCells);

        this._placeExit(level, freeCells);
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
    }
}