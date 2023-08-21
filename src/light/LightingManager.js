import { lightConfig, shadowConfig } from "../parameters/config";

import { Lighting } from "./Lighting";
import { AmbientLayer } from "./AmbientLayer";
import { baseLightingConfig } from "../parameters/index";

import { KawaseBlurFilter } from "../core/utils";

class LightingManager {
    constructor() {
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
        this.characterLighting = [];

        this.blurFilter = [new KawaseBlurFilter(this.data.softShadowStr, this.data.softShadowQlt)];
        this.layer = new PIXI.Container();
        this.layer.filters = this.data.softShadow ? this.blurFilter : null;
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
        this.addAllCharacterLighting();
        spriteset._baseSprite.addChild(this.sprite);
    }

    removeScene(spriteset) {
        spriteset._baseSprite.removeChild(this.sprite);
        for (const lighting of this.characterLighting) {
            if (!lighting) {
                continue;
            }
            this.removeCharacterLighting(lighting.config.id);
        }
    }

    addLight(config) {
        const character = config.id ? $gameMap._events[config.id] : $gamePlayer;
        const lighting = new Lighting(config, character);
        this.characterLighting.push(lighting);
        this.layer.addChild(lighting);
    }

    addAllCharacterLighting() {
        for (const config of $gameMap._lighting) {
            if (!config) {
                continue;
            }
            this.addLight(config);
        }
    }

    update() {
        this.ambient.update();
        for (const lighting of this.characterLighting) {
            if (!lighting) {
                continue;
            }
            lighting.update();
        }
        Graphics.app.renderer.render(this.layer, this.texture, false);
    }

    addCharacterLighting(config) {
        if (!this.baseLightingConfig[config.name]) {
            config.name = 'default';
        }

        const _config = {...this.baseLightingConfig[config.name], ...config};

        this.removeCharacterLighting(_config.id);
        $gameMap._lighting[config.id] = _config;
        this.addLight(_config);
    }

    removeCharacterLighting(cid) {
        if ($gameMap._lighting[cid] && this.characterLighting[cid]) {
            const lighting = this.characterLighting[cid];
            $gameMap._lighting[cid] = this.characterLighting[cid] = null;
            this.layer.removeChild(lighting);
            lighting.destroy();
        }
    }
}

export const lightingManager = new LightingManager();