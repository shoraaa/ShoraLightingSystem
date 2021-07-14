

class LightingSurface extends PIXI.Graphics {
    constructor() {
        super();
        this.id = -1;
        this.beginFill(0xffffff);
	    this.drawRect(0, 0, Graphics.width, Graphics.height);
        this.endFill();
        this.tint = 0xffffff;
        this.color = new ColorAnimation(this, $gameLighting.shadowColor());
    }

    destroy() {
        this.color.destroy();
        this.color = null;
        super.destroy();
    }

    setMapColor(color, time) {
        $gameLighting.PARAMETERS.ambient = color;
        this.color.set(color, time || 1);
    }

    update() {
        this.color.update();
        $gameLighting.PARAMETERS.ambient = this.tint;
    }
    updateDisplay() {
        //
    }

}

class LightingSprite extends PIXI.Sprite {
    constructor(options) {
        super();

        this.renderable = false;
        this.id = options.id;
        this.static = options.static;

        this.fileName = options.filename;
        this.lightName = options.name;
        this.colorFilter = options.colorfilter;

        this.updateTexture();

        this.offset = new OffsetAnimation(options.offset.x, options.offset.y);
        this.setPostion(options);
        this.anchor = new PIXI.Point(0.5, 0.5);
        this.scale.x = this.scale.y = options.range;

        // direction
        if (options.rotation > 0) {
            // this.rotate = new RotationAnimation(this, options.rotation, options.animation.rotation);
            this.rotation = options.rotation / 360 * 6.25;
        } else if (options.direction) {
            this.direction = new DirectionManager(this);
        }

        // animation
        this.pulse = new PulseAnimation(this, options.animation.pulse, this.scale.x);
        this.flicker = new FlickerAnimation(this, options.animation.flicker);
        this.color = new ColorAnimation(this, Number(options.tint));

        this._shadow = options.shadow;
        if (this._shadow) {
            this._static = options.static;
            this.shadowOffsetX = options.shadowOffsetX || 0;
            this.shadowOffsetY = options.shadowOffsetY || 0; // 54.00001; tw * h + 6 + eps
            this.shadowOffsetY += $gameShadow.getWallHeight(this.globalX(), this.globalY());
            this.renderTexture = PIXI.RenderTexture.create({ width: this.width, height: this.height }); // texture to cache
            this.shadow = new Shadow(this.globalX() + this.shadowOffsetX, this.globalY() + this.shadowOffsetY, this.globalBounds());
            this.setMask(this.shadow.mask);
            if (this._static) {
                this.shadow.updateGlobal(this.globalX(), this.globalY(), this.globalBounds());
                this.snapshot();
                this.setMask(null);
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
        this.character.lighting = null;
        this.character = null;
        this.pulse.destroy();
        this.flicker.destroy();
        this.color.destroy();
        if (this.direction) this.direction.destroy();
        if (this._shadow) {
            this.renderTexture.destroy(true);
            this.renderTexture = null;
            if (this.shadow) this.shadow.destroy();
            this.shadow = null;
            this.shadowFilter[0].destroy();
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
        this.updatePostion();
        this.updateShadow();
        this.updateAnimation();
    }

    needUpdateShadowMask() {
        return this.character.isMoving() || this.pulse.updating()
        || (this.direction && this.direction.rotate.updating());// || !this.rotate;
    }

    needRecalculateShadow() {
        return this.character.isMoving() || this.offset.updating() || !this.id;
    }

    updateShadow() {
        if (!this._shadow || this._static || !this.renderable) return;

        // if shadow stopped -> take a snap
        if (this.needUpdateShadowMask()) {
            // update shadow
            //this.shadow.mask.renderable = true;
            if (this.needRecalculateShadow()) 
                this.shadow.update(this.x + this.shadowOffsetX, this.y + this.shadowOffsetY, this.localBounds());
            else {
                // pulse and rotation need only the mask to update global postion
                this.shadow.mask.x = -$gameMap.displayX() * $gameMap.tileWidth(); 
                this.shadow.mask.y = -$gameMap.displayY() * $gameMap.tileHeight();
                //console.log(this.shadow.mask.x, this.shadow.mask.y);
            }
            // update mask 
            if (!this.filters) {
                this.updateTexture(); 
                this.setMask(this.shadow.mask);
            }
        } else if (this.filters) {
            // snap
            this.shadow.mask.renderable = true;
            //console.log('snapped');
            //this.rotation = 0;
            this.shadow.updateGlobal(this.globalX(), this.globalY(), this.globalBounds());
            this.snapshot();
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
        let [x, y] = [this.character.screenX(), this.character.screenY()];
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
        this.character = options.character;
        this.x = this.character.screenX();
        this.y = this.character.screenY();
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

    setRange(range, time) {
        this.pulse.set(range, time || 1);
    }

    setOffsetX(x, time, type) {
        this.offset.setX(x, time || 1, type);
    }

    setOffsetY(y, time, type) {
        this.offset.setY(y, time || 1);
    }

    setRotation(angle, time, type) {
        this.rotate.setAuto(false);
        this.rotate.set((angle / 360) * 6.25, time || 1, type);
    }

    setAutoDirection(auto) {
        this.rotate.setAuto(auto);
    }

    setShadow(shadow) {
        this._shadow = shadow;
    }

    setStatic(_static) {
        this.static = _static;
    }
}

class Shadow {
    get mask() {
        return this.shadowMask;
    }
    constructor(ox, oy, bounds) {
        // TODO: Calculate Transform.
        this._shadowMask = new PIXI.Graphics();
        this._shadowTexture = PIXI.RenderTexture.create($gameLighting.width(), $gameLighting.height());
        this.shadowMask = new PIXI.Sprite(this._shadowTexture);

        this.updateGlobal(ox, oy, bounds);
    }

    destroy() {
        this.polygon = null; this.bounds = null; this._parallelSegments = null;
        this._shadowMask.destroy(true); this._shadowMask = null;
        this._shadowTexture = null; this.shadowMask = null;
        /* this will get destroyed by layer call
        this._shadowTexture.destroy(true); 
        this.shadowMask.destroy(true); 
        */
        this.bounds = null;
    }

    update(x, y, bounds) {
        //console.log("update x =" + x + " y = " + y);
        this.polygon = ShadowManager.computeViewport([x, y], $gameShadow.segments, [this.bounds.left, this.bounds.top], [this.bounds.right, this.bounds.bottom]);
        this.bounds = bounds;
        this._parallelSegments = {};
        this._shadowMask.clear();
        this.draw(y, $gameShadow.lowerWalls);
        Graphics.app.renderer.render(this._shadowMask, this._shadowTexture);
        // top-wall
        Graphics.app.renderer.render($gameShadow.upperWalls, this._shadowTexture, false);
    }

    updateGlobal(ox, oy, bounds) {
        //console.log("update global x =" + ox + " y = " + oy);
        this.bounds = bounds;
        this.polygon = ShadowManager.computeViewport([ox, oy], $gameShadow.globalSegments, [this.bounds.left, this.bounds.top], [this.bounds.right, this.bounds.bottom]);
        this._parallelSegments = {};
        this._shadowMask.clear();
        this.draw(oy, $gameShadow.globalLowerWalls);
        Graphics.app.renderer.render(this._shadowMask, this._shadowTexture);
        // top-wall
        let {x, y} = $gameShadow.upperWalls;
        $gameShadow.upperWalls.x = $gameShadow.upperWalls.y = 0;
        Graphics.app.renderer.render($gameShadow.upperWalls, this._shadowTexture, false);
        $gameShadow.upperWalls.x = x; $gameShadow.upperWalls.y = y;
    }

    drawWall(index, oy, lowerWalls) {
		let [x, y] = this.polygon[index], last = (index == 0 ? this.polygon.length - 1 : index - 1);
		let [nx, ny] = this.polygon[last];

		let tw = $gameMap.tileWidth();
		if (y == ny) {
			if (!this._parallelSegments[y]) this._parallelSegments[y] = [];
			this._parallelSegments[y].push([nx, x]);
		}
		for (let i = 0; i < lowerWalls.length; ++i) {
			let [x2, y2, x1, y1, height] = lowerWalls[i];
			if (y == ny && y == y1 && x >= x1 && x <= x2 && nx >= x1 && nx <= x2 && oy >= y1) {
				this._shadowMask.lineTo(nx, ny - tw * height)
							   .lineTo(x, y - tw * height)
			}
		}
	};

    containParallelSegment(y, u, v) {
		if (!this._parallelSegments[y]) return false;
		let lo = 0, hi = this._parallelSegments[y].length - 1, result = -1;
		while (lo <= hi) {
			let mid = (lo + hi) >> 1;
			if (this._parallelSegments[y][mid][0] >= u) {
				result = mid;
				hi = mid - 1;
			} else lo = mid + 1;
		}
		if (result == -1) return false;
		let [x1, x2] = this._parallelSegments[y][result];
		if (v >= x1) return true;
		if (result === 0) return false; [x1, x2] = this._parallelSegments[y][result - 1];
		if (v >= x1) return true;
	}

    draw(oy, lowerWalls) {
        this._shadowMask.beginFill(0x333333);
		this._shadowMask.drawRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
		this._shadowMask.endFill();

		this._shadowMask.beginFill(0xffffff);
		this._shadowMask.moveTo(this.polygon[0][0], this.polygon[0][1]);
		for (let i = 1; i < this.polygon.length; ++i) {
			this.drawWall(i, oy, lowerWalls);
            this._shadowMask.lineTo(this.polygon[i][0], this.polygon[i][1]);
        }
        this._shadowMask.lineTo(this.polygon[0][0], this.polygon[0][1]);
		this.drawWall(0, oy, lowerWalls);
		if (this.polygon[0][1] == this.polygon[this.polygon.length - 1][1]) {
			if (!this._parallelSegments[this.polygon[0][1]]) this._parallelSegments[this.polygon[0][1]] = [];
			this._parallelSegments[this.polygon[0][1]].push([this.polygon[0][0], this.polygon[this.polygon.length - 1][0]]);
		}
		this._shadowMask.endFill(); 

		for (let y in this._parallelSegments) {
			for (let i in this._parallelSegments[y]) {
				if (this._parallelSegments[y][i][0] > this._parallelSegments[y][i][1])
				[this._parallelSegments[y][i][0], this._parallelSegments[y][i][1]] = [this._parallelSegments[y][i][1], this._parallelSegments[y][i][0]];
			}
			this._parallelSegments[y].sort((a, b) => a[0] - b[0]);
		}

		//drawing lower-walls
        this._shadowMask.beginFill(0x333333); 
        let tw = $gameMap.tileWidth();
		for (let i = 0; i < lowerWalls.length; ++i) {
			let [x2, y2, x1, y1, height] = lowerWalls[i];
            if (this.containParallelSegment(y1, x1, x2)) continue;
			this._shadowMask.moveTo(x1, y1);
			this._shadowMask.lineTo(x1, y1-tw*height);
			this._shadowMask.lineTo(x2, y2-tw*height);
			this._shadowMask.lineTo(x2, y2);
		}
        this._shadowMask.endFill();
        
        // drawing top-walls
        // this._shadowMask.beginFill(0x333333);
        // for (let i = Math.max(0, Math.floor(this.bounds.top / 48));
        //     i <= Math.min($gameShadow.topWalls.length - 1, Math.ceil(this.bounds.bottom / 48)); ++i) {
        //     let j = $gameShadow.topWalls[i].pair_floor_search(this.bounds.left, 1) + 1;
        //     for (; j < $gameShadow.topWalls[i].length && $gameShadow.topWalls[i][j][0] < this.bounds.right; ++j) {
        //         let [begin, end] = $gameShadow.topWalls[i][j];
        //         this._shadowMask.drawRect(begin, i*48, end-begin, 48);
        //     }
        // }
        // this._shadowMask.endFill();
    }
}