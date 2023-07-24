
/* Lighting layer, contain ambient layer and lights layer. */
class Layer {
    constructor() {
        this.baseTextureCache = {}; // TODO: Wait for texture to load
        this.textureCache = {}; // TODO: Sprite Cache
        this.mapId = 0;

        this.LIGHTING = {};
        this._colorFilter = JSON.parse(Shora.Lighting.PARAMETERS.filter || '{}') ;

        this.loadParameters();
        this.loadLighting();
        
        this.lighting = null;
    }
    
    preload(filename) {
        this.baseTextureCache[filename] = ImageManager.loadLight(filename + '.png');
    }
    
    loadParameters() {
        let GAME_PARAMETERS = JSON.parse(Shora.Lighting.PARAMETERS['Game']);
        this._regionStart = Number(GAME_PARAMETERS.regionStart);
        this._regionEnd = Number(GAME_PARAMETERS.regionEnd);
        this._topRegionId = Number(GAME_PARAMETERS.topRegionId);
        this._ignoreShadowsId = Number(GAME_PARAMETERS.ignoreShadowsId);
        this._drawBelowPicture = GAME_PARAMETERS.drawBelowPicture === 'true';
        this._wallID = Number(GAME_PARAMETERS.wallID);
        this._topID = Number(GAME_PARAMETERS.topID);

        // Color List
        let COLORS = JSON.parse(JSON.parse(Shora.Lighting.PARAMETERS['helper']).colors);
        for (let i = 0; i < COLORS.length; ++i) {
            COLORS[i] = JSON.parse(COLORS[i]);
            Shora.Color[COLORS[i].name] = COLORS[i].color.toHexValue();
        }
    }

    /**
     * Load a base texture from cache.
     * @param {String} name 
     */
    load(name) {
        if (!this.baseTextureCache[name]) {
            if (name == undefined)
                throw new Error("Please don't change default lighting reference and set it back to 'default'");
            else
                throw new Error('Please add + ' + name + '.png light image to /img/lights/.');
        }
        return this.baseTextureCache[name]._baseTexture;
    }

    loadLighting() {
        // add default light
        this.addLighting(Shora.Lighting.PARAMETERS['default']);
        // add custom light
        this.addCustomLighting(Shora.Lighting.PARAMETERS['LightList']);
    }

    addCustomLighting(list) {
        list = JSON.parse(list);
        for (let i = 0; i < list.length; ++i) {
            this.addLighting(list[i]);
        }
    }

    /**
     * Register new lighting type.
     * @param {String} name 
     * @param {Object} settings 
     */
    addLighting(_settings) {
        const settings = JSON.parse(_settings);
        let name = settings.name;
        if (name == "<-- CHANGE_THIS -->") 
            return console.warn('Please set the reference of light, aka it name when adding new custom light. Register progress canceled.'); 
        
        this.preload(settings.filename);

        settings.radius = Number(settings.radius || 100) / 100;
        settings.angle = (Number(settings.angle) || 0) / 57.6; 
        settings.status = settings.status !== 'false';

        settings.direction = settings.direction === 'true';
        settings.tint = settings.tint.toHexValue();
        settings.bwall = settings.bwall === 'true';
        settings.shadow = settings.shadow === 'true';
        
        let defaultShadowAmbient = JSON.parse(Shora.Lighting.PARAMETERS['Map']).shadowAmbient;
        settings.shadowambient = 
            settings.shadowambient == "" ?  
            defaultShadowAmbient.toHexValue() :
            settings.shadowambient.toHexValue();

        settings.offset = JSON.parse(settings.offset);
        for (const p in settings.offset) {
            settings.offset[p] = Number(settings.offset[p]);
        }

        settings.shadowoffsetx = Number(settings.shadowoffsetx);
        settings.shadowoffsety = Number(settings.shadowoffsety);
        
        settings.colorfilter = JSON.parse(settings.colorfilter);
        settings.colorfilter.hue = Number(settings.colorfilter.hue);
        settings.colorfilter.brightness = Number(settings.colorfilter.brightness);
        settings.colorfilter.colortone = settings.colorfilter.colortone.toRGBA();
        settings.colorfilter.blendcolor = settings.colorfilter.blendcolor.toRGBA();

        settings.animation = JSON.parse(settings.animation);
        for (const p in settings.animation) {
            if (p[0] === '.') continue;
            settings.animation[p] = JSON.parse(settings.animation[p]);
            for (let a in settings.animation[p]) {
                settings.animation[p][a] = JSON.parse(settings.animation[p][a]);
            }
        }

        settings.name = name;
        this.LIGHTING[name] = settings;

        console.log('Shora Lighting: ' + name + ' registered');
    }

    reset() {
        this.mapId = 0;
    }

    updateIntensityFilter(spriteset, disable) {
        if (!disable && this._colorFilter.status == 'true') {
            if (Shora.isMV)
                spriteset._baseSprite.filters[0].brightness(Number(this._colorFilter.brightness));
            else
                spriteset._baseSprite.filters[0].setBrightness(Number(this._colorFilter.brightness) * 255);
        } else {
            if (Shora.isMV)
                spriteset._baseSprite.filters[0].brightness(1);
            else
                spriteset._baseSprite.filters[0].setBrightness(255);
        }
    }

