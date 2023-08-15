import { Spriteset_Map } from 'rmmz/lib/sprites';
import Game_Lighting from "../lighting/Game_Lighting";
declare var $gameLighting: Game_Lighting;

const destroy = Spriteset_Map.prototype.destroy;
const createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
const update = Spriteset_Map.prototype.update;

Spriteset_Map.prototype.destroy = function(options) {
    destroy.call(this, options);
    $gameLighting.removeScene(this);
}

Spriteset_Map.prototype.createUpperLayer = function() {
    createUpperLayer.call(this);
    $gameLighting.loadScene(this);
}

Spriteset_Map.prototype.update = function() {
    update.call(this);
    $gameLighting.update();
}
