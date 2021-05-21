var Tiles = require('./Tiles.enum');
var Races = require('./Races.enum');
var Being = require('./Being.class');
var Item = require('./Item.class');
var Items = require('./Items.enum');

module.exports = {
    blockOutLevel: function (level, width, height) {
        for (let x = 0; x < width; x++) {
            level.map[x] = [];
            for (let y = 0; y < height; y++) {
                level.map[x][y] = Tiles.BARRIER;
            }
        }
    },
    getFreeCell: function (freeCells) {
        let index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        let key = freeCells.splice(index, 1)[0];

        return { x: parseInt(key.split(',')[0]), y: parseInt(key.split(',')[1]) };
    },
    placeBeings: function (level, freeCells) {
        // add rats
        for (let i = 0; i < 5; i++) {
            let being = new Being(level.game, level, Races.RAT);
            being.intent = 'RANDOM';

            let cell = this.getFreeCell(freeCells);
            level.addBeing(being, cell.x, cell.y);
        }

        // add trolls
        for (let i = 0; i < 5; i++) {
            let being = new Being(level.game, level, Races.TROLL);
            being.intent = 'CHASE';
            let cell = this.getFreeCell(freeCells);
            level.addBeing(being, cell.x, cell.y);
        }
    },
    placeGold: function (level, freeCells) {
        let count = Math.floor(ROT.RNG.getUniform() * 10);
        for (let i = 0; i < count; i++) {
            let cell = this.getFreeCell(freeCells);
            let amount = Math.floor(ROT.RNG.getNormal(parseInt(level.id), 2));
            if (amount <= 0) amount = 1;
            level.addGold(amount, cell.x, cell.y);
        }
    },
    placeItems: function (level, freeCells) {
        let count = Math.floor(ROT.RNG.getUniform() * 4);
        for (let i = 0; i < count; i++) {
            let cell = this.getFreeCell(freeCells);
            level.addItem(new Item(Items.IRON_SWORD), cell.x, cell.y);
        }

        count = Math.floor(ROT.RNG.getUniform() * 4);
        for (let i = 0; i < count; i++) {
            let cell = this.getFreeCell(freeCells);
            level.addItem(new Item(Items.HEALTH_POTION), cell.x, cell.y);
        }
    }
}