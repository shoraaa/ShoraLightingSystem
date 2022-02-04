class LightingLayer {
    constructor(spritesetType) { // TODO
        this.lights = [];
        this.layer = new PIXI.Container();
        this.layer.filters = [new PIXI.filters.BlurFilter($gameLighting.softShadowStr * 1e-4, $gameLighting.softShadowQlt *  1e-4)];
        if (!$gameLighting.softShadow)
            this.layer.filters = null;


        this.lightTexture = PIXI.RenderTexture.create(Graphics.width, Graphics.height);
		this.lightSprite = new PIXI.Sprite(this.lightTexture);
        this.lightSprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        
        this._displayX = this._displayY = -1;

        this._staticLighting = PIXI.RenderTexture.create($gameLighting.width(), $gameLighting.height()); 
        this.staticLighting = new PIXI.Sprite(this._staticLighting);

        $gameShadow.refresh();
        Shora._shadowTexture.resize($gameLighting.width(), $gameLighting.height());
        this.createDarkenLayer();
        this.createLightingSprite();

        this.layer.addChild(this.staticLighting);
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
        this.lightSprite.destroy(true);
        this.lightSprite = null;
        this.lightTexture = null;
    }

    createDarkenLayer() {
        this._surface = new LightingSurface();
	    this.layer.addChild(this._surface);
    }

    createLightingSprite() {
        for (const light of $gameMap._lighting) if (light)
            this.addLight(light);
        for (const light of $gameMap._staticLighting)
            this.addCustomLight(light);
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
        const light = new LightingSprite(options);
        light.renderable = true;
        light.texture.baseTexture.premultipliedAlpha = false;
        if (Shora.EngineVersion == 'MV')
            light.blendMode = PIXI.BLEND_MODES.NORMAL; // TODO
        light.x += $gameMap.displayX() * $gameMap.tileWidth();
        light.y += $gameMap.displayY() * $gameMap.tileHeight();
        Graphics.app.renderer.render(light, this._staticLighting, false);
        // lights will get automatically destroyed by texture collector
        light.destroy();
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
        Graphics.app.renderer.render(this.layer, this.lightTexture, false);
    }

    updateDisplay() {
        $gameLighting.updateDisplay();
        $gameShadow.update();
        for (const child of this.layer.children) {
            if (child.updateDisplay) child.updateDisplay();
        }
        this.staticLighting.x = -$gameMap.displayX() * $gameMap.tileWidth(); 
        this.staticLighting.y = -$gameMap.displayY() * $gameMap.tileHeight();
    }

    // command
    setMapAmbient(color, time) {
        this._surface.setMapAmbient(color, time);
    }

}

