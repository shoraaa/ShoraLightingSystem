import { Game_Event } from 'rmmz';

// TODO: Fork the rmmz.d.ts typescript declaration file.
const setupPageSettings: () => void = Game_Event.prototype.setupPageSettings;

Game_Event.prototype.setupPageSettings = function() {
    setupPageSettings.call(this);
    this._lightParameters = {};
}

