class Layer {
    constructor() {
        /* MV ONLY */
        if (Shora.Lighting.PARAMETERS.version.toUpperCase() == 'MV') {
            Shora.MVOverload();
        }

        this.baseTextureCache = {};
        this.lightingCache = {};
        this.mapId = 0;
        this.preload();
    }
    
    preload() {
        const fs = require('fs');
        const path = require('path');
        Shora.DIR_PATH = path.join(path.dirname(process.mainModule.filename));
        let cache = this.baseTextureCache;
        let dirPath = path.join(Shora.DIR_PATH, 'img', 'lights');
        fs.readdir(dirPath, function (err, files) {
            if (err) return Shora.warn('Unable to scan directory: ' + err);
            files.forEach(function(file) {
                cache[file] = ImageManager.loadLight(file);
            });
        });
    }

    /**
     * Load a base texture from cache.
     * @param {String} name 
     */
    load(name) {
        return this.baseTextureCache[name + '.png']._baseTexture;
    }

    /**
     * Return the texture of cached lighting.
     * @param {String} name 
     */
    textureCache(name) {
        return this.lightingCache[name];
    }

    /**
     * Create a layer instance.
     * @param {Spriteset_Base} spriteset 
     */
    createLayer(spriteset) {  
        this._spriteset = spriteset;
    }

    loadScene() {
        Shora.MessageY = 0;

        if ($gameMap.mapId() === this.mapId && this.lighting) {
            this._spriteset.addChild(this.lighting.lightSprite); return;
        }

        this.mapId = $gameMap.mapId();
        if (this.lighting) 
            this.lighting.destroy();
        switch (this._spriteset.type()) {
            case 'map':
                this.lighting = new LightingLayer();
        }
        this._spriteset.addChild(this.lighting.lightSprite);
    }

    update() {
        this.updateLight();
    }

    updateLight() {
        this.lighting.update();
    }
    
}

$shoraLayer = new Layer();
