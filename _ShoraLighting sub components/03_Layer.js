class Layer {
    constructor() {
        this.baseTextureCache = {};
        this.textureCache = {}; 
        this._renderTexturesPool = [];
        this._rtpCount = [];
        this.mapId = 0;

        this.LIGHTING = {};
        this._colorFilter = JSON.parse(Shora.Lighting.PARAMETERS.filter || '{}') ;

        this.loadParameters();
        this.loadLighting();
        this.createRenderTexturesPool();
        
        this.lighting = null;
    }
    
    createRenderTexturesPool() {
        return;
        this.MAX_SIZE = 1024;
        for (let i = 1; i <= this.MAX_SIZE; ++i) {
            this._rtpCount = -1;
            this._renderTexturesPool[i] = [];
            for (let j = 0; j < 8; ++j) 
                this._renderTexturesPool[i][j] = PIXI.RenderTexture.create(i, i);
        }
    }

    renderTexturesPool(w) {
        this._rtpCount++;
        if (this._rtpCount === 8) this._rtpCount = 0;
        return this._renderTexturesPool[Math.min(Math.round(w), this.MAX_SIZE)][this._rtpCount];
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
        settings.angle = Number(settings.angle) || 0; 
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

        console.log(name + ' registered');
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
        if ($gameMap.mapId() === this.mapId && this._spriteset.type() == this._spritesetType && this.lighting) 
            return this.lighting.update(), this._spriteset._baseSprite.addChild(this.lighting.sprite); 
        this._spritesetType = this._spriteset.type();
        this.mapId = $gameMap.mapId();
        this.lighting.initialize();
        this._spriteset._baseSprite.addChild(this.lighting.sprite);
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


