

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
    constructor(sprite, angle, animation) {
        super(sprite, 0);
        if (angle === 'animate') {
            this._status = 2; rotation = 0;
        } else if (angle === 'auto') {
            this._status = 1; angle = 0;
        } else angle = angle / 360 * 6.25;
        this.r0 = this.r1 = angle; this.tickSync = this.space = 0;
        this.tick = this.time = this.delta = 0;
        this.type = 1; this.animationSpeed = animation.rotatespeed / 60;
        this.offset = 0; this.currentDirection = 8; this.needReset = 0;
        // if (this._status === 1) {
        //     switch (this._sprite.character.direction()) {
        //         case 2:
        //             this._sprite.rotation = 3.125;
        //             break;
        //         case 4:
        //             this._sprite.rotation = 4.6875;
        //             break;
        //         case 6:
        //             this._sprite.rotation = 1.5625;
        //             break;
        //         case 8:
        //             this._sprite.rotation = 0;
        //             break;
        //     }
        // } else 
        if (!this._status) {
            this._sprite.rotation = angle;
        }
    }

    updating() {
        return this.tick < this.time;
    }

    update() {
        if (this._status === 1 && this.currentDirection !== this._sprite.character.direction()) { // Sync with direction
            this.currentDirection = this._sprite.character.direction();
            this.needReset = 1;
            switch (this.currentDirection) {
                case 2:
                    this.set(3.125, 30);
                    break;
                case 4:
                    this.set(4.6875, 30);
                    break;
                case 6:
                    this.set(1.5625, 30);
                    break;
                case 8:
                    this.set(0, 30);
                    break;
            }
        } else if (this._status === 2) { // automatic animation
            this._sprite.rotation += this.animationSpeed;
            if (this._sprite.rotation > 6.25) this._sprite.rotation -= 6.25;
        } else if (this.tick < this.time) { // custom rotation animation
            this._sprite.rotation = this.r0 + Shora.Animation.transition[this.type](this.tick / this.time) * this.delta;
            this.tick++;
        }
    }

    setDirectedSprite() {
        switch (this._sprite.character.direction()) {
            case 2:
                this.offset = 3.125;
                break;
            case 4:
                this.offset = 4.6875;
                break;
            case 6:
                this.offset = 1.5625;
                break;
            case 8:
                this.offset = 0;
                break;
        }
    }

    set(angle, time, type) {
        this.r0 = this.r1; this.r1 = angle;
        this.delta = this.r1 - this.r0;
        this.time = time; this.tick = 0;
        if (type) this.type = type - 1;
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