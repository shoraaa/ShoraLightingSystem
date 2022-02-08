class LightingSprite extends PIXI.Sprite {

    get character() {
        return this.id ? $gameMap._events[this.id] : $gamePlayer;
    }

    constructor(options) {
        let baseSprite = TextureManager.filter(options);
        super();

        this._baseSprite = baseSprite;
        this._baseSprite.anchor.set(0.5);

        this.renderable = false;
        this.id = options.id;
        this.fileName = options.filename;
        this.colorFilter = options.colorfilter;

        this.radius = new ScaleAnimation(this, options);
        this.rotate = new AngleAnimation(this, options);
        this.status = options.status;

        this.offset = new OffsetAnimation(options.offset);
        this.setPostion(options);
        this.anchor.set(0.5);

        this.flicker = new FlickerAnimation(this, options.animation.flicker);
        this.color = new TintAnimation(this, options);

        this.texture = PIXI.RenderTexture.create(this._baseSprite.width, this._baseSprite.height);
        this.blendMode = PIXI.BLEND_MODES.ADD;

        this._baseSprite.position.set(this._baseSprite.width / 2, this._baseSprite.height / 2);
        Graphics.app.renderer.render(this._baseSprite, this.texture);

        this._shadow = options.shadow;
        this.bwall = options.bwall;
        this.shadowOffsetX = options.shadowoffsetx || 0;
        this.shadowOffsetY = options.shadowoffsety || 0; 
        if (!this.bwall) // 54.00001; tw * h + 6 + eps
            this.shadowOffsetY += $gameShadow.getWallHeight(this.worldX(), this.worldY());
        this.shadow = new Shadow(this.worldX(), this.worldY(), this.worldBound(), options.shadowambient, this.shadowOffsetX, this.shadowOffsetY);
        if (this._shadow) 
            this.shadow.render(this.texture);

        this.updateDisplay();
        this._justMoving = 2;
    }
    destroy() {
        this._baseSprite.destroy(); // don't destroy texture
        this._baseSprite = null;

        this.radius.destroy();
        this.flicker.destroy();
        this.offset.destroy();
        this.color.destroy();
        this.rotate.destroy();
        this.shadow.destroy();
        this.radius = null;
        this.flicker = null;
        this.color = null;
        this.offset = null;
        this.rotate = null;
        this.shadow = null;

        super.destroy(true);
    }

    update() {
        if (!this.status) 
            return this.renderable = false;
        this.updateAnimation();
        this.updatePostion();
        this.updateTexture();
    }

    needRecalculateShadow() {
        if (this.offset.updating()) 
            return true;
        if (this.character.isStopping()) {
            if (this._justMoving < 2) 
                return ++this._justMoving;
            return false;
        }
        return this._justMoving = 0, true;
    }

    needRerender() {
        return this.needRecalculateShadow() || this.radius.updating() || this.rotate.updating();
    }

    updateTexture() {
        if (!this.renderable || !this.needRerender()) return;
        this.__render();
    }

    __render() {
        Graphics.app.renderer.render(this._baseSprite, this.texture);
        if (this._shadow) {
            if (this.needRecalculateShadow()) 
                this.shadow.update(this.worldX(), this.worldY(), this.worldBound(), this.shadowOffsetX, this.shadowOffsetY);
            this.shadow.render(this.texture);
        }
    }

    updatePostion() {
        this.x = Math.round(this.character.screenX() + this.offset.x);
        this.y = Math.round(this.character.screenY() + this.offset.y);
    }

    updateAnimation() {
        this.offset.update();
        if (!this.renderable) return;
        this.flicker.update();
        this.color.update();
        this.radius.update();
        this.rotate.update();
    }

    updateDisplay() {
        // TODO: Better culling
        let [x, y] = [this.x, this.y];
        let minX = x - (this._baseSprite.width / 2),
            minY = y - (this._baseSprite.height / 2),
            maxX = x + (this._baseSprite.width / 2),
            maxY = y + (this._baseSprite.height / 2);
        this.renderable = $gameLighting.inDisplay(minX, minY, maxX, maxY);
    }

    worldX() {
        return this.x + $gameMap.displayX() * $gameMap.tileWidth() + this.shadowOffsetX;
    }

    worldY() {
        return this.y + $gameMap.displayY() * $gameMap.tileHeight() + this.shadowOffsetY;
    }

    worldBound() {
        let bounds = this.getBounds();
        bounds.x += $gameMap.displayX() * $gameMap.tileWidth() + this.shadowOffsetX;
        bounds.y += $gameMap.displayY() * $gameMap.tileHeight() + this.shadowOffsetY;
        return bounds;
    }

    setPostion(options) {
        this.x = options.x != undefined ? $gameShadow.worldToScreenX(options.x)
         : this.character.screenX() + this.offset.x;
        this.y = options.y != undefined ? $gameShadow.worldToScreenY(options.y)
         : this.character.screenY() + this.offset.y;
    }

    setRadius(radius, time, type) {
        this.radius.set(radius, time || 1, type);
    }

    setAngle(angle, time, type) {
        // update .rotation instead of .angle for pixiv4 support
        this.rotate.set(angle / 57.6, time || 1, type);
    }

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
    setShadow(shadow) {
        $gameMap._lighting[this.id].shadow = this._shadow = shadow;
        this.__render();
    }
}

