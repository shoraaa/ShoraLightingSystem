
import { parseNotes } from "../core/utils";
import { lightingManager } from "../light/LightingManager";

const refresh = Game_Player.prototype.refresh;
Game_Player.prototype.refresh = function() {
    refresh.call(this);
    this.scanLighting();
}

Game_Player.prototype.scanLighting = function() {
    let note = '';
    let lightConfig = {id: 0};

    if ($gameParty.leader())
        note = $gameParty.leader().actor().note.split('\n');

    for (const line of note)
        parseNotes(lightConfig, line);

    if (lightConfig.name) {
        this.setLighting(lightConfig);
        return;
    } 

    lightConfig = {id: 0};
    for (const item of $gameParty.items()) {
        note = item.note.split('\n');
        for (const line of note) {
            parseNotes(lightConfig, line);
        }
        if (lightConfig.name) {
            this.setLighting(lightConfig);
            return;
        }
    }
}

Game_Player.prototype.setLighting = function(config) {
    if (this.lighting) {
        lightingManager.removeCharacterLighting(this._lightConfig);
        this.lighting = false;
    }
    this._lightConfig = config;
}