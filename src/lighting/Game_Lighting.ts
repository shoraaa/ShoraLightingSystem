import { pluginName } from "../parameters/header";
import { lightParameters, shadowParameters } from "../parameters";
import { Sprite, BLEND_MODES } from "pixi.js";

import { ImageManager, $gameMap } from 'rmmz';
import { Spriteset_Battle, Spriteset_Map } from 'rmmz/lib/sprites';

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
    private layer: PIXI.Sprite = new PIXI.Sprite();
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

        this.layer.blendMode = BLEND_MODES.MULTIPLY;

    }

    private loadLights(): void {
        for (const light of ($gameMap as any)._lighting) {
            if (!light) {
                continue;
            }
            const lightSprite = new (window as any).Sprite(ImageManager.loadPicture('Actor1_1'));
            this.layer.addChild(lightSprite);
        }
    }

    public update(): void {
        
    }

    /*! Indirect API Functions (called by others plugins) */
    public loadScene(spriteset: Spriteset_Map | Spriteset_Battle | any): void {
        
        spriteset._baseSprite.addChild(this.layer);
    }

    public removeScene(spriteset: Spriteset_Map | Spriteset_Battle | any): void {
        spriteset._baseSprite.removeChild(this.layer);
        this.layer.removeChildren();
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