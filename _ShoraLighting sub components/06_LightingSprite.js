class LightingSprite extends PIXI.Sprite {

    get character() {
        return this.id ? $gameMap._events[this.id] : $gamePlayer;
    }

    constructor(options) {
        super(TextureManager.filter(options));
        this.pluginName = 'light';

        this.renderable = false;
        this.id = options.id;
        this.fileName = options.filename;
        this.colorFilter = options.colorfilter;

        this.status = options.status;
        this.radius = new ScaleAnimation(this, options);
        this.rotate = new AngleAnimation(this, options);

        this.offset = new OffsetAnimation(options.offset);
        this.setPostion(options);
        this.anchor.set(0.5);

        this.flicker = new FlickerAnimation(this, options.animation.flicker);
        this.color = new TintAnimation(this, options);
        this.blendMode = PIXI.BLEND_MODES.ADD;

        this._shadow = options.shadow;
        this.shadowOffsetX = options.shadowoffsetx || 0;
        this.shadowOffsetY = options.shadowoffsety || 0; 
        this.bwall = options.bwall;
        // if (!this.bwall) // 54.00001; tw * h + 6 + eps
        //     this.shadowOffsetY += $gameShadow.getWallHeight(this.worldX(), this.worldY());
        this.shadow = new Shadow(this.worldX(), this.worldY(), this.worldBounds(), options.shadowambient, this.width, this.height, this.rotation);

        this.updateDisplay();
        this._justMoving = 2;
    }
    destroy() {
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

        super.destroy();
    }

    update() {
        if (!this.status) 
            return this.renderable = false;
        this.updateAnimation();
        this.updatePostion();
        this.updateShadow();
    }

    _render(renderer) {
        this.calculateVertices();
        //this.shadowTexture = PIXI.Texture.WHITE;
        this.texture.baseTexture.shadow = this._shadow ? this.shadow.texture : PIXI.Texture.WHITE;

        renderer.batch.setObjectRenderer(renderer.plugins[this.pluginName]);
        renderer.plugins[this.pluginName].render(this);
    }

    needRecalculateShadow() {
        if (!this._shadow) 
            return false;
        if (this.offset.updating()) 
            return true;
        if (this.character.isStopping()) {
            if (this._justMoving < 2) 
                return ++this._justMoving;
            return false;
        }
        return this._justMoving = 0, true;
    }

    needRerenderShadow() {
        return this.needRecalculateShadow() || !this.shadow._rendered || 
        this.radius.updating() || this.rotate.updating();
    }

    updateShadow() {
        if (!this._shadow || !this.needRerenderShadow()) return;
        if (this.needRecalculateShadow())
            this.shadow.calculate(this.sourceX(), this.sourceY(), this.worldBounds());
        this.shadow.render(this.worldX(), this.worldY(), this.width, this.height, this.rotation);
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
        let minX = x - (this.width / 2),
            minY = y - (this.height / 2),
            maxX = x + (this.width / 2),
            maxY = y + (this.height / 2);
        this.renderable = $gameLighting.inDisplay(minX, minY, maxX, maxY);
    }

    worldX() {
        return this.x + $gameMap.displayX() * $gameMap.tileWidth();
    }

    sourceX() {
        return this.worldX() + this.shadowOffsetX;
    }

    worldY() {
        return this.y + $gameMap.displayY() * $gameMap.tileHeight();
    }

    sourceY() {
        return this.worldY() + this.shadowOffsetY;
    }

    worldBounds() {
        let bounds = this.getBounds();
        bounds.x += $gameMap.displayX() * $gameMap.tileWidth();
        bounds.y += $gameMap.displayY() * $gameMap.tileHeight();
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
        this.rotate.set(angle, time || 1, type);
    }

    setTint(color, time, type) {
        console.log(color, time);
        this.color.set(color, time || 1, type);
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
    }
}

