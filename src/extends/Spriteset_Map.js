import { lightingManager } from "../light/LightingManager";
import { shadowManager } from "../light/ShadowManager";

const destroy = Spriteset_Map.prototype.destroy;
const createUpperLayer = Spriteset_Map.prototype.createUpperLayer;
const update = Spriteset_Map.prototype.update;

Spriteset_Map.prototype.destroy = function(options) {
    lightingManager.removeScene(this);
    destroy.call(this, options);
}

Spriteset_Map.prototype.createUpperLayer = function() {
    createUpperLayer.call(this);
    lightingManager.loadScene(this);
    shadowManager.refresh();
}

Spriteset_Map.prototype.update = function() {
    update.call(this);
    lightingManager.update();
}
