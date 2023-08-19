export class Light {
    constructor(config, position) {
        super();
        this.config = config;
        this.position = position;

        this.filename = config.filename;
        this.id = config.id;

        this.sprite = new Sprite(ImageManager.loadLight(this.filename));

        this.anchor.set(0.5);
        this.blendMode = PIXI.BLEND_MODES.ADD;
    }

    update() {
        this.sprite.x = this.position.screenX();
        this.sprite.y = this.position.screenY();
    }
}