import { lightingManager } from "../light/LightingManager";

const initialize = Game_Character.prototype.initialize;
Game_Character.prototype.initialize = function() {
    initialize.call(this);
    this._lightConfig = {};
    this.lighting = false;
}

const update = Game_Character.prototype.update;

Game_Character.prototype.update = function() {
    update.call(this);
    this.updateLighting();
}

Game_Character.prototype.updateLighting = function() {
    if (!!this._lightConfig.status && !this.lighting) {
        this.lighting = true;
        lightingManager.addCharacterLighting(this._lightConfig);
    }
    if (!this._lightConfig.status && this.lighting) {
        this.lighting = false;
        lightingManager.removeCharacterLighting(this._lightConfig);
    }
}