    loadScene(spriteset) {
        // Automatically removeChild in old maps sprite
        this._spriteset = spriteset;
        if (!this.lighting)
            this.lighting = new LightingLayer();
        Shora.MessageY = 0;
        this.updateIntensityFilter(this._spriteset);
        if ($gameMap.mapId() === this.mapId && this._spriteset.type() == this._spritesetType && this.lighting) {
            this.lighting.update(); 
            if ($gameMap.lightingState) {
                this._spriteset._baseSprite.addChild(this.lighting.sprite);
            } else {
                this.updateIntensityFilter(spriteset, true);
            }
            return;
        }
        this._spritesetType = this._spriteset.type();
        this.mapId = $gameMap.mapId();
        this.lighting.initialize(this._spritesetType);
        if ($gameMap.lightingState) {
            this._spriteset._baseSprite.addChild(this.lighting.sprite);
        } else {
            this.updateIntensityFilter(spriteset, true);
        }
    }

    removeScene(spriteset) {
        this.updateIntensityFilter(spriteset, true);
        spriteset._baseSprite.removeChild($shoraLayer.lighting.sprite);
    }

    update() {
        if ($gameMap.mapId() != this.mapId)
            this.mapId = $gameMap.mapId(),
            $gameMap._lighting = [];
        this.lighting.update();
    }
    
}


class LightingLayer {
    constructor() {
        this.lights = [];
        this.softShadowFilters = [new KawaseBlurFilter($gameLighting.softShadowStr, $gameLighting.softShadowQlt)];
        
        this.layer = new PIXI.Container();
        this.texture = PIXI.RenderTexture.create(Graphics.width, Graphics.height);
		this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        
        this._displayX = this._displayY = -1;

        this.createAmbientLayer();
    }

    initialize(spritesetType) {
        // soft shadow
        this.softShadowFilters[0]._blur = $gameLighting.softShadowStr;
        this.softShadowFilters[0].quality = $gameLighting.softShadowQlt;
        this.layer.filters = $gameLighting.softShadow ? this.softShadowFilters : null;
        // clear dynamic lighting layer
        for (const light of this.lights) if (light) 
            this.removeLight(light.id);
        this.lights = [];
        // shadow

        if (spritesetType === 'map') {
            $gameShadow.refresh();
            this.addLightingSprite();
        } else if (spritesetType === 'battle') {
            $gameShadow.clear();
            this.addBattleLightingSprite();
        }
        this.update();
    }

    destroy() {
        for (const light of this.lights) if (light) 
            this.removeLight(light.id);
        this.staticLighting.destroy(true);
        this.layer.removeChild(this.staticLighting);
        this.staticLighting = this._staticLighting = null;
        this.lights = null;
        this.layer.destroy(true);
        this.layer.filters = null;
        this.layer = null;
        this.sprite.destroy(true);
        this.sprite = null;
        this.texture = null;
    }

    createAmbientLayer() {
        this._ambient = new AmbientLayer();
	    this.layer.addChild(this._ambient);
    }

    addLightingSprite() {
        for (const light of $gameMap._lighting) if (light)
            this.addLight(light);
    }

    addBattleLightingSprite() {
        for (let i = 0; i < $shoraLayer._spriteset._actorSprites.length; ++i) {
            let ac = $shoraLayer._spriteset._actorSprites[i];
            console.log(ac);
        }
        for (let i = 0; i < $shoraLayer._spriteset._enemySprites.length; ++i) {
            let en = $shoraLayer._spriteset._enemySprites[i];
            console.log(en);
        }
    }

    /**
     * Add a light sprite to layer.
     * @param {Object} options 
     */
    addLight(options) {
        const light = new LightingSprite(options);
        this.lights[options.id] = light;
        this.layer.addChild(light);
    }

    addStaticLight(options) {
        return; // TODO
        const light = new LightingSprite(options);
        light.renderable = true;
        //light.texture.baseTexture.premultipliedAlpha = false;
        if (Shora.isMV)
            light.blendMode = PIXI.BLEND_MODES.NORMAL; // TODO
        //light.x += $gameMap.displayX() * $gameMap.tileWidth();
        //light.y += $gameMap.displayY() * $gameMap.tileHeight();
        Graphics.app.renderer.render(light, this._staticLighting, this._clearStaticLayer);
        this._clearStaticLayer = false;
        // lights will get automatically destroyed by texture collector
        // light.destroy();
    }

    /**
     * Remove a light sprite to layer.
     * @param {Number} id 
     */
    removeLight(id) {
        if (!this.lights[id]) 
            return Shora.warn('cant remove light' + id); 
        const light = this.lights[id];
        this.lights[id] = null;
        this.layer.removeChild(light);
        light.destroy();
	}

    update() {
        if (this._displayX !== $gameMap.displayX() || this._displayY !== $gameMap.displayY()) {
            this._displayX = $gameMap.displayX(); this._displayY = $gameMap.displayY();
            this.updateDisplay();
        }
        for (const child of this.layer.children) {
            if (child.update) child.update();
        }
        Graphics.app.renderer.render(this.layer, this.texture, false);
    }

    updateDisplay() {
        $gameLighting.updateDisplay();
        for (const child of this.layer.children) {
            if (child.updateDisplay) child.updateDisplay();
        }
    }

    // command
    setMapAmbient(color, time) {
        this._ambient.set(color, time);
    }

}

class AmbientLayer extends PIXI.Graphics {
    constructor() {
        super();
        this.id = -1;
        this.beginFill(0xffffff);
	    this.drawRect(0, 0, Graphics.width, Graphics.height);
        this.endFill();
        this.tint = $gameLighting.ambient;
        this.ambient = new TintAnimation(this, this);
    }

    destroy() {
        this.ambient.destroy();
        this.ambient = null;
        super.destroy();
    }

    set(color, time) {
        this.ambient.set(color, time || 1);
    }

    update() {
        this.ambient.update();
        $gameLighting.ambient = this.tint;
    }

}

