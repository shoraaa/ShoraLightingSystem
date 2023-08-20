export class AmbientLayer extends PIXI.Graphics {
    constructor(config) {
        super();

        this.config = config;

        this.id = -1;
        this.tint = config.ambient;

        this.beginFill(0xffffff);
	    this.drawRect(0, 0, Graphics.width, Graphics.height);
        this.endFill();

        this.blendMode = PIXI.BLEND_MODES.NORMAL;
    }

    update() {
        this.config.ambient = this.tint;
    }

}
