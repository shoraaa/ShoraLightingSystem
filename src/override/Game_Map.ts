import { Game_Map } from 'rmmz';
import Game_Lighting from '../lighting/Game_Lighting';
declare var $gameLighting: Game_Lighting;

const setup: (mapId) => void = Game_Map.prototype.setup;

Game_Map.prototype.setup = function(mapId: number) {
    setup.call(this, mapId);
    this._lighting = [];
}

