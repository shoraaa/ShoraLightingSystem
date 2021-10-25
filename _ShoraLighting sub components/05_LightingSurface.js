class LightingSurface extends PIXI.Graphics {
    constructor() {
        super();
        this.id = -1;
        this.beginFill(0xffffff);
	    this.drawRect(0, 0, Graphics.width, Graphics.height);
        this.endFill();
        this.tint = 0xffffff;
        this.ambient = new ColorAnimation(this, $gameLighting.PARAMETERS.ambient);
    }

    destroy() {
        this.ambient.destroy();
        this.ambient = null;
        super.destroy();
    }

    setMapAmbient(color, time) {
        $gameLighting.PARAMETERS.ambient = color;
        this.ambient.set(color, time || 1);
    }

    update() {
        this.ambient.update();
        $gameLighting.PARAMETERS.ambient = this.tint;
    }
    updateDisplay() {
        //
    }

}

