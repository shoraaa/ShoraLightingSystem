import { pluginName } from "../parameters/header";
import { lightConfig, shadowConfig } from "../parameters/config";

import { Light } from "../light/light";
import { AmbientLayer } from "../light/ambient";
import { baseLightingConfig } from "../parameters/index";

class Game_Lighting {
    constructor() {
        console.log(pluginName + " API had been construted. Use the method provided by $gameLighting to get started.");
        this.data = {
            _disabled: false,

            ambient: lightConfig.ambient,
            shadowAmbient: lightConfig.ambient,
            topBlockAmbient: lightConfig.topAmbient,

            softShadow: shadowConfig.soft.status,
            softShadowQlt: shadowConfig.soft.quality,
            softShadowStr: shadowConfig.soft.strength,
        };
        this.baseLightingConfig = baseLightingConfig;

        this.lights = [];
        this.layer = new PIXI.Container();
    }

    createSprite() {
        if (this.sprite) {
            return;
        }
        this.texture = PIXI.RenderTexture.create(Graphics.width, Graphics.height);
        this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
    }

    addAmbientLayer() {
        if (this.ambient) {
            return;
        }
        this.ambient = new AmbientLayer(this.data);
        this.layer.addChild(this.ambient);
    }




    /*! Post-Processing */
    loadScene(spriteset) {
        this.createSprite();
        this.addAmbientLayer();
        this.addCharacterMapLighting();
        spriteset._baseSprite.addChild(this.sprite);
    }

    removeScene(spriteset) {
        spriteset._baseSprite.removeChild(this.sprite);
        this.layer.removeChildren(1);
    }

    addLight(config) {
        const character = config.id ? $gameMap._events[config.id] : $gamePlayer;
        const light = new Light(config, character);
        this.lights.push(light);
        this.layer.addChild(light.sprite);
    }

    addCharacterMapLighting() {
        for (const config of $gameMap._lighting) {
            if (!config) {
                continue;
            }
            this.addLight(config);
        }
    }

    update() {
        this.ambient.update();
        for (const light of this.lights) {
            light.update();
        }
        Graphics.app.renderer.render(this.layer, this.texture, false);
    }

    /*! Indirect API Functions */
    add(config) {
        if (!this.baseLightingConfig[config.name]) {
            config.name = 'default';
        }

        const _config = {...this.baseLightingConfig[config.name], ...config};

        $gameMap._lighting[config.id] = _config;
        this.addLight(_config);

    }

    /*! Direct API Functions (called by script command) */
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