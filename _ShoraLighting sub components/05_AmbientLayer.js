class AmbientLayer extends PIXI.Graphics {
    constructor() {
        super();
        this.id = -1;
        this.beginFill(0xffffff);
	    this.drawRect(0, 0, Graphics.width, Graphics.height);
        this.endFill();
        this.tint = $gameLighting.ambient;
        this.ambient = new TintAnimation(this, this);
    }

    destroy() {
        this.ambient.destroy();
        this.ambient = null;
        super.destroy();
    }

    set(color, time) {
        this.ambient.set(color, time || 1);
    }

    update() {
        this.ambient.update();
        $gameLighting.ambient = this.tint;
    }

}

