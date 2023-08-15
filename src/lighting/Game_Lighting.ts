import { pluginName } from "../parameters/header";
import { lightParameters, shadowParameters } from "../parameters";
import { Sprite } from "pixi.js";
// import { Spriteset_Map, Spriteset_Battle } from "rmmz/lib/sprites";

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

    public data: Game_LightingData;
    private layer: Sprite = new Sprite();
    private characterLights: Array<PIXI.Sprite> = [];

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

    public update(): void {
        
    }

    /*! Indirect API Functions (called by others plugins) */
    public loadScene(spriteset: any /* Spriteset_Map | Spriteset_Battle */): void {
        this.layer = new Sprite();


        spriteset._baseSprite.addChild(this.layer);
    }

    public removeScene(spriteset: any /* Spriteset_Map | Spriteset_Battle */): void {
        spriteset._baseSprite.removeChild(this.layer);
    }

    /*! Direct API Functions (called by script command) */
    public setPluginState(state: boolean): void {

    }

    public enable(): void {

    }

    public disable(): void {
        
    }

    public setStatus(id: number, status: boolean): void {
        
    }

    public setRadius(id: number): void {

    }

    public setAngle(id: number): void {

    }

    public setShadow(id: number): void {
        
    }

    public setOffset(id: number): void {

    }

    public setOffsetX(id: number): void {

    }

    public setOffsetY(id: number): void {

    }

    public setTint(id: number): void {

    }
};