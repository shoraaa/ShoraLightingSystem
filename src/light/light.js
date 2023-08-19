import { TextureManager } from "../core/utils";

export class Light {
    constructor(config, position) {
        this.config = config;
        this.position = position;

        this.filename = config.filename;
        this.id = config.id;

        this.sprite = new PIXI.Sprite(TextureManager.filter(config));

        this.sprite.anchor.set(0.5);
        this.sprite.blendMode = PIXI.BLEND_MODES.ADD;
    }

    update() {
        this.sprite.x = this.position.screenX();
        this.sprite.y = this.position.screenY();
    }
}