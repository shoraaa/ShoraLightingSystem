

class Layer {
    constructor() {
        this.baseTextureCache = {};
        this.lightingCache = {};
        this.mapId = 0;
        this.preload();
    }
    
    preload() {
        const fs = require('fs');
        const path = require('path');
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
        if (this.lighting) this.lighting.destroy();
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

class LightingLayer {
    constructor() {
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
        for (const light of $gameLighting.lighting()) this.addLight(light);
    }

    /**
     * Add a light sprite to layer.
     * @param {Object} options 
     */
    addLight(options) {
        const lighting = new LightingSprite(options);
        this.layer.addChild(lighting);
        return lighting;
    }

    /**
     * Remove a light sprite to layer.
     * @param {Number} id 
     */
    removeLight(id) {
		let index = this.layer.children.findIndex(light => light.id === id);
        if (index === -1) { Shora.warn('cant remove light' + id); return; }
        const light = this.layer.removeChildAt(index);
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
    /**
     * 
     * @param {Number} color 
     * @param {Number} time 
     */
    setMapColor(color, time) {
        this._surface.setMapColor(color, time);
    }
}

Shora.Animation = class {
    constructor(sprite, status) {
        this._sprite = sprite;
        this._status = status;
    }
    static get transition() {
        return [
            function(time) { // linear
                return time;
            },
            function(time) { // easeInOut
                let sqt = time * time;
                return sqt / (2.0 * (sqt - time) + 1.0);
            }
        ]
    }
    destroy() {
        this._sprite = null;
    }
}

class FlickerAnimation extends Shora.Animation {
    constructor(sprite, options) {
        super(sprite, options.status);

        this.oalpha = 1;
	    this.flickIntensity = options.flickintensity || 1;
        this.flickSpeed = options.flickspeed || 1;
        
	    this._flickSpeed = 20 * this.flickSpeed;
	    this._flickIntensity = 1 / (1.1 * this.flickIntensity);
	    this._flickMax = 1000;
	    this._flickCounter = this.flickMax;
    }

    update() {
        if (!this._status) return;
        if (this._flickCounter > 0 && Math.randomInt(this._flickCounter / 5) !== 0) {
            this._flickCounter -= this._flickSpeed;
            this._sprite.alpha = this.oalpha;
        } else {
            this._flickCounter = this._flickMax;
            this._sprite.alpha = this._flickIntensity;
        }
    }
}

class PulseAnimation extends Shora.Animation {
    constructor(sprite, options, range) {
        super(sprite, options.status);
        this.pulsating = true;

        this.range = range;
        this.pulseFactor = 0;
        this.pulseMax = this.range + this.pulseFactor;
		this.pulseMin = this.range - this.pulseFactor;
        this.pulseSpeed = options.pulsespeed / 1000;
        
        this.tick = this.space = 0;
    }

    set(range, time) {
        this.tick = time;
        this.space = (range - this.range) / time;
    }

    updating() {
        return this.pulseFactor !== 0;
    }

    update() {
        if (!this._status) {
            if (this.tick) {
                this.range += this.space;
                this.pulseMax = this.range + this.pulseFactor;
                this.pulseMin = this.range - this.pulseFactor;
                this.tick--;
            }
            return;
        }
        let spd = Math.random() / 100 + this.pulseSpeed;
        if (this.pulsating) {
	        if (this._sprite.scale.x < this.pulseMax) {
	            this._sprite.scale.x += spd;
	            this._sprite.scale.y += spd;
	        } else {
	            this.pulsating = false;
	        }
	    } else {
	        if (this._sprite.scale.x > this.pulseMin) {
	            this._sprite.scale.x -= spd;
	            this._sprite.scale.y -= spd;
	        } else {
	            this.pulsating = true;
	        }
	    }
    }
}

class RotationAnimation extends Shora.Animation {
    constructor(sprite, rotation, animation) {
        super(sprite, 0);
        if (rotation === 'animate') {
            this._status = 2; rotation = 0;
        } else if (rotation === 'auto') {
            this._status = 1; rotation = 0;
        } else rotation = rotation / 360 * 6.25;
        this.r0 = this.r1 = rotation; this.tickSync = this.space = 0;
        this.tick = this.time = this.delta = 0;
        this.type = 1; this.animationSpeed = animation.rotatespeed / 60;
        if (this._status === 1) {
            switch (this._sprite.character.direction()) {
                case 2:
                    this._sprite.rotation = 3.125;
                    break;
                case 4:
                    this._sprite.rotation = 4.6875;
                    break;
                case 6:
                    this._sprite.rotation = 1.5625;
                    break;
                case 8:
                    this._sprite.rotation = 0;
                    break;
            }
        } else if (!this._status) {
            this._sprite.rotation = rotation;
        }
    }

    updating() {
        return this._sprite.rotation != 0 || this._status || this.tick < this.time;
    }

    update() {
        if (this._status === 1) { // Sync with direction
            switch (this._sprite.character.direction()) {
                case 2:
                    this.set(3.125, 5);
                    break;
                case 4:
                    if (this._sprite.rotation < 1.5625) this._sprite.rotation += 6.25;
                    this.set(4.6875, 5);
                    break;
                case 6:
                    this.set(1.5625, 5);
                    break;
                case 8:
                    if (this._sprite.rotation > 3.125) this._sprite.rotation -= 6.25;
                    this.set(0, 5);
                    break;
            }
            if (this.tickSync) {
                this._sprite.rotation += this.space;
                this.tickSync--;
            }
        } else if (this._status === 2) { // automanic animation
            this._sprite.rotation += this.animationSpeed;
            if (this._sprite.rotatation > 6.25) this._sprite.rotatation -= 6.25;
        } else if (this.tick < this.time) { // custom rotation animation
            this._sprite.rotation = this.r0 + Shora.Animation.transition[this.type](this.tick / this.time) * this.delta;
            this.tick++;
        }
    }

    set(angle, time, type) {
        if (this._status === 1) {
            if (Math.abs(angle - this._sprite.rotation) < 0.01) return this.tickSync = 0;
            this.tickSync = time;
            this.space = (angle - this._sprite.rotation) / time;
        } else {
            this.r0 = this.r1; this.r1 = angle;
            this.delta = this.r1 - this.r0;
            this.time = time; this.tick = 0;
            if (type) this.type = type - 1;
        }
    }

    setAuto(auto) {
        this._status = auto;
    }
}

class OffsetAnimation {
    constructor(x, y) {
        this.x = this.ox = x;
        this.y = this.oy = y;
        this.tick_x = 2; this.time_x = this.delta_x = 1;
        this.tick_y = 2; this.time_y = this.delta_y = 1;
        this.type_x = this.type_y = 0;
    }

    updating() {
        return this.tick_x <= this.time_x || this.tick_y <= this.time_y;
    }

    setX(x, time, type) {
        this.ox = this.x;
        this.delta_x = x - this.ox;
        this.time_x = time; this.tick_x = 1;
        if (type) this.type_x = type - 1;
    }

    setY(y, time, type) {
        this.oy = this.y;
        this.delta_y = y - this.oy;
        this.time_y = time; this.tick_y = 1;
        if (type) this.type_y = type - 1;
    }

    update() {
        if (this.tick_x <= this.time_x) {
            this.x = this.ox + Shora.Animation.transition[this.type_x](this.tick_x / this.time_x) * this.delta_x;
            this.tick_x++;
        }
        if (this.tick_y <= this.time_y) {
            this.y = this.oy + Shora.Animation.transition[this.type_y](this.tick_y / this.time_y) * this.delta_y;
            this.tick_y++;
        }
    }
}

class ColorAnimation extends Shora.Animation {
    constructor(sprite, color) {
        super(sprite);
        this._sprite.tint = color;

        this.ocolor = Shora.ColorManager.hexToRGB(color);
        this.dcolor = this.ocolor;
        this.tick = this.len = 0;
    }

    set(color, time) {
        this.tick = 0; this.len = time;
        this.ocolor = this.dcolor;
        this.dcolor = Shora.ColorManager.hexToRGB(color);
    }
    update() {
        if (this.tick < this.len) {
            let p = this.tick / this.len;
            this._sprite.tint = Shora.ColorManager.transition(p, this.ocolor, this.dcolor);
            this.tick++;
        }
    }
}