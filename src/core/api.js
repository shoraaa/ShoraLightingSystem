import { pluginName } from "../parameters/header";
import { lightingManager } from "../light/LightingManager";
class Game_Lighting {
    constructor() {
        console.log(pluginName + " API had been construted. Use the method provided by $gameLighting to get started.");
    }

    setPluginState(state) {
    }

    enable() {

    }

    disable() {
        
    }

    setStatus(id, status) {
        
    }

    setRadius(id) {

    }

    setAngle(id) {

    }

    setShadow(id) {
        
    }

    setOffset(id) {

    }

    setOffsetX(id) {

    }

    setOffsetY(id) {

    }

    setTint(id) {

    }
};

window.$gameLighting = new Game_Lighting();