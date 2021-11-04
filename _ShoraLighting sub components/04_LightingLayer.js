class LightingLayer {
    constructor() {
        this.lights = [];
        this.layer = new PIXI.Container();
        this.layer.filters = [new PIXI.filters.BlurFilter(1e-4, 2e-4)];

        this.lightTexture = PIXI.RenderTexture.create(Graphics.width, Graphics.height);
		this.lightSprite = new PIXI.Sprite(this.lightTexture);
        this.lightSprite.blendMode = PIXI.BLEND_MODES.MULTIPLY;
        
        this._displayX = this._displayY = -1;

        $gameShadow.refresh();
        this.createDarkenLayer();
        this.createLightingSprite();
    }

    destroy() {
        this.lights = null;
        this.layer.destroy(true);
        this.layer.filters = null;
        this.layer = null;
        this.lightTexture.destroy(true);
        this.lightSprite = null;
        this.lightTexture = null;
        $gameLighting._lighting = [];
    }

    createDarkenLayer() {
        this._surface = new LightingSurface();
	    this.layer.addChild(this._surface);
    }

    createLightingSprite() {
        for (const light of $gameLighting.lighting) 
            this.addLight(light);
    }

    /**
     * Add a light sprite to layer.
     * @param {Object} options 
     */
    addLight(options) {
        const lighting = new LightingSprite(options);
        this.lights[options.id] = lighting;
        this.layer.addChild(lighting);
        if (lighting.shadow) 
            this.layer.addChild(lighting.shadow.mask);
    }

    /**
     * Remove a light sprite to layer.
     * @param {Number} id 
     */
    removeLight(id) {
		let index = this.layer.children.findIndex(light => light.id === id);
        if (index === -1) { Shora.warn('cant remove light' + id); return; }
        const light = this.layer.removeChildAt(index);
        this.lights[light.id] = null;
        light.destroy(light.static);
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
    }

    // command
    setMapAmbient(color, time) {
        this._surface.setMapAmbient(color, time);
    }

}

