import { parseNotes } from "../core/utils";

const setupPageSettings = Game_Event.prototype.setupPageSettings;

Game_Event.prototype.setupPageSettings = function() {
    setupPageSettings.call(this);
    if (!this._erased) {
        this.setupLighting();
    }
}

Game_Event.prototype.setupLighting = function() {
    this._lightConfig = {};
    this.page().list.forEach((comment) => {
        if (comment.code === 108 || comment.code === 408) 
            parseNotes(this._lightConfig, comment.parameters.join(''));
    });
    this._lightConfig.id = this._eventId;
}
