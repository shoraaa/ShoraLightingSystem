import { Game_Character } from 'rmmz';

// TODO: Fork the rmmz.d.ts typescript declaration file.
const initialize: () => void = (Game_Character as any).prototype.initialize;

(Game_Character as any).prototype.initialize = function() {
    initialize.call(this);
    this._lightParameters = {};
}

