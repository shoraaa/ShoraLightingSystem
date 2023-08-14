import { pluginName } from "../core/parameters/header";
import { lightParameters, shadowParameters } from "../core/parameters";
interface Game_LightingData {
    _disabled: boolean,

    ambient: number,
    shadowAmbient: number,
    topBlockAmbient: number,

    softShadow: boolean,
    softShadowQlt: number,
    softShadowStr: number,
    
};

export default class Game_Lighting {

    data: Game_LightingData;

    public constructor() {
        console.log(pluginName + " API had been construted. Use the method provided by $gameLighting to get started.");
        this.data = {
            _disabled: false,

            ambient: lightParameters.ambient,
            shadowAmbient: shadowParameters.ambient,
            topBlockAmbient: shadowParameters.topAmbient,

            softShadow: shadowParameters.soft.status,
            softShadowQlt: shadowParameters.soft.quality,
            softShadowStr: shadowParameters.soft.strength,
        };
    }

    public setPluginState(state: boolean) {

    }

    public enable() {

    }

    public disable() {
        
    }

    public setStatus(id: number, status: boolean) {
        
    }

    public setRadius(id: number) {

    }

    public setAngle(id: number) {

    }

    public setShadow(id: number) {
        
    }

    public setOffset(id: number) {

    }

    public setOffsetX(id: number) {

    }

    public setOffsetY(id: number) {

    }

    public setTint(id: number) {

    }
};