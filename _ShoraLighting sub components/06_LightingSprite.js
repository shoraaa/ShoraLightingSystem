class LightingSprite extends PIXI.Sprite {

    get character() {
        return this.id ? $gameMap._events[this.id] : $gamePlayer;
    }

    constructor(options) {
        super();

        this.renderable = false;
        this.id = options.id;
        this.status = options.status;

        this.static = options.static;

        this.fileName = options.filename;
        this.lightName = options.name;
        this.colorFilter = options.colorfilter;

        this.updateTexture();

        this.offset = new OffsetAnimation(options.offset);
        this.setPostion(options);
        this.anchor = new PIXI.Point(0.5, 0.5);
        this.bwall = options.bwall;

         if (options.direction && options.id != 'static') 
            this.direction = new DirectionManager(this);

        // animation
        this.pulse = new PulseAnimation(this, options.animation.pulse);
        this.flicker = new FlickerAnimation(this, options.animation.flicker);
        this.color = new ColorAnimation(this, options);

        this._shadow = options.shadow;
        if (this._shadow) {
            this._static = options.static;
            this.shadowOffsetX = options.shadowoffsetx || 0;
            this.shadowOffsetY = options.shadowoffsety || 0; 
            if (!this.bwall) // 54.00001; tw * h + 6 + eps
            	this.shadowOffsetY += $gameShadow.getWallHeight(this.globalX(), this.globalY());
            this.renderTexture = PIXI.RenderTexture.create(this.width, this.height); // texture to cache
            this.shadow = new Shadow(this.globalX(), this.globalY(), this.globalBounds(), options.shadowambient);
            this.setMask(this.shadow.mask);
            this.shadow.mask.renderable = true;
            this.snapshot();
            this.setMask(null);
            this.shadow.mask.renderable = false;
            if (this._static) {
                this.shadow.destroy();
                this.shadow = null;
            }
        } else {
            this.blendMode = PIXI.BLEND_MODES.ADD;
        }

        this.updateDisplay();
    }

    setMask(sprite) {
        if (!sprite) {
            this.mask = null;
            this.filters = null;
            this.blendMode = PIXI.BLEND_MODES.ADD;
            return;
        }
        if (sprite instanceof PIXI.Graphics) {
            this.filters = null;
            this.mask = sprite;
            this.blendMode = PIXI.BLEND_MODES.ADD;
        } else {
            this.mask = null;
            this.blendMode = 0;
            if (!this.shadowFilter) {
                this.shadowFilter = [new PIXI.SpriteMaskFilter(sprite)];
                this.shadowFilter[0].blendMode = PIXI.BLEND_MODES.ADD;
            }
            this.filters = this.shadowFilter;
        }
    }

    destroy() {
        this.pulse.destroy();
        this.flicker.destroy();
        this.offset.destroy();
        this.color.destroy();
        if (this.direction) 
            this.direction.destroy();
        if (this._shadow) {
            this.renderTexture.destroy(true);
            this.renderTexture = null;
            if (this.shadow) 
                this.shadow.destroy();
            this.shadow = null;
            // this.shadowFilter[0].destroy(); // PIXIv4 
            this.shadowFilter = null;
        }
        this.pulse = null;
        this.flicker = null;
        this.color = null;
        this.offset = null;
        this.rotate = null;
        this.filters = null;
        super.destroy();
    }

    snapshot() {
        TextureManager.snapshot(this)
    }

    update() {
        if (!this.status) 
            return this.renderable = false;
        this.updatePostion();
        this.updateShadow();
        this.updateAnimation();
    }

    needRecalculateShadow() {
        return !this.character.isStopping() || 
        this.offset.updating();
    }

    needUpdateShadowMask() {
        return this.needRecalculateShadow() || 
        (this.direction && this.direction.rotate.updating()) || !this.id;
    }

    updateShadow() {
        if (!this._shadow || this._static || !this.renderable) return;

        // if shadow stopped -> take a snap
        if (this.needUpdateShadowMask()) {
            // update shadow
            this.shadow.mask.x = -$gameMap.displayX() * $gameMap.tileWidth(); 
            this.shadow.mask.y = -$gameMap.displayY() * $gameMap.tileHeight();
            if (this.needRecalculateShadow()) {
                this.shadow.updateGlobal(this.globalX(), this.globalY(), this.globalBounds());
            } else {
                this.shadow.mask.x = -$gameMap.displayX() * $gameMap.tileWidth(); 
                this.shadow.mask.y = -$gameMap.displayY() * $gameMap.tileHeight();
            }
            // update mask 
            if (!this.filters) {
                this.updateTexture(); 
                this.setMask(this.shadow.mask);
            }
            
        } else if (this.filters) {
            // snap
            this.shadow.updateGlobal(this.globalX(), this.globalY(), this.globalBounds());
            this.shadow.mask.renderable = true;
            this.shadowOffsetX += $gameMap.displayX() * $gameMap.tileWidth();
            this.shadowOffsetY += $gameMap.displayY() * $gameMap.tileWidth();
            this.snapshot();
            this.shadowOffsetX -= $gameMap.displayX() * $gameMap.tileWidth();
            this.shadowOffsetY -= $gameMap.displayY() * $gameMap.tileWidth();
            this.setMask(null);
            this.shadow.mask.renderable = false;
        }
    }

    updatePostion() {
        this.x = this.character.screenX() + this.offset.x;
        this.y = this.character.screenY() + this.offset.y;
    }

    updateAnimation() {
        if (!this.renderable) return;
        this.flicker.update();
        this.offset.update();
        this.color.update();
        this.pulse.update();
        if (this.direction) this.direction.update();
    }

    updateDisplay() {
        let [x, y] = [this.x, this.y];
        let minX = x - (this.width / 2),
            minY = y - (this.height / 2),
            maxX = x + (this.width / 2),
            maxY = y + (this.height / 2);
        this.renderable = $gameLighting.inDisplay(minX, minY, maxX, maxY);
    }

    globalX() {
        return this.x + $gameMap.displayX() * $gameMap.tileWidth() + this.shadowOffsetX;
    }

    globalY() {
        return this.y + $gameMap.displayY() * $gameMap.tileHeight() + this.shadowOffsetY;
    }

    globalBounds() {
        let bounds = this.getBounds();
        bounds.x += $gameMap.displayX() * $gameMap.tileWidth() + this.shadowOffsetX;
        bounds.y += $gameMap.displayY() * $gameMap.tileHeight() + this.shadowOffsetY;
        return bounds;
    }

    localBounds() {
        const bounds = this.getBounds();
        bounds.x += this.shadowOffsetX;
        bounds.y += this.shadowOffsetY;
        return bounds;
    }

    setPostion(options) {
        // this.character = options.character; // ref -> set
        this.x = options.x != undefined ? $gameShadow.screenX(options.x / $gameMap.tileWidth())
         : this.character.screenX() + this.offset.x;
        this.y = options.y != undefined ? $gameShadow.screenY(options.y / $gameMap.tileHeight())
         : this.character.screenY() + this.offset.y;
    }

    updateTexture() {
        this.texture = TextureManager.filter($shoraLayer.load(this.fileName), this.colorFilter, this.lightName);
    }

    // command
    /**
     * Set light to color in time tick(s).
     * @param {Number} color 
     * @param {Number} time 
     */
    setColor(color, time) {
        this.color.set(color, time || 1);
    }

    setOffsetX(x, time, type) {
        this.offset.setX(x, time || 1, type);
    }

    setOffsetY(y, time, type) {
        this.offset.setY(y, time || 1, type);
    }

    setOffset(x, y, time, type) {
        this.offset.setX(x, time || 1, type);
        this.offset.setY(y, time || 1, type);
    }
    /*
    setShadow(shadow) {
        this._shadow = shadow;
    }

    setStatic(_static) {
        this.static = _static;
    }
    */
}

