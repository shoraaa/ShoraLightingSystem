class LightingLayer {
    constructor() {
        this.lights = [];
        this.softShadowFilters = [new KawaseBlurFilter($gameLighting.softShadowStr, $gameLighting.softShadowQlt)];
        
        this.layer = new PIXI.Container();
        this.texture = PIXI.RenderTexture.create(Graphics.width, Graphics.height);
		this.sprite = new PIXI.Sprite(this.texture);
        this.sprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        
        this._displayX = this._displayY = -1;

        // this._staticLighting = PIXI.RenderTexture.create(Graphics.width, Graphics.height); 
        // this.staticLighting = new PIXI.Sprite(this._staticLighting);
        //this.staticLighting.blendMode = PIXI.BLEND_MODES.ADD;

        this.createAmbientLayer();
        //this.layer.addChild(this.staticLighting);
    }

    initialize() {
        // soft shadow
        this.softShadowFilters[0]._blur = $gameLighting.softShadowStr;
        this.softShadowFilters[0].quality = $gameLighting.softShadowQlt;
        this.layer.filters = $gameLighting.softShadow ? this.softShadowFilters : null;
        // clear static lighting layer
        // this._clearStaticLayer = true;
        // this._staticLighting.resize($gameLighting.width(), $gameLighting.height());
        // clear dynamic lighting layer
        for (const light of this.lights) if (light) 
            this.removeLight(light.id);
        this.lights = [];
        // shadow
        $gameShadow.refresh();

        this.addLightingSprite();

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
        // for (const light of $gameMap._staticLighting)
        //     this.addStaticLight(light);
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
        if (Shora.EngineVersion == 'MV')
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

        const renderer = Graphics.app.renderer;

        renderer.render(this.layer, this.texture, false);
    }

    updateDisplay() {
        $gameLighting.updateDisplay();
        for (const child of this.layer.children) {
            if (child.updateDisplay) child.updateDisplay();
        }
        // this.staticLighting.x = -$gameMap.displayX() * $gameMap.tileWidth(); 
        // this.staticLighting.y = -$gameMap.displayY() * $gameMap.tileHeight();
    }

    // command
    setMapAmbient(color, time) {
        this._ambient.set(color, time);
    }

}