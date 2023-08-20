import { shadowConfig } from "../parameters/index";
import { engineName } from "../parameters/header";

if (!shadowConfig.engineShadow) {
    Tilemap.prototype._addShadow = function() {}; 
    if (engineName === 'MV') {
        ShaderTilemap.prototype._addShadow = function() {}; 
        ShaderTilemap.prototype._drawShadow = function() {};
    }
}