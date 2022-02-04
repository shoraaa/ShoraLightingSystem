class Layer {
    constructor() {
        this.baseTextureCache = {}; // TODO: Wait for texture to load
        this.mapId = 0;

        this.LIGHTING = {};
        this._colorFilter = JSON.parse(Shora.Lighting.PARAMETERS.filter || '{}') ;

        this.preload();
        this.loadLighting();
        this.loadParameters();
    }
    
    preload() {
        const fs = require('fs');
        const path = require('path');
        Shora.DIR_PATH = path.join(path.dirname(process.mainModule.filename));
        let cache = this.baseTextureCache;
        let dirPath = path.join(Shora.DIR_PATH, 'img', 'lights');
        if (!fs.existsSync(dirPath)) 
            fs.mkdirSync(dirPath)
        fs.readdir(dirPath, function (err, files) {
            if (err) return Shora.warn('Unable to scan directory: ' + err);
            files.forEach(file => cache[file] = ImageManager.loadLight(file))
        });
    }

    loadParameters() {
        let GAME_PARAMETERS = JSON.parse(Shora.Lighting.PARAMETERS['Game']);
        this._regionStart = Number(GAME_PARAMETERS.regionStart);
        this._regionEnd = Number(GAME_PARAMETERS.regionEnd);
        this._topRegionId = Number(GAME_PARAMETERS.topRegionId);
        this._ignoreShadowsId = Number(GAME_PARAMETERS.ignoreShadowsId);
        this._drawBelowPicture = GAME_PARAMETERS.drawBelowPicture === 'true';
    }

    /**
     * Load a base texture from cache.
     * @param {String} name 
     */
    load(name) {
        if (!this.baseTextureCache[name + '.png']) {
            if (name == undefined)
                throw new Error("Please don't change default lighting reference and set it back to 'default'");
            else
                throw new Error('Please add + ' + name + '.png light image to /img/lights/.');
        }
        return this.baseTextureCache[name + '.png']._baseTexture;
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
    addLighting(settings) {
        const parameters = JSON.parse(settings);
        let name = parameters.name;
        if (name == "") {
            console.warn('Lighting name field cannot be left empty. Cancelling register process.'); 
            return;
        }
        console.log('Lighting ' + name + ' is having registered');

        parameters.status = parameters.status !== 'false';

        parameters.direction = parameters.direction === 'true';
        parameters.tint = parameters.tint.toHexValue();
        parameters.bwall = parameters.bwall === 'true';
        parameters.shadow = parameters.shadow === 'true';
        parameters.static = parameters.static === 'true';
        
        parameters.shadowambient = 
            parameters.shadowambient == "" ?  
            this.shadowAmbient :
            parameters.shadowambient.toHexValue();

        parameters.offset = JSON.parse(parameters.offset);
        for (const p in parameters.offset) {
            parameters.offset[p] = Number(parameters.offset[p]);
        }

        parameters.shadowoffsetx = Number(parameters.shadowoffsetx);
        parameters.shadowoffsety = Number(parameters.shadowoffsety);
        
        parameters.colorfilter = JSON.parse(parameters.colorfilter);
        parameters.colorfilter.hue = Number(parameters.colorfilter.hue);
        parameters.colorfilter.brightness = Number(parameters.colorfilter.brightness);
        parameters.colorfilter.colortone = parameters.colorfilter.colortone.toRGBA();
        parameters.colorfilter.blendcolor = parameters.colorfilter.blendcolor.toRGBA();

        parameters.animation = JSON.parse(parameters.animation);
        for (const p in parameters.animation) {
            if (p[0] === '.') continue;
            parameters.animation[p] = JSON.parse(parameters.animation[p]);
            for (let a in parameters.animation[p]) {
                parameters.animation[p][a] = JSON.parse(parameters.animation[p][a]);
            }
        }

        parameters.name = name;
        this.LIGHTING[name] = parameters;
    }

    reset() {
        this.mapId = 0;
    }

    /**
     * Create a layer instance.
     * @param {Spriteset_Base} spriteset 
     */
    createLayer(spriteset) { 
        if (this._spriteset)
            this.removeScene();
        this._spriteset = spriteset;
    }

    updateIntensityFilter() {
        if (this._colorFilter.status == 'true') {
            if (!this.colorFilter)
                this.colorFilter = new PIXI.filters.ColorMatrixFilter();
            if (!this._spriteset._baseSprite.filters)
                this._spriteset._baseSprite.filters = [this.colorFilter];
            else 
                this._spriteset._baseSprite.filters.push(this.colorFilter);
            this.colorFilter.brightness(Number(this._colorFilter.brightness));
        } else {
            if (this._spriteset._baseSprite.filters && this._spriteset._baseSprite.filters[1])
                this._spriteset._baseSprite.filters.pop();
        }
    }

    loadScene() {
        Shora.MessageY = 0;
        this.updateIntensityFilter();
        if ($gameMap.mapId() === this.mapId && this._spriteset.type() == this._spritesetType && this.lighting) 
            return this._spriteset._baseSprite.addChild(this.lighting.lightSprite); 
        this._spritesetType = this._spriteset.type();
        this.mapId = $gameMap.mapId();
        if (this.lighting) 
            this.lighting.destroy(),
            this.lighting = null;
        this.lighting = new LightingLayer(this._spritesetType);
        this._spriteset._baseSprite.addChild(this.lighting.lightSprite);
    }

    removeScene() {
        if (this._spriteset._baseSprite.filters && this._spriteset._baseSprite.filters[1])
            this._spriteset._baseSprite.filters.pop();
        this._spriteset._baseSprite.removeChild($shoraLayer.lighting.lightSprite);
        this.lighting.destroy(),
        this.lighting = null;
    }

    update() {
        if ($gameMap.mapId() != this.mapId)
            this.mapId = $gameMap.mapId(),
            $gameMap._lighting = [];
        this.updateLight();
    }

    updateLight() {
        this.lighting.update();
    }
    
}

$shoraLayer = new Layer();

