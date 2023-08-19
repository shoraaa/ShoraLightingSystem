const setup = Game_Map.prototype.setup;

Game_Map.prototype.setup = function(mapId) {
    setup.call(this, mapId);
    this._lighting = [];
}

